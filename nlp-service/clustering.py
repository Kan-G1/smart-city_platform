import os
from typing import Any, Dict, List, Optional

import numpy as np
from numpy.linalg import norm
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import silhouette_score

from sentiment import polarity_scores

DEFAULT_MODEL = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
MODEL_NAME = os.getenv('MODEL_NAME', DEFAULT_MODEL)

_model: Optional[SentenceTransformer] = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def embed(texts: List[str]) -> np.ndarray:
    model = get_model()
    X = np.asarray(model.encode(texts, show_progress_bar=False))
    norms = norm(X, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return X / norms


def best_k_by_silhouette(X: np.ndarray, k_hint: Optional[int], n: int) -> int:
    if k_hint and 2 <= k_hint <= min(12, n):
        return k_hint
    k_min, k_max = 2, max(2, min(12, n))
    if k_max == 2:
        return 2
    best_k, best_score = 2, -1.0
    for k in range(k_min, k_max + 1):
        try:
            km = KMeans(n_clusters=k, n_init='auto', random_state=42)
            labels = km.fit_predict(X)
            if len(set(labels)) == 1:
                continue
            score = silhouette_score(X, labels, metric='cosine')
            if score > best_score:
                best_k, best_score = k, score
        except Exception:
            continue
    return best_k


def tfidf_keywords_per_cluster(texts: List[str], labels: List[int], top_n: int = 5) -> List[List[str]]:
    if not texts:
        return []
    vect = TfidfVectorizer(max_features=2000, ngram_range=(1, 2), min_df=1)
    X = vect.fit_transform(texts)
    vocab = np.array(vect.get_feature_names_out())
    k = max(labels) + 1 if labels else 0
    out: List[List[str]] = [[] for _ in range(k)]
    label_arr = np.array(labels)
    for cid in range(k):
        idxs = np.where(label_arr == cid)[0]
        if len(idxs) == 0:
            continue
        sub = X[idxs]
        scores = np.asarray(sub.mean(axis=0)).ravel()
        top_idx = scores.argsort()[-top_n:][::-1]
        out[cid] = vocab[top_idx].tolist()
    return out


def readable_labels(texts: List[str], X: np.ndarray, labels: List[int], centroids: np.ndarray) -> List[str]:
    k = centroids.shape[0]
    label_arr = np.array(labels)
    out: List[str] = []
    for cid in range(k):
        idxs = np.where(label_arr == cid)[0]
        if len(idxs) == 0:
            out.append(f'Cluster {cid}')
            continue
        sub = X[idxs]
        sims = sub @ centroids[cid]
        closest = idxs[int(np.argmax(sims))]
        snippet = (texts[closest] or '')[:40].replace('"', "'")
        out.append(f'Cluster {cid}: "{snippet}"')
    return out


def detect_conflicts(
    centroids: np.ndarray,
    cluster_polarity: List[float],
    sim_threshold: float = 0.55,
    polarity_gap: float = 0.35
) -> List[Dict[str, float]]:
    conflicts: List[Dict[str, float]] = []
    k = len(cluster_polarity)
    if k < 2:
        return conflicts
    for a in range(k):
        for b in range(a + 1, k):
            sim = float(centroids[a] @ centroids[b])
            pol_a, pol_b = float(cluster_polarity[a]), float(cluster_polarity[b])
            if sim >= sim_threshold and (pol_a * pol_b) < 0 and abs(pol_a - pol_b) >= polarity_gap:
                conflicts.append({
                    'a': a,
                    'b': b,
                    'similarity': round(sim, 3),
                    'polarity_a': round(pol_a, 3),
                    'polarity_b': round(pol_b, 3)
                })
    return conflicts


def cluster_texts_full(raw_texts: List[str], k_hint: Optional[int] = None) -> Dict[str, Any]:
    n = len(raw_texts)
    if n == 0:
        return {
            'clusters': [],
            'k': 0,
            'cluster_labels': [],
            'cluster_keywords': [],
            'cluster_polarity': [],
            'conflicts': []
        }

    X = embed(raw_texts)
    k = best_k_by_silhouette(X, k_hint, n)

    km = KMeans(n_clusters=k, n_init='auto', random_state=42)
    labels = km.fit_predict(X)
    centroids = km.cluster_centers_

    label_arr = np.array(labels)

    item_polarity = polarity_scores(raw_texts)
    cluster_polarity: List[float] = []
    for cid in range(k):
        idxs = np.where(label_arr == cid)[0]
        if len(idxs) == 0:
            cluster_polarity.append(0.0)
        else:
            cluster_polarity.append(float(np.mean([item_polarity[i] for i in idxs])))

    cluster_keywords = tfidf_keywords_per_cluster(raw_texts, labels, top_n=5)
    cluster_labels = readable_labels(raw_texts, X, labels, centroids)
    conflicts = detect_conflicts(centroids, cluster_polarity)

    return {
        'clusters': labels.tolist(),
        'k': int(k),
        'cluster_labels': cluster_labels,
        'cluster_keywords': cluster_keywords,
        'cluster_polarity': [round(p, 3) for p in cluster_polarity],
        'conflicts': conflicts
    }