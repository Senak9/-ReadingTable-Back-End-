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

const cadastrarObraItem = async (req, res) => {
    const { usuario } = req;
    const { nome, marcacao, sinopse, links, wiki, criador_id, fonte_id, categoria_id, origem_id, referencia_id } = req.body;

    if (!nome || !marcacao || !sinopse || !links || !wiki || !criador_id || !fonte_id || !categoria_id || !origem_id || !referencia_id) {
        return res.status(400).json({ mensagen: 'Todos os campos são obrigatórios' })
    }

    try {
        const categoria = await query('select * from categorias where id = $1', [categoria_id]);

        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A categoria não existe' });
        }
        
        const criador = await query('select * from criadores where id = $1', [criador_id]);

        if (criador.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A autor não existe' });
        }

        const fonte = await query('select * from linguagemoriginal where id = $1', [fonte_id]);

        if (fonte.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A linguagem não existe' });
        }

        const origem = await query('select * from tipoobra where id = $1', [origem_id]);

        if (origem.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A tipo não existe' });
        }

        const referencia = await query('select * from referencias where id = $1', [referencia_id]);

        if (referencia.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'O grupo não existe' });
        }

        const queryCadastro = 'insert into itens (nome, marcacao, sinopse, links, wiki, criador_id, fonte_id, categoria_id, origem_id, referencia_id, usuario_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *';
        const paramCadastro = [nome, marcacao, sinopse, links, wiki, criador_id, fonte_id, categoria_id, origem_id, referencia_id, usuario.id]
        const { rowCount, rows } = await query(queryCadastro, paramCadastro);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const [obraItem] = rows;
        obraItem.categoria_nome = categoria.rows[0].nome;

        return res.status(201).json(obraItem);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    listaObraItem,
    detalharObraItem,
    cadastrarObraItem
}