import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.osnr import osnr_margin_db


def test_osnr_margin_positive():
    result = osnr_margin_db(
        tx_power_dbm=0.0,
        total_loss_db=10.0,
        amp_total_gain_db=20.0,
        noise_penalty_db=2.0,
        osnr_threshold_db=5.0,
    )
    # est_osnr = 0 - 10 + 20 - 2 = 8
    # margin = 8 - 5 = 3.0
    assert result == 3.0


def test_osnr_margin_negative():
    result = osnr_margin_db(
        tx_power_dbm=0.0,
        total_loss_db=25.0,
        amp_total_gain_db=10.0,
        noise_penalty_db=3.0,
        osnr_threshold_db=5.0,
    )
    # est_osnr = 0 - 25 + 10 - 3 = -18
    # margin = -18 - 5 = -23.0
    assert result == -23.0


def test_osnr_margin_zero():
    result = osnr_margin_db(
        tx_power_dbm=5.0,
        total_loss_db=10.0,
        amp_total_gain_db=10.0,
        noise_penalty_db=0.0,
        osnr_threshold_db=5.0,
    )
    # est_osnr = 5 - 10 + 10 - 0 = 5
    # margin = 5 - 5 = 0.0
    assert result == 0.0


def test_osnr_margin_with_high_gain():
    result = osnr_margin_db(
        tx_power_dbm=2.0,
        total_loss_db=15.0,
        amp_total_gain_db=30.0,
        noise_penalty_db=1.0,
        osnr_threshold_db=12.0,
    )
    # est_osnr = 2 - 15 + 30 - 1 = 16
    # margin = 16 - 12 = 4.0
    assert result == 4.0
