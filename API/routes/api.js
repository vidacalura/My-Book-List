const db = require("../db/db");

const express = require("express");
const router = express.Router();

/* Routes */
router.get("/", (req, res) => {
    res.status(200).send("Conexão estabelecida com sucesso.");
});

router.get("/books", async (req, res) => {
    
    db.promise()
    .execute("SELECT * FROM books")
    .then(([rows]) => {
        res.status(200).send(rows);
    });

});

router.get("/books/:nome", async (req, res) => {

    if (req.params.nome){
        db.promise()
        .execute("SELECT * FROM books WHERE nome LIKE ? ORDER BY nome", [
            "%" + req.params.nome + "%"
        ])
        .then(([rows]) => {
            if (rows[0]){
                res.status(200).send(rows);
            }
            else {
                res.status(200).json({ "message": "Nenhum book com este nome cadastrado no momento." })
            }
        });
    }
    else {
        res.status(422).json({ "error": "Argumentos insuficientes." });
    }

});

// Retorna os livros de um usuário
router.get("/users/:nome", async (req, res) => {

    if (req.params.nome){
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
                books.cod_book, books.nome, books.autor \
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
                        res.status(200).json({ "message": "Este usuário ainda não tem books cadastrados." });
                    }
                });

            }
            else{
                res.status(404).json({ "error": "Usuário não encontrado" });
            }
        });

    }
    else {
        res.status(422).json({ "error": "Argumentos insuficientes." });
    }

});

router.post("/books", async (req, res) => {

    const { criadoPor, nome, autor, capitulos } = req.body;

    if (criadoPor == null || nome == null || autor == null || capitulos == null){
        res.status(422).json({ "error": "Argumentos insuficientes." });
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
            res.status(200).json({ "message": "Cadastrado com sucesso!" });
        });
    }

});

router.post("/users/cad", async (req, res) => {

    const { nome, senha } = req.body;

    if (nome == null || senha == null){
        res.status(422).json({ "error": "Argumentos insuficientes." });
    }
    else if (senha.length < 128){
        res.status(422).json({ "error": "Senha inválida." });
    }
    else{
        // Checa se usuário já existe
        db.promise()
        .execute("SELECT nome FROM users WHERE nome = ?;", [
            nome
        ])
        .then(([rows]) => {
            if (!rows[0]){
                db.promise()
                .execute("INSERT INTO users (cod_user, nome, senha) VALUES(NULL, ?, ?)", [
                    nome,
                    senha
                ])
                .then(() => {
                    res.status(200).json({ "message": "Usuário cadastrado com sucesso" });
                });
            }
            else {
                res.status(422).json({ "error": "Um usuário com este nome já existe" });
            }
        })
    }

});

router.post("/users/login", async (req, res) => {

    const { nome, senha } = req.body;
    
    db.promise()
    .execute("SELECT * FROM users WHERE nome = ?", [
        nome
    ])
    .then(([rows]) => {
        if (rows[0]){
            if (rows[0].senha == senha){
                res.status(200).json({ "message": "Usuário encontrado" });
            }
            else {
                res.status(422).json({ "error": "Senha incorreta" });
            }
        }
        else {
            res.status(404).json({ "error": "Usuário não encontrado" });
        }
    });

});

