def build_per_span_report(spans, atten_db_per_km, conn_loss_db, splice_loss_db):
    from services.power_budget import span_loss_db

    report = []
    for i, span in enumerate(spans):
        loss = span_loss_db(
            length_km=span["length_km"],
            atten_db_per_km=atten_db_per_km,
            connectors=span["connectors"],
            conn_loss_db=conn_loss_db,
            splices=span["splices"],
            splice_loss_db=splice_loss_db,
            amp_gain_db=span.get("amp_gain_db", 0.0),
            amp_penalty_db=span.get("amp_penalty_db", 0.0),
        )
        report.append({
            "span_index": i,
            "from": span.get("from", f"Node{i}"),
            "to": span.get("to", f"Node{i+1}"),
            "length_km": span["length_km"],
            "loss_db": loss,
        })
    return report


def get_total_amp_gain(spans):
    total = 0.0
    for span in spans:
        gain = span.get("amp_gain_db", 0.0)
        penalty = span.get("amp_penalty_db", 0.0)
        total += max(0.0, gain - penalty)
    return round(total, 2)
