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
            select i.*, c.nome as categoria_nome from itens i 
            left join categorias c 
            on i.categoria_id = c.id 
            where i.usuario_id = $1 
            ${queryLike}
        `;

        const paramFiltro = filtro ? [usuario.id, arrayFiltro] : [usuario.id];

        const obraItens = await query(queryObraItem, paramFiltro);
        return res.json(obraItens.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const detalharObraItem = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const { rowCount, rows } = await query('select * from itens where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'o Item não existe' });
        }

        const [obraItem] = rows

        return res.json(obraItem);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listaObraItem,
    detalharObraItem
}