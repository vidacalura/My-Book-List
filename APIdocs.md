# MyBookList

Esta é a primeira versão da API do projeto 
<a href="https://github.com/vidacalura/My-Book-List"> MyBookList </a>


## Verificar conexão com API

GET request: /


## Retornar todos os livros

GET request: /books


## Retornar livros com nome específico

GET request: /books/:nome

Parâmetros: 
* nome - string


## Retorna livros registrados por um usuário

GET request: /users/:nome

Parâmetros: 
* nome - string


## Cadastrar novo livro

POST request: /books

Parâmetros:
* criadoPor - string (Usuário que cadastrou o livro)
* nome      - string (Nome do livro)
* autor     - string (Autor do livro)
* capitulos - Number (Quantidade de capítulos do livro)


## Cadastrar usuário

POST request: /users/cad

Parâmetros:
* nome  - string (Nome do usuário)
* senha - string (Senha do usuário encriptada em SHA-512)


## Verificar existência de usuário (para login)

POST request: /users/login

Parâmetros:
* nome  - string (Nome do usuário)
* senha - string (Senha do usuário encriptada em SHA-512)


## Registrar livro em perfil de usuário

POST request: /regbook

Parâmetros:
* userNome        - string (Nome do usuário)
* cod_book        - Number (Código do livro no sistema)
* capitulos_total - Number (Número de capítulos do livro)


## Editar registro de livro

PUT resquest: /regbook

Parâmetros:
* userNome             - string (Nome do usuário)
* cod_book             - Number (Código do livro no sistema)
* (Opcional) nota      - Number (Nota dada ao livro pelo usuário)
* (Opcional) capitulos - Number (Capítulos lidos pelo usuário)
* (Opcional) estado    - Number


## Deletar registro de livro

DELETE request: /regbook

Parâmetros:
* userNome - string (Nome do usuário)
* cod_book - Number (Código do livro no sistema)