const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const conversas = require('../api/index.js');
const fs = require('fs');


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
    res.render('index.ejs');
});

router.get('/login', (req, res) => {
    if(req.session.usuario){
        res.render('index.ejs');
    }else{
        res.render('login.ejs'); 
    }
});

router.get('/painel', (req, res) => {
    if(req.session.usuario){
        res.render('painel.ejs');
    }else{
        res.redirect('/'); 
    }
});
router.get('/cadastrar-texto', (req, res) => {
    if(req.session.usuario){
        res.render('cadTexto.ejs');
    }else{
        res.redirect('/'); 
    }
});
router.get('/cadastrar-media', (req, res) => {
    if(req.session.usuario){
        res.render('cadMedia.ejs');
    }else{
        res.redirect('/'); 
    }
});
router.get('/conversas-cadastradas', (req, res) => {
    if(req.session.usuario){
        conversas.getConversas().then(conversasCadastradas => {
            res.render('conversasCadastradas.ejs', { dados: conversasCadastradas, alertaDelete: '' });
        });
    }else{
        res.redirect('/'); 
    }
});

router.get('/medias-cadastradas', (req, res) => {
    if(req.session.usuario){
        conversas.getMedias().then(mediasCadastradas => {
            res.render('mediasCadastradas.ejs', { dados: mediasCadastradas, alertaDelete: '' });
        });
    }else{
        res.redirect('/'); 
    }
});
router.get('/treinar-robo', (req, res) => {
    if(req.session.usuario){
        res.render('treinamento.ejs');
    }else{
        res.redirect('/'); 
    }
});

let usuario = 'mateus';
let senha = '1234';
router.post('/login', (req, res) => {
    if(req.body.usuario == usuario && req.body.senha == senha){
        req.session.usuario = usuario
        res.redirect('/painel');
    }else{
        req.flash('mensagemErro', 'Usuário/senha incorreto!');
        res.redirect('/login');
    }

});

router.get('/logout', (req, res) => {
    req.session.destroy(); 
    res.render('login.ejs');
});

//Rotas de cadastros das perguntas e respostas no banco
router.post('/cadastrar-texto', (req, res) => {
    conversas.cadastrarRespostas(req.body.resposta).then(retronoCadastro => {
        if (retronoCadastro != 'erro') {
            conversas.cadastrarPerguntas(req.body.perguntas, req.body.resposta).then ( retronoCadastro =>{
                req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
                res.redirect('/cadastrar-texto');
            })
        } else {
            req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
            res.redirect('/cadastrar-texto');
        }
        
    });
});

router.post('/cadastrar-media', upload.single('file'), (req, res) => {
    let resposta;

    if (req.body.url != '') {
        resposta = '!' + req.body.url + '!';
    } else {
        if ((extensao == '.jpg') || (extensao == '.png') || (extensao == '.jpeg')) {
            resposta = '<' + nomeArquivo + '>';
        }
        else if (extensao == '.pdf') {
            resposta = '$' + nomeArquivo + '$';

        } else if ((extensao == '.mp4') || (extensao == '.avi') || (extensao == '.wmv')) {
            resposta = '%' + nomeArquivo + '%';
        }
        else {
            resposta = '?' + nomeArquivo + '?';
        }
    }
    conversas.cadastrarMedias(nomeArquivo);
    conversas.cadastrarRespostas(resposta).then(retronoCadastro => {
        if (retronoCadastro === 'ok') {
            conversas.cadastrarPerguntas(req.body.perguntas, resposta).then ( retronoCadastro =>{
                req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
                res.redirect('/cadastrar-media');
            })
        } else {
            req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
            res.redirect('/cadastrar-media');
        }
        
    });
});


router.post('/editar-informacao', (req, res) => {
    conversas.editarConversas(req.body.id_pergunta, req.body.id_resposta, req.body.pergunta, req.body.resposta).then(retronoEditar => {
        if (retronoEditar === 'ok') {
            req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
            res.redirect('/conversas-cadastradas');

        } else {
            req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
            res.redirect('/conversas-cadastradas');
        }
    });
});
router.get('/excluir-conversas/:id', (req, res) => {
    conversas.excluirConversas(req.params.id).then(retornoExcluir => {
        if (retornoExcluir === 'ok') {
            req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
            res.redirect('/conversas-cadastradas');
        } else {
            req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
            res.redirect('/conversas-cadastradas');
        }
    });
});

router.get('/excluir-medias/:id', (req, res) => {
    conversas.getMedias().then(mediasCadastradas => {
        let fileName = mediasCadastradas.filter(media => media.id == req.params.id)
        fileName = fileName[0].media
        ext = path.extname(fileName);

        if(ext == '.pdf'){
            fileName = 'upload/pdf/'+fileName
        }else if (ext == '.png' || ext == '.jpg' || ext == '.jpeg'){
            fileName = 'upload/img/'+fileName
        }else if (ext == '.mp4' || ext == '.avi' || ext == '.wmv'){
            fileName = 'upload/video/'+fileName
        }else{
            fileName = 'upload/outros/'+fileName
        } 

        fs.rm(__dirname.replace('routes', '')+fileName, { recursive:true }, (err) => {
            if(err){
                console.error(err.message);
                return;
            }
            console.log('Arquivo deletado!');

            conversas.excluirMedias(req.params.id).then(retornoExcluir => {
                if (retornoExcluir === 'ok') {
                    req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
                    res.redirect('/medias-cadastradas');
                } else {
                    req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
                    res.redirect('/medias-cadastradas');
                }
            });

        })
    
    });
    
});

//Rotas do robô

router.post('/treinar-robo', (req, res) => {
    conversas.treinarRobo().then(retornoTreinar => {
        if (retornoTreinar === 'ok') {
            req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
            res.redirect('/treinar-robo');
        } else {
            req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
            res.redirect('/treinar-robo');
        }
    })
});

router.post('/excluir-treinamento', (req, res) => {
    conversas.excluirTreinamento().then(retorno => {
        if (retorno === 'ok') {
            req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
            res.redirect('/treinar-robo');
        } else {
            req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
            res.redirect('/treinar-robo');
        }
    })
});

module.exports = router