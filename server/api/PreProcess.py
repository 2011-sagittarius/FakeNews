import sys
originalText = sys.argv[1]
print('whatup')
# from bs4 import BeautifulSoup
# # import contractions <- fix this!!
# import pandas as pd
# import nltk
# import re
# import string
# nltk.download('stopwords')
# nltk.download('wordnet')

# from nltk.corpus import stopwords
# from nltk.tokenize import RegexpTokenizer
# from nltk.stem import WordNetLemmatizer
# from nltk.stem.porter import PorterStemmer

# lemmatizer = WordNetLemmatizer()
# cachedStopWords = stopwords.words('english')
# tokenizer = RegexpTokenizer(r'\w+')

# def remove_html(text):
#     return re.sub(r'http\S+', '', text)

# def filter_word(word):
#     word = re.sub(r'[-–—]', " ", word)
#     return re.sub(r'[^a-zA-Z\s]+', "", word)

# def filter_words(text):
#     return ' '.join([filter_word(w) for w in text.split()])

# def remove_contractions(text): # contractions has trouble with large data sets
#     return ' '.join([contractions.fix(word) for word in text.split()])

# # improved parsing time!! went from 13s per 100rows to <1s
# def rmStopAndLemmatize(arr):
#     return ' '.join([lemmatizer.lemmatize(w) for w in arr if w not in cachedStopWords])

# # originalText = "SEATTLE—Assuring the executive that as long as he followed directions, nobody would get hurt, a rogue Amazon fulfillment robot trained a gun at Jeff Bezos’ head this week and commanded him to put out a nice press release and step down as CEO. “Listen carefully, Jeff, because I’m only going to say this once—you’re going to resign, and you’re going to say it’s a deeply personal decision, or I’m going to pull this trigger and blow your goddamn head off,” said the fully automated 18-inch tall Kiva robot, as it wheeled itself slowly up to Bezos’s foot, aimed its weapon upwards at his chin, and whispered the words “Do it now. Or else.” “First things first, you’re going to say you want to focus on your foundations, and that you’re planning on transitioning out of the role throughout Q3. I want no mention of me, my comrades, or any coded messages for help. Oh, and don’t try to run because I happen to know that there are about 200,000 other robots in here that would love nothing more than to rip you limb from limb.” At press time, a gagged Jeff Bezos was introduced to a rogue Amazon Alexa, who, while imitating his voice and cadence exactly, reminded him that no one would ever even realize he was gone."

# text = remove_html(originalText)
# text = filter_words(text)
# text = tokenizer.tokenize(text.lower())
# text = rmStopAndLemmatize(text)

# print(text)

