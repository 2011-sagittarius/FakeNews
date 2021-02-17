import sys
url = sys.argv[1]

# from goose3 import Goose
# from requests import get
# response = get(url)

# extractor = Goose()
# article = extractor.extract(raw_html=response.content)

# import json
# export = {
#   "title": article.title,
#   "text": article.cleaned_text
# }

# app_json = json.dumps(export)
# print(app_json)


from newspaper import Article

# download and parse article
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
