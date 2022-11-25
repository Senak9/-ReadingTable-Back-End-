const { query } = require("../bancodedados/conexao");

const listarLinguagemOriginal = async (req, res) => {
    try {
        const linguagemOriginal = await query('select * from linguagemoriginal');
        return res.json(linguagemOriginal.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listarLinguagemOriginal
}