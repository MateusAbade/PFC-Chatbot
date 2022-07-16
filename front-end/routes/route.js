const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const conversas = require('../api/index.js');


const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return (h2>>>0).toString(16).padStart(8,0)+(h1>>>0).toString(16).padStart(8,0);
};

let nomeArquivo, extensao;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        extensao = path.extname(file.originalname);
        if (extensao == '.pdf')
            cb(null, '/usr/src/app/upload/pdf')
        else if (extensao == '.jpg' || extensao == '.jpeg' || extensao == '.png')
            cb(null, '/usr/src/app/upload/img')
        else if (extensao == '.mp4' || extensao == '.avi' || extensao == '.wmv')
            cb(null, '/usr/src/app/upload/video')
        else
            cb(null, '/usr/src/app/upload/outros')
    },
    filename: function (req, file, cb) {
        nomeArquivo = cyrb53(file.originalname ) +Date.now()+ path.extname(file.originalname);
        cb(null, nomeArquivo);
    }

});

const upload = multer({ storage })

//Rotas das páginas 
router.get('/', (req, res) => {
    res.render('index.ejs', {teste: 'ola'});
});
router.get('/cad-texto', (req, res) => {
    res.render('cadTexto.ejs', { alertaCadastro: '' });
});
router.get('/cad-midia', (req, res) => {
    res.render('cadMidia.ejs', { alertaCadastro: '' });
});
router.get('/conversas-cadastradas', (req, res) => {
    conversas.getConversas().then(conversasCadastradas => {
        res.render('conversasCadastradas.ejs', { dados: conversasCadastradas, alertaDelete: '' });
    });
});
router.get('/treinar-robo', (req, res) => {
    res.render('treinamento.ejs', { alertaTreinamento: '' });
});


//Rotas de cadastros das perguntas e respostas no banco
router.post('/cadastrar-texto', (req, res) => {
    conversas.cadastrarRespostas(req.body.resposta).then(v => {
        let alerta;
        if (v == 'ok') {
            conversas.cadastrarPerguntas(req.body.perguntas, req.body.resposta);
            alerta = 'ok';
        } else {
            alerta = 'erro';
        }
        res.render('cadTexto.ejs',{ alertaCadastro: alerta });
    });
    
});

router.post('/cadastrar-midia', upload.single('file'), (req, res) => {
    let resposta;

    if (req.body.url != '') {
        resposta = "!" + req.body.url + "!";
    } else {
        if ((extensao == '.jpg') || (extensao == '.png') || (extensao == '.jpeg')) {
            resposta = "<" + nomeArquivo + ">";
        }
        else if (extensao == '.pdf') {
            resposta = "$" + nomeArquivo + "$";

        } else if ((extensao == '.mp4') || (extensao == '.avi') || (extensao == '.wmv')) {
            resposta = "%" + nomeArquivo + "%";
        }
        else {
            resposta = "?" + nomeArquivo + "?";
        }
    }
    conversas.cadastrarRespostas(resposta).then(v => {
        let alerta;
        if (v == 'ok') {
            conversas.cadastrarPerguntas(req.body.perguntas, resposta);
            alerta = 'ok';
        } else {
            alerta = 'erro';
        }
        res.render('cadMidia.ejs', { alertaCadastro: alerta });
    });

    
});

router.post('/editar-informacao', (req, res) => {
    conversas.editarConversas(req.body.id_pergunta, req.body.id_resposta, req.body.pergunta, req.body.resposta).then(retorno => {
        if (retorno === "ok") {
            conversas.getConversas().then(conversasCadastradas => {
                res.render('conversasCadastradas.ejs', { dados: conversasCadastradas, alertaDelete: 'ok' });
            });
        } else {
            res.render('conversasCadastradas.ejs', { alertaDelete: 'erro' });
        }
    });
});

router.get('/excluir-conversas/:id', (req, res) => {
    conversas.excluirConversas(req.params.id).then(retorno => {
        if (retorno === "ok") {
            conversas.getConversas().then(conversasCadastradas => {
                res.render('conversasCadastradas.ejs', { dados: conversasCadastradas, alertaDelete: 'ok' });
            });
        } else {
            res.render('conversasCadastradas.ejs', { alertaDelete: 'erro' });
        }
    });
});

//Rotas do robô

router.post('/treinar-robo', (req, res) => {
    conversas.treinarRobo().then(retorno => {
        let alerta;
        if (retorno == "ok") {
            alerta = 'ok';
        } else {
            alerta = 'erro';
        }
        res.render('treinamento.ejs', { alertaTreinamento: alerta});
    })
});

router.post('/excluir-treinamento', (req, res) => {
    conversas.excluirTreinamento().then(retorno => {
        let alerta;
        if (retorno == "ok") {
            alerta = 'ok';
        } else {
            alerta =   'erro';
        }
        res.render('treinamento.ejs', { alertaTreinamento: alerta});
    })
});

module.exports = router