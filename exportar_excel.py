import json
import pandas as pd

def exportar_json_a_excel():
    with open('static/clientes.json', 'r', encoding='utf-8') as f:
        datos = json.load(f)
    df = pd.DataFrame(datos)
    df.to_excel('clientes.xlsx', index=False)
