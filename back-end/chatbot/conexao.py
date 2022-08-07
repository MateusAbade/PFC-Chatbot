import psycopg2

# Conexão com o banco
def get_conexao_bd():
    conexao = psycopg2.connect(
        host='bancodados', user='mateus', password='park22', database='chatbot')
    return conexao