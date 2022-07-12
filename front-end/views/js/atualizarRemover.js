
function editarInformacao(id_pergunta, id_resposta, pergunta, resposta) {
	let form = document.createElement('form')
	form.action = "editar-informacao"
	form.method = "post"

	let div1 = document.createElement('div')
	div1.className = "row mb-3";

	let div2 = document.createElement('div')
	div2.className = "col-sm-5";

	let div3 = document.createElement('div')
	div3.className = "col-sm-7";

	let inputPergunta = document.createElement('input')
	inputPergunta.type = "text"
	inputPergunta.name = "pergunta"
	inputPergunta.className = "form-control"
	inputPergunta.value = pergunta

	let inputResposta = document.createElement('input')
	inputResposta.type = "text"
	inputResposta.name = "resposta"
	inputResposta.className = "form-control"
	inputResposta.value = resposta

	let inputIdPergunta = document.createElement('input')
	inputIdPergunta.type = "hidden"
	inputIdPergunta.name = "id_pergunta"
	inputIdPergunta.value = id_pergunta

	let inputIdResposta = document.createElement('input')
	inputIdResposta.type = "hidden"
	inputIdResposta.name = "id_resposta"
	inputIdResposta.value = id_resposta

	let button = document.createElement('button')
	button.type = "submit"
	button.className = "btn btn-primary"
	button.innerHTML = "Atualizar"


	form.appendChild(div1)
	div1.appendChild(div2)
	div1.appendChild(div3)
	div2.appendChild(inputPergunta)
	div3.appendChild(inputResposta)
	div2.appendChild(inputIdPergunta)
	div3.appendChild(inputIdResposta)
	form.appendChild(button)

	let infoResposta = document.getElementById("resposta_" + id_resposta)

	infoResposta.innerHTML = "";

	infoResposta.insertBefore(form, infoResposta[0])

}
function deletarInformacao(id) {
	location.href = '/excluir-conversas/' + id;
}
