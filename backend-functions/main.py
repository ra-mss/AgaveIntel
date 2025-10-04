from flask import Flask, request, jsonify
import ee

# --- CONFIGURACIÓN INICIAL ---
# Creamos la aplicación de Flask
app = Flask(__name__)

# Autenticación con Google Earth Engine (esto solo se hace una vez cuando arranca el servidor)
try:
    SERVICE_ACCOUNT_FILE = 'service-account.json'
    PROJECT_ID = 'ee-antartida-hackathon'
    
    credentials = ee.ServiceAccountCredentials(None, key_file=SERVICE_ACCOUNT_FILE)
    ee.Initialize(credentials=credentials, project=PROJECT_ID)
    print("Servidor de Backend: Conexión con GEE exitosa.")
except Exception as e:
    print(f"Error crítico al iniciar: No se pudo conectar a GEE. {e}")

# --- DEFINICIÓN DE NUESTRA API ---

# Este decorador le dice a Flask: "Cuando alguien visite la URL '/getMapUrl', ejecuta esta función"
@app.route('/getMapUrl', methods=['GET'])
def get_map_url():
    """
    Este endpoint genera y devuelve las URLs de los mapas NDVI y NDRE para un año y mes dados.
    Ejemplo de uso: /getMapUrl?year=2024&month=4
    """
    # 1. Obtener los parámetros de la URL (año y mes)
    year = request.args.get('year', default=2024, type=int)
    month = request.args.get('month', default=4, type=int)
    
    print(f"Recibida petición para el mapa de: {month}/{year}")

    # 2. Lógica de Google Earth Engine (adaptada de nuestro prototipo)
    try:
        start_date = ee.Date.fromYMD(year, month, 1)
        end_date = start_date.advance(1, 'month') # Un mes completo

        tequila_aoi = ee.Geometry.Polygon(
            [[[-103.9, 21.0], [-103.7, 21.0], [-103.7, 20.8], [-103.9, 20.8]]])

        def add_indices(image):
            ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
            ndre = image.normalizedDifference(['B8', 'B5']).rename('NDRE')
            return image.addBands([ndvi, ndre])

        collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
        filtered = collection.filterDate(start_date, end_date).filterBounds(tequila_aoi)
        composite = filtered.map(add_indices).median().clip(tequila_aoi)
        
        ndvi_viz = {'min': 0.2, 'max': 0.8, 'palette': ['brown', 'yellow', 'green']}
        ndre_viz = {'min': 0.1, 'max': 0.5, 'palette': ['red', 'yellow', 'darkgreen']}

        ndvi_map = composite.select('NDVI').getMapId(ndvi_viz)
        ndre_map = composite.select('NDRE').getMapId(ndre_viz)

        # 3. Preparar la respuesta en formato JSON
        response_data = {
            'status': 'success',
            'year': year,
            'month': month,
            'urls': {
                'ndvi': ndvi_map['tile_fetcher'].url_format,
                'ndre': ndre_map['tile_fetcher'].url_format
            }
        }
        # jsonify convierte nuestro diccionario de Python en un formato estándar para APIs
        return jsonify(response_data)

    except Exception as e:
        # Si algo falla, devolvemos un error claro
        return jsonify({'status': 'error', 'message': str(e)}), 500


# --- CÓDIGO PARA EJECUTAR EL SERVIDOR DE PRUEBA ---
if __name__ == '__main__':
    # Esto permite ejecutar el servidor directamente desde la terminal para pruebas
    # El host '0.0.0.0' lo hace accesible desde tu red local
    app.run(host='0.0.0.0', port=5000, debug=True)