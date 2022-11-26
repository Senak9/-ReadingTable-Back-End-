const { query } = require("../bancodedados/conexao");

const listaObraItem = async (req, res) => {
    const { usuario } = req;
    const { filtro } = req.query;

    if (filtro && !Array.isArray(filtro)) {
        return res.status(400).json({ mensagem: 'O filtro precisa ser um array' });
    }

    try {
        let queryLike = '';
        let arrayFiltro;

        if (filtro) {
            arrayFiltro = filtro.map((item) => `%${item}%`);
            queryLike += `and c.nome ilike any($2)`;
        }

        const queryObraItem = `
            select i.*, c.nome as categoria_nome from items i 
            left join categorias c 
            on i.categoria_id = c.id 
            where i.usuario_id = $1 
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