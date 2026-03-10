# Orders API - Desafio Técnico

API desenvolvida em **Node.js** utilizando **Express** e **SQLite** para gerenciamento de pedidos.

O projeto implementa uma API REST que permite criar, consultar, listar, atualizar e deletar pedidos, realizando também o mapeamento dos campos conforme especificado no desafio técnico.

---

# Tecnologias utilizadas

- Node.js
- Express
- SQLite
- JavaScript

---

# Estrutura do projeto
orders-api
│
├── configs
│ └── database.js
│
├── controllers
│ └── orderController.js
│
├── models
│ └── orderModel.js
│
├── routes
│ └── orderRoutes.js
│
├── .gitignore
├── package.json
├── README.md
└── server.js


---

# Endpoints da API

## Criar pedido

POST `/order`

Exemplo de body:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
Listar todos os pedidos

GET /order/list

Exemplo:

http://localhost:3000/order/list
Buscar pedido por número

GET /order/:id

Exemplo:

http://localhost:3000/order/v10089015vdb-01

Resposta exemplo:

{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
Atualizar pedido

PUT /order/:id

Deletar pedido

DELETE /order/:id

Mapeamento de campos

A API recebe os dados no seguinte formato:

Campo recebido	Campo salvo no banco
numeroPedido	orderId
valorTotal	value
dataCriacao	creationDate
idItem	productId
quantidadeItem	quantity
valorItem	price
Como executar o projeto

Clone o repositório:

git clone https://github.com/ivanrinaldi11/orders-api-nodejs.git

Entre na pasta do projeto:

cd orders-api-nodejs

Instale as dependências:

npm install

Execute o servidor:

node server.js

A API ficará disponível em:

http://localhost:3000
Exemplo de testes

Listar pedidos:

curl http://localhost:3000/order/list

Buscar pedido:

curl http://localhost:3000/order/v10089015vdb-01
Autor

Projeto desenvolvido como parte de desafio técnico para vaga de Analista de Sistemas Jr / Backend.