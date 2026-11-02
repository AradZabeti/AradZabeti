"""Check the static output's files and anchor targets before publication."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import sys

root = Path(__file__).resolve().parent.parent / "out"
prefix = sys.argv[1] if len(sys.argv) > 1 else "/AradZabeti"
errors = []
references = 0

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.tabs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if values.get("role") == "tab":
            self.tabs.append(values.get("aria-controls"))
        for attribute in ("src", "href"):
            if values.get(attribute):
                self.links.append(values[attribute])

documents = {}
for file in root.rglob("*.html"):
    document = Document()
    document.feed(file.read_text())
    documents[file] = document

def verify(file, url):
    global references
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc:
        return
    references += 1
    address = unquote(parsed.path)
    if not address:
        target = file
    elif address.startswith(prefix + "/"):
        target = root / address[len(prefix) + 1:]
    elif address.startswith("/"):
        errors.append(f"Unprefixed asset: {file.relative_to(root)} → {url}")
        return
    else:
        target = (file.parent / address).resolve()
    if target.is_dir():
        target = target / "index.html"
    if not target.exists():
        errors.append(f"Missing file: {file.relative_to(root)} → {url}")
    elif parsed.fragment and target in documents and unquote(parsed.fragment) not in documents[target].ids:
        errors.append(f"Missing anchor: {file.relative_to(root)} → {url}")

for file, document in documents.items():
    for panel in document.tabs:
        if not panel or panel not in document.ids:
            errors.append(f"Missing tab panel: {file.relative_to(root)} → {panel}")
    for url in document.links:
        verify(file, url)
for file in root.rglob("*.css"):
    for url in re.findall(r"url\(['\"]?([^)'\"]+)", file.read_text()):
        verify(file, url)

print(json.dumps({"html_pages": len(documents), "references_checked": references, "errors": errors}, indent=2))
sys.exit(bool(errors))
