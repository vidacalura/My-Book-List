// This files deals with all the logic related to books.
package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/vidacalura/My-Book-List/internal/models"
	"github.com/vidacalura/My-Book-List/internal/utils"
)

type BookHandler struct {
	DB *sql.DB
}

func (h *BookHandler) GetTopBooks(w http.ResponseWriter, r *http.Request) {
	var books models.Books
	statusCode, err := books.GetFeedBooks(h.DB)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, statusCode, res)
		return
	}

	res := utils.JsonRes{"feed": books}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *BookHandler) GetBookByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var book models.Book
	statusCode, err := book.FindByID(h.DB, id)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, statusCode, res)
		return
	}

	res := utils.JsonRes{"book": book}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *BookHandler) GetBookByTitle(w http.ResponseWriter, r *http.Request) {
	title := chi.URLParam(r, "title")

	var books models.Books
	statusCode, err := books.FindByTitle(h.DB, title)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, statusCode, res)
		return
	}

	res := utils.JsonRes{"books": books}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *BookHandler) GetBookByGenre(w http.ResponseWriter, r *http.Request) {
	genre := chi.URLParam(r, "genre")

	var books models.Books
	statusCode, err := books.FindByGenre(h.DB, genre)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, statusCode, res)
		return
	}

	res := utils.JsonRes{"books": books}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *BookHandler) CreateBook(w http.ResponseWriter, r *http.Request) {
	var book models.Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		res := utils.JsonRes{"error": "Invalid book data for creation."}
		utils.JsonResponseWrite(w, http.StatusBadRequest, res)
		return
	}

	isValid, errMsg := book.IsValid()
	if !isValid {
		res := utils.JsonRes{"error": errMsg}
		utils.JsonResponseWrite(w, http.StatusBadRequest, res)
		return
	}

	statusCode, err := book.CreateBook(h.DB)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, http.StatusInternalServerError, res)
		return
	}

	res := utils.JsonRes{"message": "Book registered successfully!"}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *BookHandler) UpdateBook(w http.ResponseWriter, r *http.Request) {
	var book models.Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		res := utils.JsonRes{"error": "Invalid book data for update."}
		utils.JsonResponseWrite(w, http.StatusBadRequest, res)
		return
	}

	isValid, errMsg := book.IsValid()
	if !isValid {
		res := utils.JsonRes{"error": errMsg}
		utils.JsonResponseWrite(w, http.StatusBadRequest, res)
		return
	}

	statusCode, err := book.UpdateBook(h.DB)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, http.StatusInternalServerError, res)
		return
	}

	res := utils.JsonRes{"message": "Book updated successfully!"}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *BookHandler) DeleteBook(w http.ResponseWriter, r *http.Request) {
	var book models.Book
	var err error

	book.BookID, err = strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		res := utils.JsonRes{"error": "Invalid ID for deletion."}
		utils.JsonResponseWrite(w, http.StatusBadRequest, res)
		return
	}

	statusCode, err := book.DeleteBook(h.DB)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, http.StatusInternalServerError, res)
		return
	}

	res := utils.JsonRes{"message": "Book deleted successfully!"}
	utils.JsonResponseWrite(w, statusCode, res)
}
