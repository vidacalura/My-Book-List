// This file deals with all the logic of user registers of books and scores.
package handler

import (
	"database/sql"
	"net/http"
)

type RegisterHandler struct {
	DB *sql.DB
}

func (h *RegisterHandler) GetRegisterByID(w http.ResponseWriter, r *http.Request) {

}

func (h *RegisterHandler) CreateRegister(w http.ResponseWriter, r *http.Request) {

}

func (h *RegisterHandler) UpdateRegister(w http.ResponseWriter, r *http.Request) {

}

func (h *RegisterHandler) DeleteRegister(w http.ResponseWriter, r *http.Request) {

}
