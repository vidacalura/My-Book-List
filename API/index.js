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

app.get("/books/:nome", async (req, res) => {

    if (req.params.nome){
        db.promise()
        .execute("SELECT * FROM books WHERE nome LIKE ?", [
            "%" + req.params.nome + "%"
        ])
        .then(([rows]) => {
            if (rows[0]){
                res.status(200).send(rows);
            }
            else {
                res.status(200).send({ "message": "Nenhum book com este nome cadastrado no momento." })
            }
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
        db.promise()
        .execute("SELECT cod_user FROM users WHERE nome = ?;", [
            req.params.nome
        ])
        .then(([rows]) => {
            if (rows[0]){
                const codUser = rows[0].cod_user;

                // Achar livros registrados do usuário
                db.promise()
                .execute("\
                SELECT registros.nota, registros.capitulos_lidos, registros.capitulos_total, registros.estado, \
                books.nome, books.autor \
                FROM registros \
                INNER JOIN books \
                ON registros.cod_book = books.cod_book \
                WHERE registros.cod_user = ?;", [
                    codUser
                ])
                .then(([r]) => {
                    if (r.length > 0){
                        res.status(200).send(r);
                    }
                    else {
                        res.status(200).send({ "message": "Este usuário ainda não tem books cadastrados." });
                    }
                });

            }
            else{
                res.status(404).send({ "error": "Usuário não encontrado" });
            }
        });

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