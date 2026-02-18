from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import FeasibilityRequest, FeasibilityResponse
from services.power_budget import total_loss_db, rx_power_dbm
from services.osnr import osnr_margin_db
from services.path_utils import build_per_span_report, get_total_amp_gain

app = FastAPI(title="DWDM Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/plan/feasibility", response_model=FeasibilityResponse)
def check_feasibility(req: FeasibilityRequest):
    assumptions = req.assumptions
    service = req.service

    total_loss = total_loss_db(
        spans=req.spans,
        atten_db_per_km=assumptions.atten_db_per_km,
        conn_loss_db=assumptions.conn_loss_db,
        splice_loss_db=assumptions.splice_loss_db,
    )

    rx_power = rx_power_dbm(service.tx_power_dbm, total_loss)

    amp_total_gain = get_total_amp_gain(req.spans)

    osnr_margin = osnr_margin_db(
        tx_power_dbm=service.tx_power_dbm,
        total_loss_db=total_loss,
        amp_total_gain_db=amp_total_gain,
        noise_penalty_db=service.noise_penalty_db,
        osnr_threshold_db=service.osnr_threshold_db,
    )

    feasible = (rx_power >= service.receiver_sensitivity_dbm) and (osnr_margin >= 0)

    per_span = build_per_span_report(
        spans=req.spans,
        atten_db_per_km=assumptions.atten_db_per_km,
        conn_loss_db=assumptions.conn_loss_db,
        splice_loss_db=assumptions.splice_loss_db,
    )

    return FeasibilityResponse(
        total_loss_db=total_loss,
        rx_power_dbm=rx_power,
        osnr_margin_db=osnr_margin,
        feasible=feasible,
        per_span=per_span,
        assumptions_used={
            "atten_db_per_km": assumptions.atten_db_per_km,
            "conn_loss_db": assumptions.conn_loss_db,
            "splice_loss_db": assumptions.splice_loss_db,
        },
    )
