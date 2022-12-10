const { query } = require("../bancodedados/conexao");

const listarCriador = async (req, res) => {
    const { usuario } = req;

    try {
        const referencias = await query('select * from criadores where usuario_id = $1', [usuario.id]);
        return res.json(referencias.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const detalharCriador = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const { rowCount, rows } = await query('select * from criadores where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'O autor não existe' });
        }

        const [criador] = rows

        return res.json(criador);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const cadastrarCriador = async (req, res) => {
    const { usuario } = req;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagen: 'Nome do autor é obrigatório' })
    }


    try {
        
        const queryCadastro = 'insert into criadores (nome, usuario_id) values ($1, $2) returning *';
        const paramCadastro = [nome, usuario.id]
        const { rowCount, rows } = await query(queryCadastro, paramCadastro);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const [criador] = rows;

        return res.status(201).json(criador);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listarCriador,
    detalharCriador,
    cadastrarCriador
}