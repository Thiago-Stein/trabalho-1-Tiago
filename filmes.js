const express = require('express');
const app = express();

app.use(express.json());

// Nosso "banco de dados" em memória
let filmes = [
    { id: 1, nome: "Hereditário", tempoEmMinutos: 126, genero: "Terror", classificacaoIndicativa: 16 },
    { id: 2, nome: "Flow", tempoEmMinutos: 85, genero: "Animação/Aventura", classificacaoIndicativa: 0 },
    { id: 3, nome: "La La Land", tempoEmMinutos: 128, genero: "Musical", classificacaoIndicativa: 0 },
    { id: 4, nome: "Seven", tempoEmMinutos: 127, genero: "Investigação/Suspense", classificacaoIndicativa: 16 }
];

// Rota pra listar os filmes (com filtro, ordenação e paginação)
app.get('/api/filmes', (req, res) => {
    // Pegando as variáveis da URL
    const { genero, tempo_max, tempo_min, ordem, direcao, pagina = 1, limite = 11 } = req.query;

    let resultado = filmes;

    // Faz os filtros se a pessoa passou na query
    if (genero) resultado = resultado.filter(p => p.genero === genero);
    if (tempo_max) resultado = resultado.filter(p => p.tempoEmMinutos <= parseFloat(tempo_max));
    if (tempo_min) resultado = resultado.filter(p => p.tempoEmMinutos >= parseFloat(tempo_min));

    // Arruma a ordem se o usuário pedir
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

    // Lógica da paginação
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginado = resultado.slice(inicio, inicio + limiteNum);

    // Devolve os dados e as informações da página
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

// Busca um filme só pelo ID
app.get('/api/filmes/:id', (req, res) => {
    const filme = filmes.find(p => p.id === parseInt(req.params.id));
    
    // Se não achar, retorna erro 404
    if (!filme) return res.status(404).json({ erro: "Filme não encontrado" });
    
    res.json(filme);
});

// Rota pra adicionar filme novo
app.post('/api/filmes', (req, res) => {
    const { nome, tempoEmMinutos, genero, classificacaoIndicativa } = req.body;

    // Vê se mandou todos os campos obrigatórios
    if (!nome || !genero || tempoEmMinutos === undefined || classificacaoIndicativa === undefined) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    // Confere se o tipo dos dados tá certo
    if (typeof nome !== 'string' || typeof genero !== 'string') {
        return res.status(400).json({ erro: "Nome e gênero devem ser texto" });
    }
    if (typeof tempoEmMinutos !== 'number' || typeof classificacaoIndicativa !== 'number') {
        return res.status(400).json({ erro: "Tempo e classificação devem ser números" });
    }

    // Validações extras (não pode ser vazio, tempo negativo, etc)
    if (nome.trim() === '' || genero.trim() === '') {
        return res.status(400).json({ erro: "Nome e gênero não podem ser vazios" });
    }
    if (tempoEmMinutos <= 0) {
        return res.status(400).json({ erro: "Tempo deve ser maior que 0" });
    }
    if (classificacaoIndicativa < 0) {
        return res.status(400).json({ erro: "Classificação inválida" });
    }

    // Gera o ID novo pegando o maior que já tem e somando 1
    const novoFilme = {
        id: filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1,
        nome,
        tempoEmMinutos,
        genero,
        classificacaoIndicativa
    };

    filmes.push(novoFilme);
    res.status(201).json(novoFilme); // 201 = Created
});

// Atualiza os dados de um filme existente
app.put('/api/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(p => p.id === id);

    if (!filme) return res.status(404).json({ erro: "Filme não encontrado" });

    const { nome, tempoEmMinutos, genero, classificacaoIndicativa } = req.body;

    // Atualiza só os campos que vieram na requisição
    if (nome !== undefined) filme.nome = nome;
    if (tempoEmMinutos !== undefined) filme.tempoEmMinutos = tempoEmMinutos;
    if (genero !== undefined) filme.genero = genero;
    if (classificacaoIndicativa !== undefined) filme.classificacaoIndicativa = classificacaoIndicativa;

    res.json(filme);
});

// Deleta um filme
app.delete('/api/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = filmes.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: "Filme não encontrado" });
    }

    // Tira o filme do array usando o splice
    const filmeRemovido = filmes.splice(indice, 1)[0];
    
    res.json({
        mensagem: "Filme removido com sucesso",
        filme: filmeRemovido
    });
});

// Roda o servidor
app.listen(3000, '0.0.0.0', () => console.log('API iniciada!!'));