# print('whatup')
import sys
originalText = sys.argv[1]

from bs4 import BeautifulSoup
# import contractions <- fix this!!
import pandas as pd
import nltk
import re
import string
nltk.download('stopwords')
nltk.download('wordnet')

from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.stem.porter import PorterStemmer

lemmatizer = WordNetLemmatizer()
cachedStopWords = stopwords.words('english')
tokenizer = RegexpTokenizer(r'\w+')

def remove_html(text):
    return re.sub(r'http\S+', '', text)

def filter_word(word):
    word = re.sub(r'[-–—]', " ", word)
    return re.sub(r'[^a-zA-Z\s]+', "", word)

def filter_words(text):
    return ' '.join([filter_word(w) for w in text.split()])

def remove_contractions(text): # contractions has trouble with large data sets
    return ' '.join([contractions.fix(word) for word in text.split()])

# improved parsing time!! went from 13s per 100rows to <1s
def rmStopAndLemmatize(arr):
    return ' '.join([lemmatizer.lemmatize(w) for w in arr if w not in cachedStopWords])

text = originalText.replace('.', ' ')
text = remove_html(text)
text = filter_words(text)
text = tokenizer.tokenize(text.lower())
text = rmStopAndLemmatize(text)
# print('original > ', originalText)
# print('preprocess > ', text)

print(text)
