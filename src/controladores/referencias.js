const { query } = require("../bancodedados/conexao");

const listarReferencias = async (req, res) => {
    try {
        const referencias = await query('select * from referencias');
        return res.json(referencias.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listarReferencias
}