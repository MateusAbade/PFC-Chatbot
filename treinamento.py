from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
import psycopg2
import psycopg2.extras

psg_host = "localhost"
psg_dbname = "bot"
psg_user = "postgres"
psg_password = "park22"


def get_conexao_bd():
    conexao =  psycopg2.connect(
        host=psg_host, user = psg_user, password = psg_password, database = psg_dbname
    )
    return conexao


def iniciar():
    global robo
    global treinador

    robo = ChatBot("Robô", storage_adapter='chatterbot.storage.SQLStorageAdapter',
    database_uri='postgres://postgres:park22@localhost/bot')
    treinador = ListTrainer(robo)

def carregar_conversas(registro):
    conversas = {
        "perguntas": [registro["perguntas"]],
        "respostas": registro["respostas"]
    }
    

    return conversas

def buscar_converas():
    conversas = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute("select perguntas, respostas from perguntas_respostas")
    resultado = cursor.fetchall()
    for registro in resultado:
        conversas.append(carregar_conversas(registro))
    return conversas

def treinar_robo(conversas):
    global treinador
    for conversa in conversas:
        perguntas =conversa["perguntas"]
        resposta =  conversa["respostas"]
        print("treinando o robô a responder a: ", perguntas, "com a resposta: ", resposta)
        for pergunta in perguntas:
            treinador.train([pergunta, resposta])

if __name__ == "__main__":
    iniciar()

    conversas = buscar_converas()
    print(conversas)
    if conversas:
        treinar_robo(conversas)
