import psycopg2
from pyparsing import Or

psg_host = "localhost"
psg_dbname = "bot"
psg_user = "postgres"
psg_password = "park22"


def get_conexao_bd():
    conexao =  psycopg2.connect(
        host=psg_host, user = psg_user, password = psg_password, database = psg_dbname
    )
    return conexao

def cadastrar_perguntas(perguntas, resposta):
    verificador="ok"
    conexao= get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(f"select id from resposta where resposta ='{resposta}'")
        resultado = cursor.fetchone()

        if resultado[0]:
            cursor.execute(f"INSERT INTO perguntas(pergunta, id_resposta) values ('{perguntas}', '{resultado[0]}')" )
            conexao.commit()
        else:
            resultado="Não foi possível inserir"
    
      
    except Exception as e:
        conexao.rollback()
        verificador="erro", e

    return verificador

def cadastrar_resposta(resposta):
    resultado="ok"
    conexao= get_conexao_bd()
    cursor = conexao.cursor()
    try:
        if resposta != "":
            cursor.execute(f"INSERT INTO resposta(resposta) values ('{resposta}')")
            conexao.commit()

    except Exception as e:
        conexao.rollback()
        resultado="erro", e

    return resultado


if __name__ == "__main__":
    pergunta="como se chama?"
    resposta=""

    res = cadastrar_resposta(resposta)
    per = cadastrar_perguntas(pergunta, "robô") 
