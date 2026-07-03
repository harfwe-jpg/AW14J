"""
Backend API para Sistema de Cámara de Multas Viales
Servidor Flask para gestión de infracciones de tránsito

Instalación:
    pip install flask flask-cors python-dotenv

Uso:
    python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Archivo para almacenar datos
DATOS_FILE = 'multas_database.json'

def cargar_datos():
    """Carga los datos de multas del archivo JSON"""
    if os.path.exists(DATOS_FILE):
        with open(DATOS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'infracciones': [], 'estadisticas': {}}

def guardar_datos(datos):
    """Guarda los datos de multas en el archivo JSON"""
    with open(DATOS_FILE, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

def calcular_multa(tipo_infraccion, velocidad_medida=None, limite_velocidad=None):
    """Calcula el monto de la multa según el tipo de infracción"""
    tarifas_base = {
        'exceso-velocidad': 500,
        'estacionamiento': 1500,
        'semaforo': 3000,
        'uso-celular': 2000,
        'sin-cinturon': 1000
    }

    monto = tarifas_base.get(tipo_infraccion, 500)

    # Incremento por exceso de velocidad
    if tipo_infraccion == 'exceso-velocidad' and velocidad_medida and limite_velocidad:
        exceso = int(velocidad_medida) - int(limite_velocidad)
        if exceso <= 10:
            monto = 500
        elif exceso <= 20:
            monto = 1000
        elif exceso <= 30:
            monto = 2500
        else:
            monto = 5000

    return monto

# ==================== RUTAS API ====================

@app.route('/api/infracciones', methods=['GET'])
def obtener_infracciones():
    """Obtiene todas las infracciones registradas"""
    datos = cargar_datos()
    return jsonify({
        'success': True,
        'infracciones': datos['infracciones'],
        'total': len(datos['infracciones'])
    })

@app.route('/api/infracciones', methods=['POST'])
def crear_infraccion():
    """Crea una nueva infracción"""
    try:
        datos_json = request.get_json()

        # Validación
        if not datos_json.get('placa'):
            return jsonify({'success': False, 'error': 'Placa requerida'}), 400

        if not datos_json.get('tipo'):
            return jsonify({'success': False, 'error': 'Tipo de infracción requerido'}), 400

        # Calcular multa
        monto = calcular_multa(
            datos_json['tipo'],
            datos_json.get('velocidad'),
            datos_json.get('limite_velocidad')
        )

        # Crear registro
        infraccion = {
            'id': int(datetime.now().timestamp() * 1000),
            'fecha': datetime.now().isoformat(),
            'placa': datos_json['placa'].upper(),
            'tipo': datos_json['tipo'],
            'velocidad': datos_json.get('velocidad'),
            'limite_velocidad': datos_json.get('limite_velocidad'),
            'monto': monto,
            'estado': 'pendiente',
            'observaciones': datos_json.get('observaciones', '')
        }

        # Guardar en BD
        datos = cargar_datos()
        datos['infracciones'].insert(0, infraccion)

        # Actualizar estadísticas
        datos['estadisticas'] = {
            'total_infracciones': len(datos['infracciones']),
            'total_recaudado': sum(i['monto'] for i in datos['infracciones']),
            'ultima_actualizacion': datetime.now().isoformat()
        }

        guardar_datos(datos)

        return jsonify({
            'success': True,
            'message': 'Infracción registrada correctamente',
            'infraccion': infraccion
        }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/infracciones/<int:infraccion_id>', methods=['GET'])
def obtener_infraccion(infraccion_id):
    """Obtiene una infracción específica"""
    datos = cargar_datos()
    for infraccion in datos['infracciones']:
        if infraccion['id'] == infraccion_id:
            return jsonify({'success': True, 'infraccion': infraccion})

    return jsonify({'success': False, 'error': 'Infracción no encontrada'}), 404

@app.route('/api/infracciones/<int:infraccion_id>', methods=['PUT'])
def actualizar_infraccion(infraccion_id):
    """Actualiza una infracción (estado, observaciones, etc.)"""
    try:
        datos_json = request.get_json()
        datos = cargar_datos()

        for infraccion in datos['infracciones']:
            if infraccion['id'] == infraccion_id:
                # Actualizar campos permitidos
                if 'estado' in datos_json:
                    infraccion['estado'] = datos_json['estado']
                if 'observaciones' in datos_json:
                    infraccion['observaciones'] = datos_json['observaciones']

                guardar_datos(datos)
                return jsonify({'success': True, 'infraccion': infraccion})

        return jsonify({'success': False, 'error': 'Infracción no encontrada'}), 404

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/infracciones/<int:infraccion_id>', methods=['DELETE'])
def eliminar_infraccion(infraccion_id):
    """Elimina una infracción"""
    try:
        datos = cargar_datos()

        for i, infraccion in enumerate(datos['infracciones']):
            if infraccion['id'] == infraccion_id:
                datos['infracciones'].pop(i)
                guardar_datos(datos)
                return jsonify({'success': True, 'message': 'Infracción eliminada'})

        return jsonify({'success': False, 'error': 'Infracción no encontrada'}), 404

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/estadisticas', methods=['GET'])
def obtener_estadisticas():
    """Obtiene estadísticas generales"""
    datos = cargar_datos()
    infracciones = datos['infracciones']

    # Contar por tipo
    tipos = {}
    total_recaudado = 0

    for infraccion in infracciones:
        tipos[infraccion['tipo']] = tipos.get(infraccion['tipo'], 0) + 1
        total_recaudado += infraccion['monto']

    estadisticas = {
        'total_infracciones': len(infracciones),
        'total_recaudado': total_recaudado,
        'por_tipo': tipos,
        'multa_promedio': round(total_recaudado / len(infracciones), 2) if infracciones else 0
    }

    return jsonify({'success': True, 'estadisticas': estadisticas})

@app.route('/api/infracciones/filtrar', methods=['POST'])
def filtrar_infracciones():
    """Filtra infracciones por placa, tipo, fecha, etc."""
    try:
        filtros = request.get_json()
        datos = cargar_datos()
        resultado = datos['infracciones']

        # Filtrar por placa
        if filtros.get('placa'):
            resultado = [i for i in resultado if filtros['placa'].upper() in i['placa']]

        # Filtrar por tipo
        if filtros.get('tipo'):
            resultado = [i for i in resultado if i['tipo'] == filtros['tipo']]

        # Filtrar por estado
        if filtros.get('estado'):
            resultado = [i for i in resultado if i['estado'] == filtros['estado']]

        # Filtrar por rango de multa
        if filtros.get('monto_min'):
            resultado = [i for i in resultado if i['monto'] >= filtros['monto_min']]

        if filtros.get('monto_max'):
            resultado = [i for i in resultado if i['monto'] <= filtros['monto_max']]

        return jsonify({
            'success': True,
            'total': len(resultado),
            'infracciones': resultado
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reporte/pdf', methods=['GET'])
def generar_reporte_pdf():
    """Ruta para generar reporte PDF (require librería reportlab)"""
    # Esta es una ruta placeholder
    # Para implementar: pip install reportlab
    return jsonify({
        'success': False,
        'message': 'Instale reportlab para generar PDFs: pip install reportlab'
    })

@app.route('/api/exportar/json', methods=['GET'])
def exportar_json():
    """Exporta todas las infracciones en formato JSON"""
    datos = cargar_datos()
    return jsonify({
        'success': True,
        'exportar_fecha': datetime.now().isoformat(),
        'infracciones': datos['infracciones'],
        'estadisticas': datos['estadisticas']
    })

@app.route('/api/salud', methods=['GET'])
def salud():
    """Verifica si el servidor está en línea"""
    return jsonify({
        'status': 'online',
        'mensaje': 'Sistema de Cámara de Multas Viales',
        'timestamp': datetime.now().isoformat()
    })

# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def no_encontrado(e):
    return jsonify({'success': False, 'error': 'Ruta no encontrada'}), 404

@app.errorhandler(500)
def error_servidor(e):
    return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500

# ==================== INICIAR SERVIDOR ====================

if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════╗
    ║  CÁMARA VIAL - Sistema de Multas             ║
    ║  Servidor Backend - Python Flask             ║
    ╚══════════════════════════════════════════════╝

    📡 Servidor iniciado en: http://localhost:5000

    Rutas disponibles:
    - GET  /api/infracciones          → Obtener todas
    - POST /api/infracciones          → Crear nueva
    - GET  /api/infracciones/<id>     → Obtener por ID
    - PUT  /api/infracciones/<id>     → Actualizar
    - DELETE /api/infracciones/<id>   → Eliminar
    - GET  /api/estadisticas          → Ver estadísticas
    - POST /api/infracciones/filtrar  → Filtrar
    - GET  /api/exportar/json         → Exportar JSON
    - GET  /api/salud                 → Verificar estado
    """)

    app.run(debug=True, host='0.0.0.0', port=5000)
