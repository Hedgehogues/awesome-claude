"""Unit tests for skills/sdd/scripts/state.py."""
import os
import subprocess
import sys
import tempfile
import unittest

import yaml

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = os.path.join(REPO_ROOT, "skills", "sdd", "scripts", "state.py")


def run(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, SCRIPT, *args],
        capture_output=True,
        text=True,
    )


class TestState(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.NamedTemporaryFile(suffix=".sdd-state.yaml", delete=False)
        self.tmp.close()
        os.remove(self.tmp.name)
        self.path = self.tmp.name

    def tearDown(self) -> None:
        if os.path.exists(self.path):
            os.remove(self.path)

    # --- at-first-touch ---
    def test_read_creates_unknown_when_missing(self):
        result = run("read", self.path)
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        self.assertTrue(os.path.exists(self.path))
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertEqual(data["stage"], "unknown")
        self.assertIn("last_step_at", data)

    def test_update_creates_unknown_when_missing(self):
        result = run("update", self.path, "owner", "user@example.com")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertEqual(data["owner"], "user@example.com")
        self.assertEqual(data["stage"], "unknown")  # at-first-touch default

    # --- update ---
    def test_update_overwrites_existing(self):
        run("update", self.path, "owner", "first@example.com")
        run("update", self.path, "owner", "second@example.com")
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertEqual(data["owner"], "second@example.com")

    # --- transition rules ---
    def test_transition_proposed_to_contradiction_ok(self):
        run("update", self.path, "stage", "proposed")
        result = run("transition", self.path, "contradiction-ok")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertEqual(data["stage"], "contradiction-ok")

    def test_transition_invalid_stage_rejected(self):
        result = run("transition", self.path, "bogus-stage")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid stage", result.stderr)

    def test_transition_disallowed_rejected(self):
        run("update", self.path, "stage", "proposed")
        # proposed -> archiving is not allowed
        result = run("transition", self.path, "archiving")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("not allowed", result.stderr)

    def test_transition_full_happy_path(self):
        for stage in [
            "proposed",
            "contradiction-ok",
            "applying",
            "verifying",
            "verify-ok",
            "archiving",
            "archived",
        ]:
            # Use update to bypass transition rules between hops we don't test here.
            pass
        # Actual transitions one by one from initial unknown:
        run("update", self.path, "stage", "proposed")
        for src, dst in [
            ("proposed", "contradiction-ok"),
            ("contradiction-ok", "applying"),
            ("applying", "verifying"),
            ("verifying", "verify-ok"),
            ("verify-ok", "archiving"),
            ("archiving", "archived"),
        ]:
            result = run("transition", self.path, dst)
            self.assertEqual(
                result.returncode, 0, msg=f"{src}->{dst} failed: {result.stderr}"
            )

    def test_transition_archive_failed_can_recover(self):
        run("update", self.path, "stage", "archive-failed")
        result = run("transition", self.path, "archived")
        self.assertEqual(result.returncode, 0, msg=result.stderr)

    # --- delete ---
    def test_delete_removes_file(self):
        run("read", self.path)
        self.assertTrue(os.path.exists(self.path))
        result = run("delete", self.path)
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        self.assertFalse(os.path.exists(self.path))

    def test_delete_idempotent_on_missing_file(self):
        self.assertFalse(os.path.exists(self.path))
        result = run("delete", self.path)
        self.assertEqual(result.returncode, 0, msg=result.stderr)


if __name__ == "__main__":
    unittest.main()
