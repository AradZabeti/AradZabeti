"""Security regression tests for the optional cPanel diagnostics bridge.

These tests invoke the actual PHP endpoint with synthetic request metadata.
They do not connect to a live cPanel server or require a real API key.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
ENDPOINT = ROOT / "cpanel" / "terminal.php"
TEST_KEY = "test-only-0123456789abcdef0123456789abcdef"
ALLOWED_ORIGIN = "https://aradzabeti.github.io"


class TerminalSecurityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not shutil.which("php"):
            raise unittest.SkipTest("PHP CLI unavailable; CI requires php -v and php -l")

    def invoke(self, *, configured=True, supplied=True, key=None,
               method="POST", https=True, origin=ALLOWED_ORIGIN,
               content_type="application/json", content_length="0"):
        server = {
            "REQUEST_METHOD": method,
            "HTTPS": "on" if https else "off",
            "SERVER_PORT": "443" if https else "80",
            "CONTENT_TYPE": content_type,
            "CONTENT_LENGTH": content_length,
            "HTTP_ORIGIN": origin,
        }
        if supplied:
            server["HTTP_X_ARAD_TERMINAL_KEY"] = TEST_KEY if key is None else key
        assignments = "\n".join(
            f"$_SERVER[{json.dumps(name)}] = {json.dumps(value)};"
            for name, value in server.items()
        )
        php_script = (
            "$_SERVER = [];\n"
            + assignments
            + "\nregister_shutdown_function(static function(): void {"
              " echo PHP_EOL . '__HTTP_STATUS__=' . http_response_code();"
              " });\n"
            + "require " + json.dumps(str(ENDPOINT)) + ";"
        )
        env = os.environ.copy()
        env.pop("ARAD_TERMINAL_KEY", None)
        if configured:
            env["ARAD_TERMINAL_KEY"] = TEST_KEY
        completed = subprocess.run(
            ["php", "-d", "display_errors=1", "-r", php_script],
            cwd=ROOT, env=env, text=True, capture_output=True, timeout=15,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertNotIn("Fatal error", completed.stdout + completed.stderr)
        match = re.search(r"__HTTP_STATUS__=(\d+)", completed.stdout)
        self.assertIsNotNone(match, completed.stdout + completed.stderr)
        body = completed.stdout[:match.start()].strip()
        return int(match.group(1)), json.loads(body) if body else None

    def test_unconfigured_endpoint_fails_closed(self):
        status, body = self.invoke(configured=False)
        self.assertEqual(status, 503)
        self.assertEqual(body["error"], "service_unavailable")

    def test_missing_key_is_unauthorized(self):
        status, body = self.invoke(supplied=False)
        self.assertEqual(status, 401)
        self.assertEqual(body["error"], "unauthorized")

    def test_wrong_key_is_unauthorized(self):
        status, body = self.invoke(key="bad-key")
        self.assertEqual(status, 401)
        self.assertEqual(body["error"], "unauthorized")

    def test_correct_key_allows_diagnostics(self):
        status, body = self.invoke()
        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        self.assertEqual(body["command"], "server")

    def test_plain_http_is_forbidden(self):
        status, body = self.invoke(https=False)
        self.assertEqual(status, 403)
        self.assertEqual(body["error"], "https_required")

    def test_untrusted_browser_origin_is_forbidden(self):
        status, body = self.invoke(origin="https://attacker.invalid")
        self.assertEqual(status, 403)
        self.assertEqual(body["error"], "origin_not_allowed")

    def test_get_is_not_allowed(self):
        status, body = self.invoke(method="GET")
        self.assertEqual(status, 405)
        self.assertEqual(body["error"], "method_not_allowed")

    def test_json_content_type_required(self):
        status, body = self.invoke(content_type="text/plain")
        self.assertEqual(status, 415)
        self.assertEqual(body["error"], "json_required")

    def test_oversize_body_rejected_before_read(self):
        status, body = self.invoke(content_length="4096")
        self.assertEqual(status, 413)
        self.assertEqual(body["error"], "request_too_large")

    def test_trusted_cors_preflight(self):
        status, body = self.invoke(method="OPTIONS", supplied=False, configured=False)
        self.assertEqual(status, 204)
        self.assertIsNone(body)

    def test_web_client_does_not_persist_key_in_local_storage(self):
        terminal = (ROOT / "terminal.html").read_text(encoding="utf-8")
        os_page = (ROOT / "os.html").read_text(encoding="utf-8")
        self.assertNotIn("localStorage.setItem('arad_terminal_key'", terminal)
        self.assertIn("sessionStorage.setItem('arad_terminal_key'", terminal)
        self.assertIn("sessionStorage.removeItem('arad_terminal_key'", terminal)
        self.assertIn("'X-ARAD-TERMINAL-KEY':key", os_page)


if __name__ == "__main__":
    unittest.main()
