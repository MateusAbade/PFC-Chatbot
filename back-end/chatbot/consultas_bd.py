from conexao import get_conexao_bd
from flask import request, jsonify
import psycopg2.extras


def cadastrar_perguntas():
    perguntas = request.values.get('question')
    resposta = request.values.get('response')
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    cursor.execute(f"select id from resposta where resposta ='{resposta}'")
    res = cursor.fetchone()
    try:

        if (res != None) and (perguntas):
            cursor.execute(
                f"INSERT INTO perguntas(pergunta, id_resposta) values ('{perguntas}', '{res[0]}')")
            conexao.commit()
        else:
            resultado = "Não foi possível inserir a pergunta"

    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado

def cadastrar_resposta():
    resposta = request.values.get("response")
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    cursor.execute(
        f"select resposta from resposta where resposta ='{resposta}'")
    res = cursor.fetchone()
    try:
        if (resposta) and (res != resposta if res == None else res[0] != resposta):
            cursor.execute(
                f"INSERT INTO resposta(resposta) values ('{resposta}')")
            conexao.commit()
        else:
            resultado = "Não foi possível inserir a resposta"

    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado


def cadastrar_medias():
    media = request.values.get('media')
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(
            f"INSERT INTO medias (media) values ('{media}')")
        conexao.commit()

    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado

def get_conversas():
    conversas = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(
        "select p.id as id_pergunta, r.id as id_resposta,  pergunta, resposta from perguntas p join resposta r on p.id_resposta=r.id limit 10")
    resultado = cursor.fetchall()

    print(resultado)
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

def get_medias():
    medias = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(
        "select id, media from medias")
    resultado = cursor.fetchall()
    for registro in resultado:
        medias.append(carregar_medias(registro))
    return jsonify(medias)

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
def excluir_medias(id):
    resultado = "ok"
    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(f"delete from medias where id={id}")
        conexao.commit()
    except Exception as e:
        conexao.rollback()
        resultado = "erro", e

    return resultado

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
        
def carregar_conversas(registro):
    conversas = {
        "id_pergunta": registro["id_pergunta"],
        "pergunta": [registro["pergunta"]],
        "id_resposta": registro["id_resposta"],
        "resposta": registro["resposta"]
    }

    return conversas

def carregar_medias(registro):
    medias = {
        "id": registro["id"],
        "media": registro["media"]
    }

    return medias

