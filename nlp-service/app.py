import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import ClusterRequest, ClusterResponse
from clustering import cluster_texts_full

app = FastAPI(title='SmartCity NLP Service', version='0.2.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get('/health')
def health():
    return {'ok': True, 'model': os.getenv('MODEL_NAME', 'default')}


@app.post('/cluster', response_model=ClusterResponse)
def cluster(req: ClusterRequest):
    return cluster_texts_full(req.data, req.k)