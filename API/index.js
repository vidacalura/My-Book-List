const db = require("./db/db");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000 || process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

app.listen(port);

/* Routes */
app.get("/", (req, res) => {
    res.status(200).send("Conexão estabelecida com sucesso.");
});

app.get("/books", async (req, res) => {
    
    db.promise()
    .execute("SELECT * FROM books")
    .then(([rows]) => {
        res.status(200).send(rows);
    });

});

app.get("/books/:id", async (req, res) => {

    if (req.params.id){
        db.promise()
        .execute("SELECT * FROM books;")
        .then(([rows]) => {

            for (let i = 0; i < rows.length; i++){
                if (rows[i].cod_book == req.params.id){
                    res.status(200).send(rows[i]);
                }
            }

            res.status(404).send({ "error": "Book não encontrado. :(" });
        });
    }
    else {
        res.status(422).send({ "error": "Argumentos insuficientes." });
    }

});

// Retorna os livros de um usuário
app.get("/users/:nome", async (req, res) => {

    if (req.params.nome){
        dados = []
        
        // Achar ID do usuário


        // Achar livros registrados do usuário
        db.promise()
        .execute("SELECT * FROM registros WHERE cod_user = ?;", [
            codUser
        ])
        .then(([rows]) => {
            for (let i = 0; i < rows.length; i++){
                dados.push();
            }
        });

        // Retorna: nome do livro, autor, nota, capitulos total, capitulos lidos e estado
    }
    else {
        res.status(422).send({ "error": "Argumentos insuficientes." });
    }

});

app.post("/books", async (req, res) => {

    const { criadoPor, nome, autor, capitulos } = req.body;

    if (criadoPor == null || nome == null || autor == null || capitulos == null){
        res.status(422).send({ "error": "Argumentos insuficientes." });
    }
    else{
        db.promise()
        .execute("INSERT INTO books (criado_por, nota_media, nome, autor, capitulos) VALUES(?, ?, ?, ?, ?);", [
            criadoPor,
            0,
            nome,
            autor,
            capitulos
        ])
        .then(() => {
            res.status(200).send({ "message": "Cadastrado com sucesso!" });
        });
    }

});

app.post("/users", async (req, res) => {

    const { nome, senha } = req.body;

    if (nome == null || senha == null){
        res.status(422).send({ "error": "Argumentos insuficientes." });
    }
    else if (senha.length < 128){
        res.status(422).send({ "error": "Senha inválida." });
    }
    else{
        // Checa se usuário já não existe
        if (nome){
            db.promise()
            .execute("INSERT INTO users (nome, senha) VALUES(?, ?)", [
                nome,
                senha
            ])
            .then(() => {
                res.status(200).send({ "message": "Usuário cadastrado com sucesso" });
            });
        }
    }

});