#!/usr/bin/env python3
"""Check observatory website links and strip out the ones that are dead.

Usage:
    python3 scripts/check_links.py            # check + report only
    python3 scripts/check_links.py --fix       # check and remove broken links from data/observatories.json
"""
import json
import subprocess
import sys
import time
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "observatories.json"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

# Status codes that mean "the site is reachable and serving content", even if
# it doesn't like bots (401/403/406/429 are common anti-bot responses from
# real, working sites). We keep those links.
OK_CODES = set(range(200, 400)) | {401, 403, 406, 429}

RETRIES = 3
TIMEOUT = 20


def curl_check(url: str) -> tuple[str, str]:
    """Return (status_code_str, effective_url) for a single curl attempt."""
    result = subprocess.run(
        [
            "curl", "-sL", "-o", "/dev/null",
            "-w", "%{http_code} %{url_effective}",
            "--max-time", str(TIMEOUT),
            "-A", UA,
            "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "-H", "Accept-Language: en-US,en;q=0.9",
            url,
        ],
        capture_output=True, text=True,
    )
    out = result.stdout.strip()
    if " " in out:
        code, effective = out.split(" ", 1)
    else:
        code, effective = out or "000", url
    return code, effective


def check_url(url: str) -> tuple[bool, str]:
    """Try a URL up to RETRIES times. Return (is_ok, last_code)."""
    last_code = "000"
    for attempt in range(RETRIES):
        code, _ = curl_check(url)
        last_code = code
        if code.isdigit() and int(code) in OK_CODES:
            return True, code
        if attempt < RETRIES - 1:
            time.sleep(2)
    return False, last_code


def main():
    fix = "--fix" in sys.argv

    data = json.loads(DATA_PATH.read_text())
    obs_list = data["observatories"]

    broken = []
    ok_count = 0
    empty_count = 0

    for obs in obs_list:
        url = (obs.get("website") or "").strip()
        if not url:
            empty_count += 1
            continue
        is_ok, code = check_url(url)
        if is_ok:
            ok_count += 1
            print(f"OK    [{code}] {obs['id']}: {url}")
        else:
            broken.append((obs, url, code))
            print(f"BROKEN[{code}] {obs['id']}: {url}")

    print()
    print(f"Total: {len(obs_list)}  OK: {ok_count}  Empty: {empty_count}  Broken: {len(broken)}")

    if broken:
        print("\nBroken links:")
        for obs, url, code in broken:
            print(f"  - {obs['id']} [{code}]: {url}")

    if fix and broken:
        for obs, url, code in broken:
            obs["website"] = ""
        DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
        print(f"\nRemoved {len(broken)} broken website links from {DATA_PATH}")
    elif broken:
        print("\nRun with --fix to remove these broken links from the data file.")


if __name__ == "__main__":
    main()
