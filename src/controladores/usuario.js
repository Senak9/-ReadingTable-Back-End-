const { query } = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, username } = req.body;

    if (!nome || !email || !senha || !username) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const usuario = await query('select * from usuarios where email = $1 or username = $2', [email, username]);
     
        if (usuario.rows[0].email === email) {
            return res.status(400).json({ mensagem: 'O e-mail já existe cadastrado.' });
        }

        if (usuario.rows[0].username === username) {
            return res.status(400).json({ mensagem: 'O Usuario já existe cadastrado.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = 'insert into usuarios (nome, email, senha, username) values ($1, $2, $3, $4) returning *';
        const paramCadastro = [nome, email, senhaCriptografada, username];
        const usuarioCadastrado = await query(queryCadastro, paramCadastro);

        if (usuarioCadastrado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const { senha: _, ...cadastro } = usuarioCadastrado.rows[0]

        return res.status(201).json(cadastro);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const obterPerfilUsuario = async (req, res) => {
    return res.json(req.usuario);
}

const atualizarPerfilUsuario = async (req, res) => {
    const { usuario } = req;

    const { nome, email, senha, username } = req.body;

    if (!nome || !email || !senha || !username) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const usuarioEncontrado = await query('select * from usuarios where email = $1', [email]);

        if (usuario.email === email && usuarioEncontrado.rows[0].id !== usuario.id) {
            return res.status(400).json({ mensagem: 'O e-mail já existe cadastrado.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizacao = 'update usuarios set nome = $1, email = $2, senha = $3, username = $4 where id = $5';
        const paramAtualizacao = [nome, email, senhaCriptografada, username, usuario.id];
        const usuarioAtualizado = await query(queryAtualizacao, paramAtualizacao);

        if (usuarioAtualizado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfilUsuario,
    atualizarPerfilUsuario
}