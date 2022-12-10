const { query } = require("../bancodedados/conexao");

const listarReferencias = async (req, res) => {
    const { usuario } = req;

    try {
        const referencias = await query('select * from referencias where usuario_id = $1', [usuario.id]);
        return res.json(referencias.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const detalharReferencias = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const { rowCount, rows } = await query('select * from referencias where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'O grupo não existe' });
        }

        const [referencias] = rows

        return res.json(referencias);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const cadastrarReferencias = async (req, res) => {
    const { usuario } = req;
    const { apelido } = req.body;

    if (!apelido) {
        return res.status(400).json({ mensagen: 'Nome do gurpo é obrigatório' })
    }

    try {

        const queryCadastro = 'insert into referencias (apelido, usuario_id) values ($1, $2) returning *';
        const paramCadastro = [apelido, usuario.id]
        const { rowCount, rows } = await query(queryCadastro, paramCadastro);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const [referencias] = rows;

        return res.status(201).json(referencias);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}


module.exports = {
    listarReferencias,
    detalharReferencias,
    cadastrarReferencias
}