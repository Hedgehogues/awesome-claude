"""Unit tests for skills/sdd/scripts/identity.py."""
import os
import subprocess
import sys
import unittest
from unittest import mock

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPTS_DIR = os.path.join(REPO_ROOT, "skills", "sdd", "scripts")
sys.path.insert(0, SCRIPTS_DIR)

import identity  # noqa: E402


class FakeCompleted:
    def __init__(self, returncode: int, stdout: str = "", stderr: str = ""):
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr


class TestFromClaude(unittest.TestCase):
    @mock.patch("identity.shutil.which", return_value="/usr/bin/claude")
    @mock.patch("identity.subprocess.run")
    def test_logged_in_returns_email(self, run_mock, _which):
        run_mock.return_value = FakeCompleted(
            0, stdout='{"loggedIn": true, "email": "user@example.com"}'
        )
        self.assertEqual(identity.from_claude(), "user@example.com")

    @mock.patch("identity.shutil.which", return_value="/usr/bin/claude")
    @mock.patch("identity.subprocess.run")
    def test_logged_out_returns_none(self, run_mock, _which):
        run_mock.return_value = FakeCompleted(0, stdout='{"loggedIn": false}')
        self.assertIsNone(identity.from_claude())

    @mock.patch("identity.shutil.which", return_value="/usr/bin/claude")
    @mock.patch("identity.subprocess.run")
    def test_invalid_json_returns_none(self, run_mock, _which):
        run_mock.return_value = FakeCompleted(0, stdout="not json")
        self.assertIsNone(identity.from_claude())

    @mock.patch("identity.shutil.which", return_value="/usr/bin/claude")
    @mock.patch("identity.subprocess.run")
    def test_nonzero_exit_returns_none(self, run_mock, _which):
        run_mock.return_value = FakeCompleted(1, stderr="auth error")
        self.assertIsNone(identity.from_claude())

    @mock.patch("identity.shutil.which", return_value=None)
    def test_cli_missing_returns_none(self, _which):
        self.assertIsNone(identity.from_claude())


class TestFromGit(unittest.TestCase):
    @mock.patch("identity.shutil.which", return_value="/usr/bin/git")
    @mock.patch("identity.subprocess.run")
    def test_returns_email(self, run_mock, _which):
        run_mock.return_value = FakeCompleted(0, stdout="user@git.com\n")
        self.assertEqual(identity.from_git(), "user@git.com")

    @mock.patch("identity.shutil.which", return_value="/usr/bin/git")
    @mock.patch("identity.subprocess.run")
    def test_empty_returns_none(self, run_mock, _which):
        run_mock.return_value = FakeCompleted(0, stdout="\n")
        self.assertIsNone(identity.from_git())

    @mock.patch("identity.shutil.which", return_value=None)
    def test_git_missing_returns_none(self, _which):
        self.assertIsNone(identity.from_git())


class TestResolve(unittest.TestCase):
    @mock.patch("identity.from_claude", return_value="claude@user.com")
    @mock.patch("identity.from_git", return_value="git@user.com")
    def test_claude_takes_priority(self, _git, _claude):
        email, source = identity.resolve()
        self.assertEqual(email, "claude@user.com")
        self.assertEqual(source, "claude")

    @mock.patch("identity.from_claude", return_value=None)
    @mock.patch("identity.from_git", return_value="git@user.com")
    def test_falls_back_to_git(self, _git, _claude):
        email, source = identity.resolve()
        self.assertEqual(email, "git@user.com")
        self.assertEqual(source, "git")

    @mock.patch("identity.from_claude", return_value=None)
    @mock.patch("identity.from_git", return_value=None)
    def test_both_missing_returns_none(self, _git, _claude):
        email, source = identity.resolve()
        self.assertIsNone(email)
        self.assertIsNone(source)


class TestCli(unittest.TestCase):
    """Smoke test the actual CLI invocation against the real environment."""

    def test_cli_runs(self):
        """The CLI should either print an email or exit with non-zero + clear error."""
        result = subprocess.run(
            [sys.executable, os.path.join(SCRIPTS_DIR, "identity.py")],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            self.assertTrue(result.stdout.strip(), msg="stdout should be email")
        else:
            self.assertIn("identity not resolvable", result.stderr)


if __name__ == "__main__":
    unittest.main()
