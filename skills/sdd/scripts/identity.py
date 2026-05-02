#!/usr/bin/env python3
"""Resolve user identity (email) for SDD ownership.

Priority:
    1. `claude auth status --json` -> email when loggedIn=true
    2. `git config user.email`
    3. exit != 0 with instruction to login

Usage:
    identity.py            # prints email to stdout
    identity.py --source   # prints "<email>\\t<source>" where source is claude|git
"""
import json
import shutil
import subprocess
import sys


def from_claude() -> str | None:
    if shutil.which("claude") is None:
        return None
    try:
        result = subprocess.run(
            ["claude", "auth", "status", "--json"],
            capture_output=True,
            text=True,
            timeout=5,
        )
    except (subprocess.TimeoutExpired, OSError):
        return None
    if result.returncode != 0:
        return None
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return None
    if not data.get("loggedIn"):
        return None
    email = data.get("email")
    return email if isinstance(email, str) and email else None


def from_git() -> str | None:
    if shutil.which("git") is None:
        return None
    try:
        result = subprocess.run(
            ["git", "config", "user.email"],
            capture_output=True,
            text=True,
            timeout=5,
        )
    except (subprocess.TimeoutExpired, OSError):
        return None
    if result.returncode != 0:
        return None
    email = result.stdout.strip()
    return email or None


def resolve() -> tuple[str | None, str | None]:
    email = from_claude()
    if email:
        return email, "claude"
    email = from_git()
    if email:
        return email, "git"
    return None, None


def main() -> int:
    show_source = "--source" in sys.argv[1:]
    email, source = resolve()
    if not email:
        print(
            "ERROR: identity not resolvable. Run `claude auth login` "
            "or `git config --global user.email <email>`",
            file=sys.stderr,
        )
        return 2
    if show_source:
        print(f"{email}\t{source}")
    else:
        print(email)
    return 0


if __name__ == "__main__":
    sys.exit(main())
