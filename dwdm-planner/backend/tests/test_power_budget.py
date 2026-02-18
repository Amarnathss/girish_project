import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.power_budget import span_loss_db, total_loss_db, rx_power_dbm


def test_span_loss_db_basic():
    result = span_loss_db(
        length_km=80,
        atten_db_per_km=0.25,
        connectors=4,
        conn_loss_db=0.5,
        splices=10,
        splice_loss_db=0.1,
        amp_gain_db=20.0,
        amp_penalty_db=1.0,
    )
    # fiber_loss = 80 * 0.25 = 20
    # connector_loss = 4 * 0.5 = 2
    # splice_loss = 10 * 0.1 = 1
    # amp_effective_gain = max(0, 20 - 1) = 19
    # loss = 20 + 2 + 1 - 19 = 4.0
    assert result == 4.0


def test_span_loss_db_no_amp():
    result = span_loss_db(
        length_km=50,
        atten_db_per_km=0.3,
        connectors=2,
        conn_loss_db=0.5,
        splices=5,
        splice_loss_db=0.1,
        amp_gain_db=0.0,
        amp_penalty_db=0.0,
    )
    # fiber_loss = 50 * 0.3 = 15
    # connector_loss = 2 * 0.5 = 1
    # splice_loss = 5 * 0.1 = 0.5
    # amp_effective_gain = 0
    # loss = 15 + 1 + 0.5 = 16.5
    assert result == 16.5


def test_total_loss_db():
    spans = [
        {"length_km": 80, "connectors": 4, "splices": 10, "amp_gain_db": 20.0, "amp_penalty_db": 1.0},
        {"length_km": 60, "connectors": 2, "splices": 8, "amp_gain_db": 15.0, "amp_penalty_db": 0.5},
    ]
    result = total_loss_db(spans, atten_db_per_km=0.25, conn_loss_db=0.5, splice_loss_db=0.1)
    # span1: 20 + 2 + 1 - 19 = 4.0
    # span2: 15 + 1 + 0.8 - 14.5 = 2.3
    # total = 6.3
    assert result == 6.3


def test_rx_power_dbm():
    result = rx_power_dbm(tx_power_dbm=0.0, total_loss=20.0)
    assert result == -20.0


def test_rx_power_dbm_positive_tx():
    result = rx_power_dbm(tx_power_dbm=3.0, total_loss=10.0)
    assert result == -7.0
