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

module.exports = {
    listarReferencias
}