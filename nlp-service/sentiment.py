from typing import List
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')

_sia = SentimentIntensityAnalyzer()


def polarity_scores(texts: List[str]) -> List[float]:
    """Return compound sentiment score in [-1, 1] for each text."""
    scores: List[float] = []
    for text in texts:
        try:
            result = _sia.polarity_scores(text or '')
            scores.append(float(result['compound']))
        except Exception:
            scores.append(0.0)
    return scores