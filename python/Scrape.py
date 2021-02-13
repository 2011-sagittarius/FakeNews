import sys
url = sys.argv[1]

from goose3 import Goose
from requests import get
response = get(url)

extractor = Goose()
article = extractor.extract(raw_html=response.content)

import json
export = {
  "title": article.title,
  "text": article.cleaned_text
}

app_json = json.dumps(export)
print(app_json)
