const API_KEY = 'ak-d9ddc4d6258acfae3fe78035643131e65229408c';
const API_BASE = 'https://json.astrologyapi.com/v1';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { endpoint, data } = JSON.parse(event.body);
    const allowed = [
      'birth_details','astro_details','planets',
      'major_vdasha','current_vdasha_all','current_vdasha','current_vdasha_date','sub_vdasha','sub_vdasha/:md',
      'sub_sub_vdasha/:md/:ad','sub_sub_sub_vdasha/:md/:ad/:pd','sub_sub_sub_sub_vdasha/:md/:ad/:pd/:sd',
      'major_yogini_dasha','current_yogini_dasha','sub_yogini_dasha','sub_yogini_dasha/:dashaCycle/:dashaName',
      'manglik','sadhesati_current_status','basic_panchang','kalsarpa_details',
      'yoga_details','ascendant_report','planet_report/moon','planet_report/sun',
      'sun_sign_prediction/daily/:zodiacName',
      'horo_chart_image/D1','horo_chart_image/D9','horo_chart_image/chalit'
    ];
    if (!allowed.includes(endpoint)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid endpoint' }) };
    }
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'x-astrologyapi-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: result.message || result.error || `API Error ${response.status}` }), headers: { 'Content-Type': 'application/json' } };
    }
    return { statusCode: 200, body: JSON.stringify(result), headers: { 'Content-Type': 'application/json' } };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
