from pydantic import BaseModel
from typing import List, Optional


class Span(BaseModel):
    length_km: float
    connectors: int
    splices: int
    amplifier_gain_db: Optional[float] = 0.0
    from_node: Optional[str] = ""
    to_node: Optional[str] = ""


class Node(BaseModel):
    id: str
    label: str


class Service(BaseModel):
    tx_power_dbm: float
    receiver_sensitivity_dbm: float
    osnr_threshold_db: float


class Assumptions(BaseModel):
    fiber_atten_db_per_km: float
    conn_loss_db: float
    splice_loss_db: float
    noise_penalty_db: float
    amp_penalty_db: float


class FeasibilityRequest(BaseModel):
    nodes: List[Node]
    spans: List[dict]
    service: Service
    assumptions: Assumptions


class SpanReport(BaseModel):
    span_index: int
    from_node: str
    to_node: str
    length_km: float
    loss_db: float


class FeasibilityResponse(BaseModel):
    total_loss_db: float
    rx_power_dbm: float
    osnr_margin_db: float
    feasible: bool
    per_span: List[dict]
    assumptions_used: dict
