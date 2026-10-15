const express = requise('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('../../db'); //importar a conexão com o banco de daodos

const { dataBR } =  require('../../utils/dataBR');
const { error } = require('console');

//local onde as imagens serão salvas
const AVATAR_DIR = path.join(__dirname, '..', '..', 'public', 'img', 'avatar');
if (!fs.existsSync(AVATAR_DIR)){
    fs.mkdirSync(AVATAR_DIR, {recursive: true});

}

//config de upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb => cb(null, AVATAR_DIR)),
    filename: (req, file, cb) =>{
        const ext = path.extname(file.originalname).toLowerCase();
        const nome = 'avatar_' + Date.now() + '_' + Math.floor(Math.random() * 1e9) + ext;
        cb(null, nome);
    }
});

//upload e limite de tamanho do arquivo
const upload = multer({
    limits: {fileSize: 5*1024*1024},
    fileFilter: (req, file, cb) => {
        const permitidos = ['.jpg','.jpeg','.png','.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (permitidos.includes(ext)) return cb(null,true);
        return cb(new Error("Apenas arquivos de imagens são permitidos"));
    }
});

//remover o arquivo

function removerArquivoAvatar(nomeArquivo){
    if (!nomeArquivo) return;
    //so remove o arquivo da nossa pasta (nunca caminhos externos)
    const nome = path.basename(nomeArquivo);
    if (!nome.startsWith('avatar_')) return;
    const caminho = path.join(AVATAR_DIR, nome);
    fs.unlink(caminho, ()=>{});
}

// rota para nossa API para o PUT de avatar
    
router.put('/avatar', upload.single('avatar'),(req, res) =>{
    try{
        if(!req.file) return res.status(400).json({error: 'Nenhum arquivo enviado'});
        res.json({ avatar: '/img/avatar/' + req.file.filename});
    }catch (error){
        res.status(500).json({error: error.message});
    }
});