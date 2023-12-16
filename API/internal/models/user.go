package models

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/mail"
)

type User struct {
	UserID    []byte    `json:"userID"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt string    `json:"createdAt"`
	Registers Registers `json:"registers"`
}

// Validates an instance of User.
func (u User) IsValid() (bool, string) {
	if len(u.Username) < 3 || len(u.Username) > 16 {
		return false, "Username must contain between 3 and 16 characters."
	}

	if _, err := mail.ParseAddress(u.Email); err != nil {
		return false, "Email invalid."
	}

	if len(u.Password) < 8 || len(u.Password) > 32 {
		return false, "Password must contain between 8 and 32 characters."
	}

	return true, ""
}

// Returns user info + user book list
func (u *User) GetUserProfile(db *sql.DB, username string) (int, error) {
	selectUser := "SELECT userID, username FROM Users WHERE username = ?;"
	log.Println(username)

	row := db.QueryRow(selectUser, username)
	if err := row.Scan(&u.UserID, &u.Username); err != nil {
		return http.StatusNotFound, fmt.Errorf("User not found")
	}

	statusCode, err := u.Registers.GetUserRegisters(db, u.UserID)
	if err != nil {
		return statusCode, err
	}

	return http.StatusOK, nil
}
