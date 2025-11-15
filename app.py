from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import ClusterRequest, ClusterResponse
from preprocess import clean_batch
from clustering import cluster_texts

app = FastAPI(title='SmartCity NLP Service', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
def health():
    return {'ok': True}


@app.post('/cluster', response_model=ClusterResponse)
def cluster(req: ClusterRequest):
    texts = clean_batch(req.data)
    result = cluster_texts(texts, req.k)
    return result