import re
from typing import List

_punct_re = re.compile(r"[^a-zA-Z0-9\s]")


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = _punct_re.sub(" ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def clean_batch(texts: List[str]) -> List[str]:
    return [clean_text(t) for t in texts]