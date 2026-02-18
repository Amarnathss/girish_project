# Seminar Slides Outline - DWDM Link Feasibility Planner

## Slide 1: Title
- DWDM Link Feasibility Planner
- Automated Optical Network Planning Tool

## Slide 2: Problem Statement
- Manual DWDM link planning is error-prone and time-consuming
- Engineers need quick feasibility checks before detailed design
- Power budget and OSNR calculations must be validated early

## Slide 3: Solution Overview
- Web-based planning tool with React frontend and FastAPI backend
- Real-time feasibility assessment for DWDM optical links
- Visual network topology with pass/fail indicators

## Slide 4: System Architecture
- Frontend: React + Vite + react-flow-renderer
- Backend: Python FastAPI with calculation services
- REST API communication via axios

## Slide 5: Key Calculations
- Span Loss: fiber_loss + connector_loss + splice_loss - amp_effective_gain
- Total Loss: sum of all span losses
- Rx Power: tx_power_dbm - total_loss
- OSNR Margin: estimated OSNR - threshold

## Slide 6: Feasibility Criteria
- Rx Power >= Receiver Sensitivity
- OSNR Margin >= 0 dB
- Both conditions must be met for PASS

## Slide 7: Demo - PASS Scenario
- 3-node topology with adequate amplification
- Green edges indicating feasible link
- Metrics panel showing positive margins

## Slide 8: Demo - FAIL Scenario
- 3-node topology with excessive loss
- Red edges indicating infeasible link
- Metrics panel showing negative margins

## Slide 9: Technical Details
- Power budget service handles per-span and total calculations
- OSNR service evaluates signal quality margin
- Path utilities build per-span reports

## Slide 10: Future Work
- Wavelength assignment optimization
- Multi-path routing analysis
- Integration with real network inventory systems
- Support for ROADM and mesh topologies
