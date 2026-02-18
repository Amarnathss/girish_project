import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export async function checkFeasibility(payload) {
  const response = await axios.post(`${API_BASE}/api/plan/feasibility`, payload);
  return response.data;
}
