// This file deals with all authentication related business logic.
package handler

import (
	"database/sql"
	"net/http"
)

type AuthHandler struct {
	DB *sql.DB
}

// Validates user data for login.
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {

}

// Logs out an user.
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {

}
