#!/usr/bin/env python3
"""Health check for the deployed web app.

Hits every page and every /api route, reports HTTP status + latency + obvious
errors. Pure stdlib so it runs anywhere with Python. No LLM, no network calls
beyond the target host. Saves a JSON report the improver agent consumes.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

DEFAULT_BASE = "https://infinite-gundawar-webapp.vercel.app"

# Pages to check (path -> optional POST body for api routes is in apis)
PAGES = [
    "/", "/about", "/services", "/portfolio", "/testimonials", "/contact",
    "/finance", "/ayurveda", "/happiness", "/ai-tools", "/career",
    "/property-finder", "/data-scraper", "/phone-scraper", "/email-sender",
]

# API routes — POST endpoints get a tiny safe payload
API_POST = {
    "/api/ayurveda-doctors": {"country": "India", "city": "Pune", "maxResults": 3},
    "/api/lead-generator":   {"country": "India", "city": "Pune", "maxResults": 3},
    "/api/marketplace-scrape":{"tab": "property", "country": "India", "city": "Pune", "maxResults": 3},
    "/api/phone-scraper":     {"country": "India", "city": "Pune", "maxResults": 3},
    "/api/email-sender":      {"to": "test@example.com", "subject": "ping", "body": "ping"},
}
API_GET = ["/api/scrape?q=property+pune&limit=1"]


def hit(url: str, method: str = "GET", body: dict | None = None, timeout: int = 25) -> dict[str, Any]:
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Content-Type": "application/json"} if body is not None else {}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = resp.status
            raw = resp.read(2048)  # cap payload
            snippet = raw[:400].decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        status = e.code
        try:
            snippet = e.read(400).decode("utf-8", "replace")
        except Exception:
            snippet = str(e)
    except urllib.error.URLError as e:
        return {"url": url, "method": method, "status": 0, "latency_ms": int((time.time() - t0) * 1000),
                "ok": False, "error": f"URLError: {e.reason}"}
    except Exception as e:
        return {"url": url, "method": method, "status": 0, "latency_ms": int((time.time() - t0) * 1000),
                "ok": False, "error": f"{type(e).__name__}: {e}"}
    latency = int((time.time() - t0) * 1000)
    # crude error sniff — JSON APIs often embed {"error": "..."} in 200s too
    err_marker = ""
    low = snippet.lower()
    if "unauthorized" in low or "api key" in low or "invalid api" in low or "quota" in low:
        err_marker = "AUTH/QUOTA"
    elif status >= 500:
        err_marker = "SERVER-ERROR"
    elif status >= 400:
        err_marker = "CLIENT-ERROR"
    return {"url": url, "method": method, "status": status, "latency_ms": latency,
            "ok": 200 <= status < 400 and not err_marker, "marker": err_marker, "snippet": snippet}


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--base", default=DEFAULT_BASE)
    p.add_argument("--out", default=str(Path(__file__).parent / "last-report.json"))
    p.add_argument("--timeout", type=int, default=25)
    args = p.parse_args()

    base = args.base.rstrip("/")
    checks: list[dict[str, Any]] = []
    print(f"[healthcheck] base={base}", flush=True)

    for path in PAGES:
        checks.append(hit(f"{base}{path}", "GET", timeout=args.timeout))

    for path, body in API_POST.items():
        checks.append(hit(f"{base}{path}", "POST", body=body, timeout=args.timeout))

    for path in API_GET:
        checks.append(hit(f"{base}{path}", "GET", timeout=args.timeout))

    bad = [c for c in checks if not c["ok"]]
    slow = sorted([c for c in checks if c.get("latency_ms", 0) > 5000], key=lambda x: -x["latency_ms"])[:5]

    report = {
        "base": base,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "total": len(checks),
        "ok_count": len(checks) - len(bad),
        "bad_count": len(bad),
        "slow": slow,
        "bad": bad,
        "all": checks,
    }
    Path(args.out).write_text(json.dumps(report, indent=2))
    print(f"[healthcheck] ok={report['ok_count']}/{report['total']} bad={report['bad_count']} -> {args.out}", flush=True)
    return 0 if not bad else 1


if __name__ == "__main__":
    sys.exit(main())
