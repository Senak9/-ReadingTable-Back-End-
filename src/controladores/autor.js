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

module.exports = {
    listarCriador
}