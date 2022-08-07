from flask import Flask
from flask_socketio import SocketIO, emit
from chatterbot import ChatBot
from chatterbot.response_selection import get_first_response
from chatterbot.trainers import ListTrainer
import consultas_bd


servico = Flask(__name__)
io = SocketIO(servico, cors_allowed_origins="*")


# Rota de teste
@servico.route('/')
def p_controle():
    return "v1"

# Funções de gerenciamento das informações armazenadas no banco
@servico.route("/perguntas", methods=['POST'])
def cadastrar_perguntas():
   return consultas_bd.cadastrar_perguntas()

@servico.route("/resposta", methods=['POST'])
def cadastrar_resposta():
    return consultas_bd.cadastrar_resposta()
    
@servico.route("/medias", methods=['POST'])
def cadastrar_medias():
    return consultas_bd.cadastrar_medias()

@servico.route("/editar-conversas", methods=['POST'])
def editar_conversas():
    return consultas_bd.editar_conversas()

@servico.route("/get-conversas-cadastradas", methods=['GET'])
def get_conversas():
    return consultas_bd.get_conversas()

@servico.route("/get-medias-cadastradas", methods=['GET'])
def get_medias():
    return consultas_bd.get_medias()

@servico.route("/excluir-conversas/<int:id>")
def excluir_converas(id):
    return consultas_bd.excluir_converas(id)

@servico.route("/excluir-medias/<int:id>")
def excluir_medias(id):
    return consultas_bd.excluir_medias(id)


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
    conversas = consultas_bd.buscar_conversas()
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
    return consultas_bd.excluir_treinamento()

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