router.post("/regbook", (req, res) => {

    const { userNome, cod_book, capitulos_total } = req.body;

    if (userNome && cod_book && capitulos_total){
        // Acha ID do usuário
        db.promise()
        .execute("SELECT cod_user FROM users WHERE nome = ?;", [
            userNome
        ])
        .then(([rows]) => {
            if (rows[0]){
                // Verifica se livro já foi registrado pelo usuário
                cod_user = rows[0].cod_user;

                db.promise()
                .execute("SELECT cod_reg FROM registros WHERE cod_user = ? AND cod_book = ?;", [
                    cod_user,
                    cod_book
                ])
                .then(([r]) => {
                    if (!r[0]){
                        // Registra livro
                        db.promise()
                        .execute("\
                        INSERT INTO registros (cod_user, cod_book, nota, capitulos_lidos, capitulos_total, estado) \
                        VALUES(?, ?, 0, 0, ?, 0);", [
                            cod_user,
                            cod_book,
                            capitulos_total
                        ])
                        .then(() => {
                            res.status(200).json({ "message": `Livro registrado para ${userNome} com sucesso!` });
                        });
                    }
                    else {
                        res.status(422).json({ "error": "Livro já registrado pelo usuário" });
                    }
                })
            }
            else {
                res.status(404).json({ "error": "Usuário não encontrado" });
            }
        });
    }
    else {
        res.status(422).json({ "error": "Argumentos insuficientes" });
    }

});

router.put("/regbook", (req, res) => {
    
    const { userNome, cod_book } = req.query;

    if (userNome && cod_book){
        // Achar código do usuário
        db.promise()
        .execute("SELECT cod_user FROM users WHERE nome = ?;", [
            userNome
        ])
        .then(([rows]) => {
            if (rows[0]){
                cod_user = rows[0].cod_user;

                if (req.query.nota){
                    // Atualizar nota no registro
                    db.promise()
                    .execute("UPDATE registros SET nota = ? WHERE cod_user = ? AND cod_book = ?;", [
                        req.query.nota,
                        cod_user,
                        cod_book
                    ]);

                    // Atualizar nota_media do livro
                    db.promise()
                    .execute("SELECT nota FROM registros WHERE cod_book = ?;", [
                        cod_book
                    ])
                    .then(([notas]) => {
                        notaMedia = 0;
                        for (const r of notas){
                            notaMedia += r.nota;
                        }

                        notaMedia /= notas.length;

                        db.promise()
                        .execute("UPDATE books SET nota_media = ? WHERE cod_book = ?", [
                            notaMedia,
                            cod_book
                        ]);
                    });
                }
                if (req.query.capitulos){
                    // Atualizar capitulos_lidos no registro
                    db.promise()
                    .execute("UPDATE registros SET capitulos_lidos = ? WHERE cod_user = ? AND cod_book = ?;", [
                        req.query.capitulos,
                        cod_user,
                        cod_book
                    ]);
                }
                if (req.query.estado){
                    // Atualizar estado
                    db.promise()
                    .execute("UPDATE registros SET estado = ? WHERE cod_user = ? AND cod_book = ?;", [
                        req.query.estado,
                        cod_user,
                        cod_book
                    ]);
                }

                if (!req.query.nota && !req.query.capitulos && !req.query.estado) {
                    res.status(422).json({ "error": "Argumentos insuficientes" });
                }
                else {
                    res.status(200).json({ "message": "Registro atualizado com sucesso!" });
                }
            }
            else {
                res.status(422).json({ "error": "Registro não encontrado" });
            }
        });
    }
    else {
        res.status(422).json({ "error": "Argumentos insuficientes" });
    }

});

router.delete("/regbook", (req, res) => {

    const { userNome, cod_book } = req.query;

    if (userNome && cod_book){
        // Achar código do usuário
        db.promise()
        .execute("SELECT cod_user FROM users WHERE nome = ?;", [
            userNome
        ])
        .then(([rows]) => {
            if (rows[0]){
                cod_user = rows[0].cod_user;

                // Deleta registro
                db.promise()
                .execute("DELETE FROM registros WHERE cod_user = ? AND cod_book = ?", [
                    cod_user,
                    cod_book
                ])
                .then(() => {
                    res.status(200).json({ "message": "Registro removido com sucesso!" });
                })
            }
            else {
                res.status(422).json({ "error": "Registro não encontrado" });
            }
        });
    }
    else {
        res.status(422).json({ "error": "Argumentos insuficientes" });
    }

});


module.exports = router;