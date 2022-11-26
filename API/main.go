package main

import (
	// "fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"strconv"
	// "errors"
)

type Book struct{
	CodBook   int `json:"codBook"`
	CriadoPor string `json:"criadoPor"`
	NotaMedia float32 `json:"notaMedia"`
	Nome      string `json:"nome"`
	Autor     string `json:"autor"`
	Capitulos int `json:"capitulos"`
}

var books = []Book{
	{ CodBook: 1, CriadoPor: "vidacalura", NotaMedia: 8.0, Nome: "O Cortiço", Autor: "Aluísio Azevedo", Capitulos: 16 },
	{ CodBook: 2, CriadoPor: "vidacalura", NotaMedia: 8.0, Nome: "O Cortiço", Autor: "Aluísio Azevedo", Capitulos: 16 },
}

func main() {

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{ "*" },
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "PATCH"},
		AllowHeaders:     []string{ "*" },
		AllowCredentials: true,
	}))

	router.GET("/books", getBooks)
	router.GET("/books/:cod_book", findBook)
	router.POST("/books", addBooks)
	router.POST("/users", addUsers)

	router.Use(cors.Default())
	router.Run("localhost:4000")

}

func getBooks(c *gin.Context){

	c.IndentedJSON(http.StatusOK, books)

}

func addBooks(c *gin.Context){

	var book Book

	if err := c.BindJSON(&book); err != nil {
		return
	}

	books = append(books, book)

	c.IndentedJSON(http.StatusCreated, gin.H{ "message": "Foi!" })

}

func findBook(c *gin.Context){
	
	cod_book, err := strconv.Atoi(c.Param("cod_book"))

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{ "message": "Book não encontrado :(" })
	}

	for i := 0; i < len(books); i++ {
		if cod_book == books[i].CodBook {
			c.IndentedJSON(http.StatusOK, books[i])
		}
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{ "message": "Book não encontrado :(" })

}

func addUsers(c *gin.Context){

	// Criar usuário

	// Efetuar conexão do usuário
	c.IndentedJSON(http.StatusOK, gin.H{ "id": "exemplo" })

}

// c.IndentedJSON(http.[status], [JSON]) -> Retorna JSON ao Cliente
// c.BindJSON(&[var])                    -> Recebe JSON do cliente via POST
// c.Param([param])                      -> Recebe um parâmetro via GET