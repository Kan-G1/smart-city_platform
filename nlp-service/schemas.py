from typing import List, Optional
from pydantic import BaseModel, Field


class ClusterRequest(BaseModel):
    data: List[str] = Field(default_factory=list, description='Requirement texts')
    k: Optional[int] = Field(default=None, description='Optional fixed k')


class ClusterResponse(BaseModel):
    clusters: List[int]
    k: int
    cluster_labels: List[str]
    cluster_keywords: List[List[str]]
    cluster_polarity: List[float]
    conflicts: List[dict]