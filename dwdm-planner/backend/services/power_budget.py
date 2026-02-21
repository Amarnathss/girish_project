def span_loss_db(length_km, fiber_atten_db_per_km, connectors, conn_loss_db, splices, splice_loss_db, amplifier_gain_db, amp_penalty_db):
    fiber_loss = length_km * fiber_atten_db_per_km
    connector_loss = connectors * conn_loss_db
    splice_loss = splices * splice_loss_db
    amp_effective_gain = max(0.0, amplifier_gain_db - amp_penalty_db)
    loss = fiber_loss + connector_loss + splice_loss - amp_effective_gain
    return round(loss, 2)


def total_loss_db(spans, fiber_atten_db_per_km, conn_loss_db, splice_loss_db, amp_penalty_db):
    total = 0.0
    for span in spans:
        loss = span_loss_db(
            length_km=span["length_km"],
            fiber_atten_db_per_km=fiber_atten_db_per_km,
            connectors=span["connectors"],
            conn_loss_db=conn_loss_db,
            splices=span["splices"],
            splice_loss_db=splice_loss_db,
            amplifier_gain_db=span.get("amplifier_gain_db", 0.0),
            amp_penalty_db=amp_penalty_db,
        )
        total += loss
    return round(total, 2)


def rx_power_dbm(tx_power_dbm, total_loss):
    return round(tx_power_dbm - total_loss, 2)
