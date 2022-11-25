const { query } = require("../bancodedados/conexao");

const listarTipo = async (req, res) => {
    try {
        const tipo = await query('select * from tipoobra');
        return res.json(tipo.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listarTipo
}