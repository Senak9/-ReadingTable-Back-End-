const { query } = require("../bancodedados/conexao");

const listaObraItem = async (req, res) => {
    const { usuario } = req;

    try {
        let queryLike = '';

        const queryObraItem = `
            select t.*, c.descricao as categoria_nome from items t 
            left join categorias c 
            on t.categoria_id = c.id 
            where t.usuario_id = $1 
            ${queryLike}
        `;


        const obraItens = await query(queryObraItem);
        return res.json(obraItens.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listaObraItem
}