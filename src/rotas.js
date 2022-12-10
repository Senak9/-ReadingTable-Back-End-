const express = require('express');
const { listarCriador } = require('./controladores/autor');
const { listarCategorias } = require('./controladores/categoria');
const { login } = require('./controladores/login');
const { listaObraItem } = require('./controladores/obraItem');
const { listarLinguagemOriginal } = require('./controladores/origem');
const { listarReferencias } = require('./controladores/referencias');
const { listarTipo } = require('./controladores/tipo');
const { cadastrarUsuario, obterPerfilUsuario, atualizarPerfilUsuario } = require('./controladores/usuario');
const { filtroAutenticacao } = require('./intermediarios/autenticacao');


const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtroAutenticacao);

rotas.get('/usuario', obterPerfilUsuario);
rotas.put('/usuario', atualizarPerfilUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/origem', listarLinguagemOriginal);

rotas.get('/tipo', listarTipo);

rotas.get('/autor', listarCriador);

rotas.get('/referencias', listarReferencias);

rotas.get('/obraItem', listaObraItem);



module.exports = rotas