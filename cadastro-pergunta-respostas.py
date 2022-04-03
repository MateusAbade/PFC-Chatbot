import psycopg2
import pymongo

# psg_host = "localhost"
# psg_dbname = "bot"
# psg_user = "postgres"
# psg_password = "park22"


# def get_conexao_bd():
#     conexao =  psycopg2.connect(
#         host=psg_host, user = psg_user, password = psg_password, database = psg_dbname
#     )
#     return conexao

# def cadastrar_informacoes(perguntas, respostas):
#     resultado="ok"
#     conexao= get_conexao_bd()
#     cursor = conexao.cursor()
#     try:
#       cursor.execute(f"INSERT INTO perguntas_respostas(perguntas, respostas) values ('{perguntas}', '{respostas}')"

#       )
#       conexao.commit()
#     except Exception as e:
#         conexao.rollback()
#         resultado="erro", e

#     return resultado


# if __name__ == "__main__":
#    res = cadastrar_informacoes("Qual seu nome?", "Robô")
#    print(res)

conexao = pymongo.MongoClient("mongodb://localhost:27017")
banco = conexao.bot
colecao = banco.perguntas_respostas
dados = { "pergunta": "qual seu nome?", "resposta": "ifba" }
registro = colecao.insert_one(dados)