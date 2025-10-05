const BASE_URL = 'http://192.168.68.101:5000'; // tu IP local

export async function getAgaveMap(year, month = 4) {
  try {
    const response = await fetch(`${BASE_URL}/getAgaveMap?year=${year}&month=${month}`);
    const data = await response.json();
    if (data.status === 'success') {
      return data.urls; // ndvi_vigor y ndre_salud
    } else {
      throw new Error(data.message || 'Error en la respuesta del servidor');
    }
  } catch (error) {
    console.error('Error en la API:', error);
    throw error;
  }
}
