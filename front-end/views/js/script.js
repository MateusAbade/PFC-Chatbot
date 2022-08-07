
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
  var btnRobo = document.getElementById('btnRobo');
  btnRobo.style.display="none";
}
function mostrarBtnChat(){
  var btnRobo = document.getElementById('btnRobo');
  btnRobo.style.display="flex";
}

function arquivoUrl(valor){
  if(valor == 'true'){
    document.getElementById('arquivoLocal').style.display="none";
    document.getElementById('arquivoUrl').style.display="block";
    document.getElementById('voltar').style.display="block";
    document.getElementById('url').style.display="none";
    document.getElementById('inputUrl').setAttribute('required', '')
    document.getElementById('inputLocal').removeAttribute('required', '')
  }else{
    document.getElementById('arquivoLocal').style.display="block";
    document.getElementById('arquivoUrl').style.display="none";
    document.getElementById('voltar').style.display="none";
    document.getElementById('url').style.display="block";
    document.getElementById('inputUrl').removeAttribute('required', '')
    document.getElementById('inputLocal').setAttribute('required', '')
  }
}


function displayCarregar(){
  document.getElementById('carregar').style.display = "block";  
}


setTimeout(function () {
  let alertaOk = document.getElementById('alertaOk')
  if (alertaOk !== null){
    alertaOk.style.display= "none";
  }
}, 3000);

setTimeout(function () {
  let alertaErro = document.getElementById('alertaErro')
  if (alertaErro !== null){
    alertaErro.style.display= "none";
  }
}, 3000);

