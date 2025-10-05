from flask import Flask, request, jsonify
import ee

# --- CONFIGURACIÓN INICIAL ---
app = Flask(__name__)

PROJECT_ID = 'ee-antartida-hackathon'
MUNICIPIOS_ASSET_PATH = 'projects/ee-antartida-hackathon/assets/jalisco_municipios'
USV_ASSET_PATH = 'projects/ee-antartida-hackathon/assets/vegetacion' 
AGRICULTURE_PROPERTY_NAME = 'Clasif2014' 
AGRICULTURE_PROPERTY_VALUE = 'Agrícola' 

try:
    # Usaremos la autenticación personal para máxima simplicidad y sin costos
    ee.Initialize(project=PROJECT_ID)
    print("Servidor de Backend: Conexión con GEE (Autenticación Personal) exitosa.")
    # Cargamos los assets una sola vez al iniciar
    usv_fc = ee.FeatureCollection(USV_ASSET_PATH)
    agriculture_polygons = usv_fc.filter(ee.Filter.eq(AGRICULTURE_PROPERTY_NAME, AGRICULTURE_PROPERTY_VALUE))
    agriculture_mask = ee.Image(0).paint(agriculture_polygons, 1)
except Exception as e:
    print(f"Error crítico al iniciar: {e}")

# --- FUNCIONES DE GEE ---
def add_indices(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
    ndre = image.normalizedDifference(['B8', 'B5']).rename('NDRE')
    return image.addBands([ndvi, ndre])

def harmonize_landsat8(image):
    return image.select(['SR_B5', 'SR_B4', 'SR_B3'], ['B8', 'B4', 'B5'])

# --- API ENDPOINT PRINCIPAL ---
@app.route('/getAgaveMap', methods=['GET'])
def get_agave_map():
    """
    Genera y devuelve las URLs de los mapas NDVI y NDRE, enmascarados solo
    para zonas agrícolas, para un año y mes específicos.
    Uso: /getAgaveMap?year=2024&month=4
    """
    try:
        year = request.args.get('year', default=2024, type=int)
        month = request.args.get('month', default=4, type=int)
        
        print(f"Recibida petición para el mapa de: {month}/{year}")

        start_date = ee.Date.fromYMD(year, month, 1)
        end_date = start_date.advance(1, 'month')

        s2_collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterDate(start_date, end_date).select(['B8', 'B4', 'B5'])
        l8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2').filterDate(start_date, end_date).map(harmonize_landsat8)
        full_collection = ee.ImageCollection(s2_collection.merge(l8_collection))
        
        composite = full_collection.map(add_indices).median()
        composite_masked = composite.updateMask(agriculture_mask)
        
        # Paletas de colores para la visualización
        ndvi_viz = {'min': 0.2, 'max': 0.8, 'palette': ['#CE7E45', '#DF923D', '#F1B555', '#FCD163', '#99B718', '#74A901', '#66A000', '#529400', '#3E8601', '#207401', '#056201', '#004C00', '#023B01', '#012E01', '#011D01', '#011301']}
        ndre_viz = {'min': 0.1, 'max': 0.5, 'palette': ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#008000']} # Rojo (estrés) a Verde (salud)

        ndvi_map = composite_masked.select('NDVI').getMapId(ndvi_viz)
        ndre_map = composite_masked.select('NDRE').getMapId(ndre_viz)

        response_data = {
            'status': 'success',
            'urls': {
                'ndvi_vigor': ndvi_map['tile_fetcher'].url_format,
                'ndre_salud': ndre_map['tile_fetcher'].url_format
            }
        }
        return jsonify(response_data)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# --- CÓDIGO PARA EJECUTAR EL SERVIDOR DE PRUEBA ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
