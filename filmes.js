const express = require('express');
const app = express();

app.use(express.json());

// Dados em memória
let filmes = [
    { id: 1, nome: "Hereditário", tempoEmMinutos: 126, genero: "Terror", classificacaoIndicativa: 16 },
    { id: 2, nome: "Flow", tempoEmMinutos: 85, genero: "Animação/Aventura", classificacaoIndicativa: 0 },
    { id: 3, nome: "La La Land", tempoEmMinutos: 128, genero: "Musical", classificacaoIndicativa: 0 },
    { id: 4, nome: "Seven", tempoEmMinutos: 127, genero: "Investigação/Suspense", classificacaoIndicativa: 16 }
];

// GET /api/filmes - Listar com filtros, ordenação e paginação
app.get('/api/filmes', (req, res) => {
    const { genero, tempo_max, tempo_min, ordem, direcao, pagina = 1, limite = 11 } = req.query;

    let resultado = filmes;

    // Filtros
    if (genero) resultado = resultado.filter(p => p.genero === genero);
    if (tempo_max) resultado = resultado.filter(p => p.tempoEmMinutos <= parseFloat(tempo_max));
    if (tempo_min) resultado = resultado.filter(p => p.tempoEmMinutos >= parseFloat(tempo_min));

    // Ordenação
    if (ordem) {
        resultado = [...resultado].sort((a, b) => {
            if (ordem === 'tempoEmMinutos') {
                return direcao === 'desc'
                    ? b.tempoEmMinutos - a.tempoEmMinutos
                    : a.tempoEmMinutos - b.tempoEmMinutos;
            }
            if (ordem === 'nome') {
                return direcao === 'desc'
                    ? b.nome.localeCompare(a.nome)
                    : a.nome.localeCompare(b.nome);
            }
            return 0;
        });
    }

    // Paginação
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginado = resultado.slice(inicio, inicio + limiteNum);

    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

// GET /api/filmes/:id - Buscar por ID
app.get('/api/filmes/:id', (req, res) => {
    const filme = filmes.find(p => p.id === parseInt(req.params.id));
    if (!filme) return res.status(404).json({ erro: "Filme não encontrado" });
    res.json(filme);
});

// POST /api/filmes - Criar novo filme com validação
app.post('/api/filmes', (req, res) => {
    const { nome, tempoEmMinutos, genero, classificacaoIndicativa } = req.body;

    // Validação de presença
    if (!nome || !genero || tempoEmMinutos === undefined || classificacaoIndicativa === undefined) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios"
        });
    }

    // Validação de tipo
    if (typeof nome !== 'string' || typeof genero !== 'string') {
        return res.status(400).json({ erro: "Nome e gênero devem ser texto" });
    }

    if (typeof tempoEmMinutos !== 'number' || typeof classificacaoIndicativa !== 'number') {
        return res.status(400).json({ erro: "Tempo e classificação devem ser números" });
    }

    // Validação de conteúdo
    if (nome.trim() === '' || genero.trim() === '') {
        return res.status(400).json({ erro: "Nome e gênero não podem ser vazios" });
    }

    if (tempoEmMinutos <= 0) {
        return res.status(400).json({ erro: "Tempo deve ser maior que 0" });
    }

    if (classificacaoIndicativa < 0) {
        return res.status(400).json({ erro: "Classificação inválida" });
    }

    const novoFilme = {
        id: filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1,
        nome,
        tempoEmMinutos,
        genero,
        classificacaoIndicativa
    };

    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

// PUT /api/filmes/:id - Atualizar filme
app.put('/api/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(p => p.id === id);

    if (!filme) return res.status(404).json({ erro: "Filme não encontrado" });

    const { nome, tempoEmMinutos, genero, classificacaoIndicativa } = req.body;

    if (nome !== undefined) filme.nome = nome;
    if (tempoEmMinutos !== undefined) filme.tempoEmMinutos = tempoEmMinutos;
    if (genero !== undefined) filme.genero = genero;
    if (classificacaoIndicativa !== undefined) filme.classificacaoIndicativa = classificacaoIndicativa;

    res.json(filme);
});

// DELETE /api/filmes/:id - Remover filme
app.delete('/api/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = filmes.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: "Filme não encontrado" });
    }

    const filmeRemovido = filmes.splice(indice, 1)[0];
    res.json({
        mensagem: "Filme removido com sucesso",
        filme: filmeRemovido
    });
});

// Iniciar o servidor com URL do servidor localhost
app.listen(3000, '0.0.0.0', () => console.log('API iniciada!!'));