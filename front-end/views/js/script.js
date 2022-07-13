
function clique(url, tipo){
  var modal = document.getElementById('janelaModal');
  var btn = document.getElementById('btnFechar');
  var offcanvas = document.getElementById('offcanvasScrolling');
  var btnRobo = document.getElementById('btnRobo');

  if(tipo=='img')
      midia = document.getElementById('imgModal');
  else 
      midia = document.getElementById('videoModal');
  

  offcanvas.style.display="none";
  btnRobo.style.display="none";
  modal.style.display="block";
  midia.src=url;
  btn.onclick=function(){
    modal.style.display="none"; 
    offcanvas.style.display="flex";
    btnRobo.style.display="block";
  }

}
function ocultarBtnChat(){
  var chat = document.getElementById('chat');
  var btnFechar = document.getElementById('chatClose');
  chat.style.display="none";

  btnFechar.onclick=function(){
    chat.style.display="flex";
  }
}

function arquivoUrl(valor){
  if(valor == 'true'){
    document.getElementById('arquivoLocal').style.display="none";
    document.getElementById('arquivoUrl').style.display="block";
    document.getElementById('voltar').style.display="block";
    document.getElementById('url').style.display="none";
  }else{
    document.getElementById('arquivoLocal').style.display="block";
    document.getElementById('arquivoUrl').style.display="none";
    document.getElementById('voltar').style.display="none";
    document.getElementById('url').style.display="block";
  }
    

}


// Get the container element
var btnContainer = document.getElementById("ativo");

// Get all buttons with class="btn" inside the container
//var btns = btnContainer.getElementsByClassName("btn");

// Loop through the buttons and add the active class to the current/clicked button
// for (var i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function() {
//     var current = document.getElementsByClassName("active");
//     current[0].className = current[0].className.replace(" active", "");
//     this.className += " active";
//   });
// }

function displayCarregar(){
  document.getElementById('carregar').style.display = "block";
  
}


  setTimeout(function () {
		document.getElementById('alertaOk').style.display= "none";
	}, 3000);
  setTimeout(function () {
		document.getElementById('alertaErro').style.display= "none";
	}, 3000);


