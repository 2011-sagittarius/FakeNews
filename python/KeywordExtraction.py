import pandas
# Libraries for text preprocessing
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import RegexpTokenizer
from nltk.stem.wordnet import WordNetLemmatizer

##Creating a list of stop words and adding custom stopwords
stop_words = set(stopwords.words("english"))
##Creating a list of custom stopwords
new_words = ["using", "show", "result", "large", "also", "iv", "one", "two", "new", "previously", "shown", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
stop_words = stop_words.union(new_words)
corpus = []

# TEST DATA
dataset = 'Trump lawyers blast impeachment trial as ‘political theater’.By ERIC TUCKER, LISA MASCARO, MARY CLARE JALONICK and JILL COLVINFebruary 8, 2021 GMT.WASHINGTON (AP) — Lawyers for Donald Trump on Monday blasted the impeachment case against him as an act of “political theater” as they accused House Democrats of exploiting the chaos and trauma of last month’s riot at the U.S. Capitol for their party’s gain.In a brief filed on the eve of the impeachment tria l, lawyers for the former president leveled a wide-ranging attack on the case, foreshadowing the claims they intend to present when arguments begin Tuesday on the same Senate floor that was invaded by rioters on Jan. 6.ADVERTISEMENT.They suggest that Trump was simply exercising his First Amendment rights when he disputed the election results and argue that he explicitly encouraged his supporters to have a peaceful protest and therefore cannot be responsible for the actions of the rioters. They say the Senate is not entitled to try Trump now that he has left office, an argument contested by even some conservative legal scholars, and they deny that the goal of the case is justice.“Instead, this was only ever a selfish attempt by Democratic leadership in the House to prey upon the feelings of horror and confusion that fell upon all Americans across the entire political spectrum upon seeing the destruction at the Capitol on Jan. 6 by a few hundred people,” the lawyers wrote in a brief obtained by The Associated Press.“Instead of acting to heal the nation, or at the very least focusing on prosecuting the lawbreakers who stormed the Capitol, the Speaker of the House and her allies have tried to callously harness the chaos of the moment for their own political gain,” they added.The trial will begin in earnest Tuesday with a debate and vote on whether it’s even constitutional to prosecute the former president, an argument that could resonate with Republicans keen on voting to acquit Trump without being seen as condoning his behavior.Your browser does not support the iframe HTML tag. Try viewing this in a modern browser like Chrome, Safari, Firefox or Internet Explorer 9 or later.Under a draft agreement between Senate Majority Leader Chuck Schumer and Senate Republican Leader Mitch McConnell, the proceedings will break Friday evening for the Jewish Sabbath at the request of Trump’s defense team and resume on Sunday. There will likely be no witnesses, and the former president has declined a request to testify.Trump’s second impeachment trial is opening with a sense of urgency — by Democrats who want to hold him accountable for the violent Capitol siege and Republicans who want it over as quickly as possible.ADVERTISEMENT.The proceedings are expected to diverge from the lengthy, complicated trial that resulted in Trump’s acquittal a year ago on charges that he privately pressured Ukraine to dig up dirt on a Democratic rival, Joe Biden, now the president. This time, Trump’s rally cry to “fight like hell” and the storming of the Capitol played out for the world to see. Trump very well could be acquitted again, and the trial could be over in half the time.Under the terms of the trial being negotiated, it would launch first with a debate over its constitutionality, a key argument of the former president’s defense. Sen. Rand Paul, R-Ky., forced a vote on the issue last month, and senators will again be confronted with a debate and vote.Opening arguments would begin Wednesday at noon, with up to 16 hours per side for presentations.Trump is the first president to be twice impeached, and the only one to face trial after leaving the White House. The Democratic-led House approved a sole charge, “incitement of insurrection,” acting swiftly one week after the riot, the most violent attack on Congress in more than 200 years. Five people died including a woman shot by police inside the building and a police officer who died of injuries the next day.More Stories:.So far, it appears there will be few witnesses called, as the prosecutors and defense attorneys speak directly to senators who have been sworn to deliver “impartial justice” as jurors. Most are also witnesses to the siege, having fled for safety that day as the rioters broke into the Capitol and temporarily halted the electoral count certifying Biden’s victory.Instead, House managers prosecuting the case are expected to rely on the trove of videos from the siege, along with Trump’s incendiary rhetoric refusing to concede the election, to make their case. His new defense team has said it plans to counter with its own cache of videos of Democratic politicians making fiery speeches.“We have the unusual circumstance where on the very first day of the trial, when those managers walk on the floor of the Senate, there will already be over 100 witnesses present,” said Rep. Adam Schiff, D-Calif., who led Trump’s first impeachment. “Whether you need additional witnesses will be a strategic call.”.Democrats argue it’s not only about winning conviction, but holding the former president accountable for his actions , even though he’s out of office. For Republicans, the trial will test their political loyalty to Trump and his enduring grip on the GOP.Initially repulsed by the graphic images of the siege, Republican senators including Senate Republican leader Mitch McConnell denounced the violence and pointed a finger of blame at Trump. But in recent weeks GOP senators have rallied around Trump arguing his comments do not make him responsible for the violence. They question the legitimacy of even conducting a trial of someone no longer in office.On Sunday, Republican Sen. Roger Wicker of Mississippi described Trump’s impeachment trial as a “meaningless messaging partisan exercise.” Paul called the proceedings a farce with “zero chance of conviction” and described Trump’s language and rally words as “figurative” speech.Senators were sworn in as jurors late last month, shortly after Biden was inaugurated, but the trial proceedings were delayed as Democrats focused on confirming the new president’s initial Cabinet picks and Republicans sought to put as much distance as possible from the bloody riot.At the time, Paul forced a vote to set aside the trial as unconstitutional because Trump is no longer in office, drawing 44 other Republicans to his argument.A prominent conservative lawyer, Charles Cooper, rejects that view, writing in a Wall Street Journal opinion piece Sunday that the Constitution permits the Senate to try an ex-official, a significant counterpoint to that of Republican senators who have looked toward acquittal by advancing constitutional claims.Republican Sen. Lindsey Graham of South Carolina, one of Trump’s ardent defenders, said he believes Trump’s actions were wrong and “he’s going to have a place in history for all of this,” but insisted it’s not the Senate’s job to judge.But 45 votes in favor of Paul’s measure suggested the near impossibility of reaching a conviction in a Senate where Democrats hold 50 seats but a two-thirds vote — or 67 senators — would be needed to convict Trump. Only five Republican senators joined with Democrats to reject Paul’s motion: Mitt Romney of Utah, Ben Sasse of Nebraska, Susan Collins of Maine, Lisa Murkowski of Alaska and Pat Toomey of Pennsylvania.___.Connect with the definitive source for global and local news.More from AP.'

## PREPROCESS DATA
text = re.sub('[^a-zA-Z]', ' ', dataset) #Remove punctuations
text = text.lower() #Convert to lowercase
text=re.sub("&lt;/?.*?&gt;"," &lt;&gt; ",text) #remove tags
text=re.sub("(\\d|\\W)+"," ",text) # remove special characters and digits
text = text.split() #Convert to list from string
ps=PorterStemmer() #Stemming
lem = WordNetLemmatizer() #Lemmatisation
text = [lem.lemmatize(word) for word in text if not word in stop_words]
text = " ".join(text)
corpus.append(text)
corpus.append('the') #countVectorizer needed an array so I append a dummy word

## TEXT VECTORIZER
from sklearn.feature_extraction.text import CountVectorizer
import re
cv=CountVectorizer(max_df=0.8,stop_words=stop_words, max_features=10000, ngram_range=(1,3))
X=cv.fit_transform(corpus)

## CONVERT TEXT TO INT MATRIX
from sklearn.feature_extraction.text import TfidfTransformer

tfidf_transformer=TfidfTransformer(smooth_idf=True,use_idf=True)
tfidf_transformer.fit(X)
# get feature names
feature_names=cv.get_feature_names()
# fetch document for which keywords needs to be extracted
doc=corpus[0]
#generate tf-idf for the given document
tf_idf_vector=tfidf_transformer.transform(cv.transform([doc]))

#Function for sorting tf_idf in descending order
from scipy.sparse import coo_matrix
def sort_coo(coo_matrix):
    tuples = zip(coo_matrix.col, coo_matrix.data)
    return sorted(tuples, key=lambda x: (x[1], x[0]), reverse=True)

def extract_topn_from_vector(feature_names, sorted_items, topn=10):
    """get the feature names and tf-idf score of top n items"""

    #use only topn items from vector
    sorted_items = sorted_items[:topn]

    score_vals = []
    feature_vals = []

    # word index and corresponding tf-idf score
    for idx, score in sorted_items:

        #keep track of feature name and its corresponding score
        score_vals.append(round(score, 3))
        feature_vals.append(feature_names[idx])

    #create a tuples of feature,score
    #results = zip(feature_vals,score_vals)
    results= {}
    for idx in range(len(feature_vals)):
        results[feature_vals[idx]]=score_vals[idx]

    return results
#sort the tf-idf vectors by descending order of scores
sorted_items=sort_coo(tf_idf_vector.tocoo())
#extract only the top n; n here is 10
keywords=extract_topn_from_vector(feature_names,sorted_items,20)

# now print the results
print("\nAbstract:")
print(doc)
print("\nKeywords:")
for k in keywords:
    print(k,keywords[k])
