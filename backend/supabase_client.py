import os
import json
from supabase import create_client
from google import genai
import numpy as np
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import SupabaseVectorStore
from langchain.schema import Document

load_dotenv()

class SupabaseManager:
    def __init__(self):
        # Cargo variables de entorno
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")

        # Verifico que estén todas
        if not (self.supabase_url and self.supabase_key and self.google_api_key):
            raise ValueError("Faltan variables de entorno")

        # Inicializo el cliente de Supabase
        self.supabase = create_client(self.supabase_url, self.supabase_key)

        # Configuro embeddings con Gemini
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=self.google_api_key
        )

        # Configuro el text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )

    def generate_embedding(self, text):
        # Genera embeddings usando Gemini
        try:
            return self.embeddings.embed_query(text)
        except Exception as e:
            print("Error generando embedding:", e)
            return []

    def create_product_document(self, product):
        # Armo el contenido del documento
        product_text = (
            "Producto: " + product["nombre"] + "\n"
            "Descripción: " + product["descripcion"] + "\n"
            "Categoría: " + product["categoria"] + "\n"
            "Precio: $" + str(product["precio"]) + "\n"
            "Stock: " + str(product["stock"]) + " unidades\n"
            "Popularidad: " + str(product["popularidad"]) + "\n"
            "Características: " + product.get("caracteristicas", "No especificadas")
        )

        # Metadatos del documento
        metadata = {
            "producto_id": product["id"],
            "nombre": product["nombre"],
            "categoria": product["categoria"],
            "precio": product["precio"],
            "stock": product["stock"],
            "popularidad": product["popularidad"],
            "tipo": "producto"
        }

        return Document(page_content=product_text, metadata=metadata)

    def search_similar_products(self, query, limit=5):
        # Busca productos similares
        try:
            vectorstore = SupabaseVectorStore(
                client=self.supabase,
                embedding=self.embeddings,
                table_name="producto_embeddings",
                query_name="match_productos"
            )
            docs = vectorstore.similarity_search(query, k=limit, filter={"tipo": "producto"})
            products = []
            for d in docs:
                prod = {
                    "id": d.metadata.get("producto_id"),
                    "nombre": d.metadata.get("nombre"),
                    "descripcion": d.page_content,
                    "categoria": d.metadata.get("categoria"),
                    "precio": d.metadata.get("precio"),
                    "stock": d.metadata.get("stock"),
                    "popularidad": d.metadata.get("popularidad"),
                    "similarity": 0.85  # Placeholder
                }
                products.append(prod)
            return products
        except Exception as e:
            print("Error buscando productos:", e)
            return []

    def get_product_suggestions(self, current_product, user_query):
        # Sugiere productos basados en uno actual y la consulta
        try:
            context = (
                "Usuario ve: " + current_product["nombre"] +
                " ($" + str(current_product["precio"]) + ")\n"
                "Categoría: " + current_product["categoria"] + "\n"
                "Consulta: " + user_query
            )
            sims = self.search_similar_products(context, limit=3)
            # Quito el producto actual
            sugerencias = [p for p in sims if p["id"] != current_product["id"]]
            return sugerencias[:2]
        except Exception as e:
            print("Error obteniendo sugerencias:", e)
            return []

    def get_product_by_id(self, product_id):
        # Trae un producto por su ID
        try:
            resp = self.supabase.table('productos').select('*').eq('id', product_id).execute()
            if resp.data:
                return resp.data[0]
            return None
        except Exception as e:
            print("Error obteniendo producto:", e)
            return None

    def get_all_products(self):
        # Trae todos los productos activos
        try:
            resp = self.supabase.table('productos').select('*').eq('activo', True).execute()
            return resp.data or []
        except Exception as e:
            print("Error obteniendo productos:", e)
            return []

    def create_product_embeddings_table(self):
        # Crea la tabla de embeddings si no existe
        try:
            self.supabase.rpc('create_product_embeddings_table').execute()
            print("Tabla de embeddings creada o ya existía")
        except Exception as e:
            print("Error creando tabla de embeddings:", e)

    def populate_embeddings(self):
        # Llena la tabla de embeddings para todos los productos
        try:
            products = self.get_all_products()
            print("Generando embeddings para", len(products), "productos...")
            docs = []
            for p in products:
                docs.append(self.create_product_document(p))
            split_docs = self.text_splitter.split_documents(docs)
            SupabaseVectorStore.from_documents(
                documents=split_docs,
                embedding=self.embeddings,
                client=self.supabase,
                table_name="producto_embeddings"
            )
            print("Embeddings generados!")
        except Exception as e:
            print("Error poblando embeddings:", e)


# Instancia global
supabase_manager = SupabaseManager()
