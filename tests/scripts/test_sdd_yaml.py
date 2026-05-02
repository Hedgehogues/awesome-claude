"""Unit tests for skills/sdd/scripts/_sdd_yaml.py (CLI + library)."""
import json
import os
import subprocess
import sys
import tempfile
import unittest

import yaml

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = os.path.join(REPO_ROOT, "skills", "sdd", "scripts", "_sdd_yaml.py")


def run(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, SCRIPT, *args],
        capture_output=True,
        text=True,
    )


class TestSddYamlCli(unittest.TestCase):
    def setUp(self) -> None:
        self.change_dir = tempfile.mkdtemp(prefix="sdd-test-")
        self.path = os.path.join(self.change_dir, ".sdd.yaml")
        with open(self.path, "w") as f:
            yaml.safe_dump(
                {"creates": ["foo", "bar"], "merges-into": []},
                f,
                sort_keys=False,
            )

    def tearDown(self) -> None:
        if os.path.exists(self.path):
            os.remove(self.path)
        os.rmdir(self.change_dir)

    def test_read_returns_json(self):
        result = run("read", self.change_dir)
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data["creates"], ["foo", "bar"])

    def test_move_capability_creates_to_merges(self):
        result = run("move-capability", self.change_dir, "foo", "creates", "merges-into")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertNotIn("foo", data["creates"])
        self.assertIn("foo", data["merges-into"])
        self.assertIn("bar", data["creates"])

    def test_move_capability_missing_name_errors(self):
        result = run("move-capability", self.change_dir, "missing", "creates", "merges-into")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("not in creates", result.stderr)

    def test_move_capability_invalid_field_errors(self):
        result = run("move-capability", self.change_dir, "foo", "creates", "bogus")
        self.assertNotEqual(result.returncode, 0)

    def test_move_capability_same_field_errors(self):
        result = run("move-capability", self.change_dir, "foo", "creates", "creates")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("same", result.stderr)

    def test_set_owner_writes_string(self):
        result = run("set-owner", self.change_dir, "user@example.com")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertEqual(data["owner"], "user@example.com")

    def test_set_owner_overwrites(self):
        run("set-owner", self.change_dir, "first@example.com")
        run("set-owner", self.change_dir, "second@example.com")
        with open(self.path) as f:
            data = yaml.safe_load(f)
        self.assertEqual(data["owner"], "second@example.com")

    def test_set_owner_rejects_when_existing_is_list(self):
        with open(self.path, "w") as f:
            yaml.safe_dump(
                {"creates": [], "merges-into": [], "owner": ["a@x", "b@x"]}, f
            )
        result = run("set-owner", self.change_dir, "c@x")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("list", result.stderr)


class TestSddYamlLibrary(unittest.TestCase):
    def setUp(self) -> None:
        sys.path.insert(0, os.path.dirname(SCRIPT))
        # Fresh import each test to avoid cached state
        if "_sdd_yaml" in sys.modules:
            del sys.modules["_sdd_yaml"]
        import _sdd_yaml
        self._lib = _sdd_yaml
        self.change_dir = tempfile.mkdtemp(prefix="sdd-test-")
        self.path = os.path.join(self.change_dir, ".sdd.yaml")
        with open(self.path, "w") as f:
            yaml.safe_dump({"creates": ["a"], "merges-into": ["b"]}, f)

    def tearDown(self) -> None:
        if os.path.exists(self.path):
            os.remove(self.path)
        os.rmdir(self.change_dir)

    def test_load_returns_dict(self):
        data = self._lib.load(self.change_dir)
        self.assertEqual(data["creates"], ["a"])

    def test_get_creates_helper(self):
        self.assertEqual(self._lib.get_creates(self.change_dir), ["a"])

    def test_get_merges_into_helper(self):
        self.assertEqual(self._lib.get_merges_into(self.change_dir), ["b"])

    def test_load_missing_returns_empty(self):
        empty_dir = tempfile.mkdtemp(prefix="sdd-test-empty-")
        try:
            self.assertEqual(self._lib.load(empty_dir), {})
        finally:
            os.rmdir(empty_dir)


if __name__ == "__main__":
    unittest.main()
