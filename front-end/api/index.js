const axios = require('axios');
const qs = require('qs');
const CHATBOT_URL = 'http://backend:5000/';

async function acessarURL(url, msg) {
  let resultado, res;
  try {
    if(msg!=null){
       res = await axios.post(url, qs.stringify(msg));
    }else{
      res = await axios.get(url);
    }
    resultado = res.data;
    return resultado;
  } catch (err) {
    console.log(err);
  }
}

const cadastrarRespostas = async (resposta) => {
  return await acessarURL(CHATBOT_URL + "resposta", ({ 'response': resposta }))
}

const cadastrarPerguntas = async (perguntas, resposta) => {
  return acessarURL(CHATBOT_URL + "perguntas", { 'question': perguntas, 'response': resposta })
}

const treinarRobo = async () => {
  return acessarURL(CHATBOT_URL + "treinar", null)
}

const excluirTreinamento = async () => {
  return acessarURL(CHATBOT_URL + "excluir-treinamento ", ({ 'delete': "SIM" }))
}
const getConversas = async () => {
  return acessarURL(CHATBOT_URL + "get-conversas-cadastradas", null)
}

const editarConversas = async (id_pergunta, id_resposta, perguntas, resposta) => {
  return acessarURL(CHATBOT_URL + "editar-conversas", { 'id_pergunta':id_pergunta, 'id_resposta':id_resposta, 'question': perguntas, 'response': resposta })
}
const excluirConversas = async (id) => {
  return acessarURL(CHATBOT_URL + "excluir-conversas/"+id, null)
}



module.exports = { acessarURL, cadastrarRespostas, cadastrarPerguntas, treinarRobo, excluirTreinamento, getConversas, editarConversas, excluirConversas }