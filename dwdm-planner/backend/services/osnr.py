def osnr_margin_db(tx_power_dbm, total_loss_db, amp_total_gain_db, noise_penalty_db, osnr_threshold_db):
    est_osnr = tx_power_dbm - total_loss_db + amp_total_gain_db - noise_penalty_db
    return round(est_osnr - osnr_threshold_db, 2)
