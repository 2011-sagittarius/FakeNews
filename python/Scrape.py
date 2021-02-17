import sys
url = sys.argv[1]

# from goose3 import Goose
from requests import get
response = get(url)

# extractor = Goose()
# article = extractor.extract(raw_html=response.content)

from newspaper import Article
# url = 'https://local.theonion.com/something-about-the-way-society-was-exposed-as-complete-1846251067'
article = Article(url)
article.download()
article.parse()

import json
export = {
  "title": article.title,
  "text": article.text
}

app_json = json.dumps(export)
print(app_json)