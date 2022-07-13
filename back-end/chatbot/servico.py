from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from chatterbot import ChatBot
from chatterbot.response_selection import get_first_response
import psycopg2.extras
import psycopg2
from chatterbot.trainers import ListTrainer


servico = Flask(__name__)
io = SocketIO(servico, cors_allowed_origins="*")

# Conexão com o banco
def get_conexao_bd():
    conexao = psycopg2.connect(
        host='bancodados', user='mateus', password='park22', database='chatbot')
    return conexao

# Rota de teste
@servico.route('/')
def p_controle():
    return "v1"

# Funções de gerenciamento das informações armazenadas no banco
@servico.route("/perguntas", methods=['POST'])
def cadastrar_perguntas():
    perguntas = request.values.get('question')
    resposta = request.values.get('response')
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    cursor.execute(f"select id from resposta where resposta ='{resposta}'")
    res = cursor.fetchone()
    try:

        if (res != None) and (perguntas != ""):
            cursor.execute(
                f"INSERT INTO perguntas(pergunta, id_resposta) values ('{perguntas}', '{res[0]}')")
            conexao.commit()
        else:
            resultado = "Não foi possível inserir a pergunta"

    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado


@servico.route("/resposta", methods=['POST'])
def cadastrar_resposta():
    resposta = request.values.get("response")
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    cursor.execute(
        f"select resposta from resposta where resposta ='{resposta}'")
    res = cursor.fetchone()
    try:
        if (resposta != "") and (res != resposta if res == None else res[0] != resposta):
            cursor.execute(
                f"INSERT INTO resposta(resposta) values ('{resposta}')")
            conexao.commit()
        else:
            resultado = "Não foi possível inserir a resposta"

    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado


@servico.route("/editar-conversas", methods=['POST'])
def editar_conversas():
    id_pergunta = request.values.get("id_pergunta")
    id_resposta = request.values.get("id_resposta")
    pergunta = request.values.get("question")
    resposta = request.values.get("response")
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        if (pergunta != "") or (resposta != ""):
            cursor.execute(
                f"UPDATE perguntas SET pergunta = '{pergunta}' WHERE id ='{id_pergunta}'")
            conexao.commit()
            cursor.execute(
                f"UPDATE resposta SET resposta = '{resposta}' WHERE id ='{id_resposta}'")
            conexao.commit()
        else:
            resultado = "Não foi possível atualizar as informações"

    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado

@servico.route("/get-conversas-cadastradas", methods=['GET'])
def get_conversas():
    conversas = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(
        "select p.id as id_pergunta, r.id as id_resposta,  pergunta, resposta from perguntas p join resposta r on p.id_resposta=r.id")
    resultado = cursor.fetchall()
    for registro in resultado:
        conversas.append(carregar_conversas(registro))
    return jsonify(conversas)


def buscar_conversas():
    conversas = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(
        "select p.id as id_pergunta, r.id as id_resposta, pergunta, resposta from perguntas p join resposta r on p.id_resposta=r.id")
    resultado = cursor.fetchall()
    for registro in resultado:
        conversas.append(carregar_conversas(registro))
    return conversas

def carregar_conversas(registro):
    conversas = {
        "id_pergunta": registro["id_pergunta"],
        "pergunta": [registro["pergunta"]],
        "id_resposta": registro["id_resposta"],
        "resposta": registro["resposta"]
    }

    return conversas

@servico.route("/excluir-conversas/<int:id>")
def excluir_converas(id):
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(f"delete from resposta where id={id}")
        conexao.commit()
    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado


# robô
robo = ChatBot("Robo",
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'statement_comparison_function': 'chatterbot.comparisons.levenshtein_distance ',
            'response_selection_method': get_first_response
        }
    ],
    database_uri='postgresql://mateus:park22@bancodados/chatbot'
    )

# treinamento do robô

def iniciar():
    global robo
    global treinador
    robo = ChatBot("Robo",
        storage_adapter='chatterbot.storage.SQLStorageAdapter',
        database_uri='postgresql://mateus:park22@bancodados/chatbot',
        )
    treinador = ListTrainer(robo)

@servico.route("/treinar")
def treinar_robo():
    iniciar()
    conversas = buscar_conversas()
    resultado = "ok"
    global treinador
    try:
        for conversa in conversas:
            perguntas = conversa["pergunta"]
            resposta = conversa["resposta"]
            print("treinando o robô a responder a: ",
                perguntas, "com a resposta: ", resposta)
            for pergunta in perguntas:
                treinador.train([pergunta, resposta])
    except Exception as e:
        resultado = "erro", e

    return resultado

@servico.route("/excluir-treinamento", methods=['POST'])
def excluir_treinamento():
    resposta = request.values.get("delete")
    if(resposta == "SIM"):
        resultado = "ok"
        conexao = get_conexao_bd()
        cursor = conexao.cursor()
        try:
            cursor.execute("DROP TABLE if exists tag cascade")
            cursor.execute("DROP TABLE if exists tag_association cascade")
            cursor.execute("DROP TABLE if exists statement cascade")
            conexao.commit()

        except Exception as e:
            conexao.rollback()
            resultado = "erro", e

        return resultado
# conversas do robô
@io.on('sendMessage')
def send_message(msg):
    resposta = robo.get_response(msg)
    print(resposta.text)
    print(resposta.confidence)

    mensagem = "Poxa! no momento ainda não sei como te responder,",
    "mas você pode fazer outra pergunta..."

    if(resposta.confidence > 0.5):
        mensagem = resposta.text

    emit('getMessage', mensagem)


if __name__ == "__main__":
    io.run(servico, debug=True, host='0.0.0.0')
