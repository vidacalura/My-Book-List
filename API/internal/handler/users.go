// This file deals with all the logic of user-related business logic.
package handler

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/vidacalura/My-Book-List/internal/models"
	"github.com/vidacalura/My-Book-List/internal/utils"
)

type UserHandler struct {
	DB *sql.DB
}

func (h *UserHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")

	var user models.User
	statusCode, err := user.GetUserProfile(h.DB, username)
	if err != nil {
		res := utils.JsonRes{"error": err.Error()}
		utils.JsonResponseWrite(w, statusCode, res)
		return
	}

	res := utils.JsonRes{"user": user}
	utils.JsonResponseWrite(w, statusCode, res)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {

}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {

}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {

}
