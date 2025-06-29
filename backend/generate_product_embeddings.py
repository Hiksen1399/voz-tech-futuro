#!/usr/bin/env python3
"""
Script sencillo para generar productos de ejemplo con Gemini
y crear embeddings para RAG con Langchain
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from supabase_client import supabase_manager

load_dotenv()

def generate_realistic_products():
    # Configurar Gemini
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-exp")

    # Definición básica de productos
    base_products = [
        {"nombre": "iPhone 15 Pro", "categoria": "smartphones", "precio_base": 1299, "caracteristicas": ["Chip A17 Pro", "Cámara 48MP", "Titanio", "USB-C"]},
        {"nombre": "MacBook Pro M3", "categoria": "laptops", "precio_base": 1999, "caracteristicas": ["Chip M3", "Pantalla Liquid Retina", "Hasta 22h batería"]},
        {"nombre": "Samsung Galaxy Watch", "categoria": "wearables", "precio_base": 299, "caracteristicas": ["ECG", "Resistente al agua", "GPS"]},
        {"nombre": "Sony WH-1000XM5", "categoria": "audio", "precio_base": 399, "caracteristicas": ["Cancelación de ruido", "30h batería", "Bluetooth 5.2"]},
        {"nombre": "iPad Pro 12.9", "categoria": "tablets", "precio_base": 1099, "caracteristicas": ["Chip M2", "Liquid Retina", "Apple Pencil"]},
        {"nombre": "Tesla Model S", "categoria": "vehicles", "precio_base": 89990, "caracteristicas": ["Autopilot", "396 mi autonomía", "0-60 en 3.1s"]}
    ]

    generated = []

    for base in base_products:
        prompt = (
            f"Genera 3 variaciones realistas de {base['nombre']} "
            f"({base['categoria']}), precio base ${base['precio_base']}, "
            f"características: {', '.join(base['caracteristicas'])}. "
            "Responde en JSON válido con campos: nombre, descripcion, precio, stock, popularidad, caracteristicas."
        )

        try:
            resp = model.generate_content(prompt)
            text = resp.text.strip()

            # Limpiar posibles backticks de código
            if text.startswith("```"):
                text = text.strip("```").strip()
            variations = json.loads(text)
            generated.extend(variations)
            print(f"{len(variations)} variaciones generadas para {base['nombre']}")

        except Exception as e:
            print(f"Error generando variaciones para {base['nombre']}: {e}")
            # Fallback simple
            fallback = {
                "nombre": f"{base['nombre']} Variante",
                "descripcion": f"Variante básica de {base['nombre']}.",
                "precio": base["precio_base"] * 1.1,
                "stock": 20,
                "popularidad": 50,
                "caracteristicas": base["caracteristicas"]
            }
            generated.append(fallback)

    return generated

def insert_products_to_supabase(products):
    for p in products:
        try:
            data = {
                "nombre": p["nombre"],
                "descripcion": p["descripcion"],
                "precio": p["precio"],
                "categoria": p.get("categoria", "general"),
                "stock": p["stock"],
                "popularidad": p["popularidad"],
                "imagen_url": (
                    "https://images.unsplash.com/photo-"
                    f"{abs(hash(p['nombre'])) % 1_000_000_000}?w=400"
                )
            }
            supabase_manager.supabase.table("productos").insert(data).execute()
            print(f"Insertado: {p['nombre']}")
        except Exception as e:
            print(f"Error insertando {p['nombre']}: {e}")

def main():
    print("Generando productos de ejemplo...")
    products = generate_realistic_products()
    print(f"Total generados: {len(products)}")

    print("Insertando productos en Supabase...")
    insert_products_to_supabase(products)

    print("Generando embeddings con Langchain...")
    supabase_manager.populate_embeddings()

    print("Proceso finalizado")

if __name__ == "__main__":
    main()
