Autor/Aluno : Thiago Gomes Stein

#API de armazenar filmes

Endpoints:
GET /api/filmes
Método: GET
URL: http://localhost:3000/api/filmes
Body: não tem
Resposta: lista de filmes (com filtros/ordenação se usados)

Exemplo de Get Todos:
<img width="1286" height="838" alt="getTodos" src="https://github.com/user-attachments/assets/f79b69ed-726e-4f9f-8733-0b6b8d9b0c99" />

Exemplo de Get Por Genero:
<img width="1279" height="829" alt="getPorGenero" src="https://github.com/user-attachments/assets/2fea21d3-7fc6-4ded-bc59-fb12eced8586" />

Exemplo de Get Ordenando por nome:
<img width="1280" height="831" alt="getOrdenadoPorNome" src="https://github.com/user-attachments/assets/7274e157-6b50-4ce8-b3d6-1b54a1dc1be4" />


GET /api/filmes/:id
Método: GET
URL: http://localhost:3000/api/filmes/1
Body: não tem
Resposta: retorna um filme específico ou erro 404

Exemplo Get por Id:
<img width="1283" height="844" alt="getPorId" src="https://github.com/user-attachments/assets/ec4ad251-332c-426a-a297-928f5467ff48" />


POST /api/filmes
Método: POST
URL: http://localhost:3000/api/filmes
Body: JSON
Resposta: filme criado com ID automático

Exemplo de Body:
{
  "nome": "Algum Filme",
  "tempoEmMinutos": 123,
  "genero": "Algum genero",
  "classificacaoIndicativa": 18
}

Post 1:
<img width="1277" height="845" alt="post1" src="https://github.com/user-attachments/assets/515bb8c3-0db2-4890-97fa-ae136603376a" />

Post 2:
<img width="1282" height="835" alt="post2" src="https://github.com/user-attachments/assets/1fe7263d-94cc-4ddc-9485-0e87d166eb44" />

Post 3:
<img width="1281" height="833" alt="post3" src="https://github.com/user-attachments/assets/885a1ef5-90cf-4cbb-90b7-838b9700008a" />

Post 4:
<img width="1280" height="834" alt="post4" src="https://github.com/user-attachments/assets/a4337b01-f5cb-40e2-8dc0-bcf4a7e5eb1c" />

Post 5:
<img width="1286" height="835" alt="post5" src="https://github.com/user-attachments/assets/bd13b8ac-e09e-4002-bc38-f0b061f9b79d" />


PUT /api/filmes/:id
Método: PUT
URL: http://localhost:3000/api/filmes/1
Body: JSON (parcial ou completo)
Resposta: filme atualizado

Teste do Put:
<img width="1278" height="837" alt="testeDoPut" src="https://github.com/user-attachments/assets/7aa7585d-3647-4f3d-a484-e7976086dcec" />



DELETE /api/filmes/:id
Método: DELETE
URL: http://localhost:3000/api/filmes/2
Body: não tem
Resposta: mensagem de sucesso + filme removido

Teste do Delete:

<img width="1278" height="836" alt="testeDoDelete" src="https://github.com/user-attachments/assets/fe4810f5-c6a7-4931-b097-5c9060588594" />

-------------------------------------------------------------------
Validações que foram implementadas:
- Todos os campos obrigatórios
- Nome e gênero devem ser texto
- Tempo e classificação devem ser números
- Nome e gênero não podem ser vazios
- Tempo deve ser maior que 0
- Classificação não pode ser negativa
