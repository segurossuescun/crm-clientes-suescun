from flask import Flask, request, jsonify, send_from_directory
import json
from exportar_excel import exportar_json_a_excel

app = Flask(__name__)

RUTA_JSON = 'static/clientes.json'

@app.route('/guardar', methods=['POST'])
def guardar_json():
    datos = request.get_json()
    with open(RUTA_JSON, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=4)
    return jsonify({"mensaje": "Archivo guardado con éxito"})

@app.route('/clientes.json', methods=['GET'])
def obtener_clientes():
    with open(RUTA_JSON, 'r', encoding='utf-8') as f:
        datos = json.load(f)
    return jsonify(datos)

@app.route("/exportar_excel", methods=["GET"])
def exportar_excel():
    exportar_json_a_excel()
    return send_from_directory(directory=".", path="clientes.xlsx", as_attachment=True)

@app.route('/buscar_clientes')
def buscar_clientes():
    return send_from_directory('static', 'buscar_clientes.html')

# ✅ Ruta principal para mostrar index.html desde /static
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
