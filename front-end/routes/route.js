const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const conversas = require('../api/index.js');

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
        nomeArquivo = file.originalname + Date.now() + path.extname(file.originalname);
        cb(null, nomeArquivo);
    }
});

const upload = multer({ storage })


//Rotas das páginas 
router.get('/', (req, res) => {
    res.render('index.ejs');
});
router.get('/cad-texto', (req, res) => {
    res.render('cadTexto.ejs');
});
router.get('/cad-midia', (req, res) => {
    res.render('cadMidia.ejs');
});
router.get('/conversas-cadastradas', (req, res) => {
    conversas.getConversas().then(conversasCadastradas => {
        res.render('conversasCadastradas.ejs', { dados: conversasCadastradas });
    });
});
router.get('/treinar-robo', (req, res) => {
    res.render('treinamento.ejs');
});


//Rotas de cadastros das perguntas e respostas no banco
router.post('/cadastrar-texto', (req, res) => {
    conversas.cadastrarRespostas(req.body.resposta).then(v => {
        if (v == 'ok') {
            conversas.cadastrarPerguntas(req.body.perguntas, req.body.resposta);
        } else {
            console.log('Não foi possivel gravar as informações no banco de dados');
        }
    });
    res.render('cadTexto.ejs');
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
        if (v == 'ok') {
            conversas.cadastrarPerguntas(req.body.perguntas, resposta);
        } else {
            console.log('Não foi possivel gravar as informações no banco de dados');
        }
    });

    res.render('cadMidia.ejs');
});

router.post('/editar-informacao', (req, res) => {
    conversas.editarConversas(req.body.id_pergunta, req.body.id_resposta, req.body.pergunta, req.body.resposta).then(retorno => {
        if (retorno === "ok") {
            conversas.getConversas().then(conversasCadastradas => {
                res.render('conversasCadastradas.ejs', { dados: conversasCadastradas });
            });
        } else {
            res.render('conversasCadastradas.ejs', { erro: retorno });
        }
    });
});

router.get('/excluir-conversas/:id', (req, res) => {
    conversas.excluirConversas(req.params.id).then(retorno => {
        if (retorno === "ok") {
            conversas.getConversas().then(conversasCadastradas => {
                res.render('conversasCadastradas.ejs', { dados: conversasCadastradas });
            });
        } else {
            res.render('conversasCadastradas.ejs', { erro: "Não foi possível excluir, tente novamente mais tarde!" });
        }
    });
});

//Rotas do robô

router.post('/treinar-robo', (req, res) => {
    conversas.treinarRobo();
    res.render('treinamento.ejs');
});

router.post('/excluir-treinamento', (req, res) => {
    conversas.excluirTreinamento();
    res.render('treinamento.ejs');
});

module.exports = router