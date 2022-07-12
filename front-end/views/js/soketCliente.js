
getMidia = function (url){
    return 'http://127.0.0.1:5003' +url;
 }
 
 window.onload = function () {
   const socket = io('http://127.0.0.1:5001');
 
   socket.on('connect', () => {
     socket.send('Usuário conectado ao socket!')
   });
 
   document.querySelector("form").addEventListener("submit", function (event) {
     event.preventDefault();
     if (event.target[1].value) {
       socket.emit('sendMessage', event.target[1].value);
       const user = document.createElement('user')
       const chatUser = document.querySelector('.chatBot');
       user.innerHTML =
         `<div class=" d-flex flex-row-reverse bd-highlight">
           <div class="botInput p-2 mb-3 text-end bd-highlight">
             <span id="user" class="text-break">${event.target[1].value}</span>
           </div>
         </div>`
       chatUser.append(user);
       event.target[1].value = "";
     }
   })
 
   socket.on('getMessage', (msg) => {
     const bot = document.createElement('bot');
     const chatBot = document.querySelector('.chatBot');
     let tipoMensagem, mensagem;
     mensagem = msg.slice(1, -1);
     console.log(getMidia(mensagem));
     if ((msg.charAt(0) === '<') && (msg.charAt(msg.length - 1) === '>')) {
       tipoMensagem = `<img onclick="clique('${getMidia(`/img/`+mensagem)}', 'img')" id="miniatura" src="${getMidia(`/img/`+mensagem)}"  alt="">`;
 
     } else if ((msg.charAt(0) === '%') && (msg.charAt(msg.length - 1) === '%')) {
       tipoMensagem = `<video width="320" height="240" controls>
         <source src="${getMidia(`/video/`+mensagem)}" type="video/mp4">
         <source src="${getMidia(`/video/`+mensagem)}" type="video/ogg">
       </video>`;
 
     } else if ((msg.charAt(0) === '$') && (msg.charAt(msg.length - 1) === '$')) {
       tipoMensagem = `<span>Para saber mais </span><a class="link" href="${getMidia(`/pdf/`+mensagem)}" target="_blank">Clique aqui</a>`;
 
     } else if ((msg.charAt(0) === '?') && (msg.charAt(msg.length - 1) === '?')) {
       tipoMensagem = `<span>Para saber mais </span><a class="link" href="${getMidia(`/outros/`+mensagem)}" target="_blank">Clique aqui</a>`;
 
     }else if ((msg.charAt(0) === '!') && (msg.charAt(msg.length - 1) === '!')) {
       tipoMensagem = `<span>Acesse o link: </span><a class="link" href="${mensagem}" target="_blank">${mensagem}</a>`;
 
     }else {
       tipoMensagem = msg;
     }
     bot.innerHTML =
       `<div class=" align-self-end">
       <div class="d-flex flex-row bd-highlight justify-content-start">
         <img class="imgRobo" src="./img/robo2.png"  alt="">
         <div class="botOutinput p-2  mb-3 bd-highlight">
           <span id="bot" class="text-break">${tipoMensagem}</span>
       </div>
     </div>
     </div>`;
     chatBot.append(bot);
 
   })
 }