package models

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"gopkg.in/guregu/null.v3"
)

type Register struct {
	RegID        int      `json:"regID"`
	UserID       []byte   `json:"userID"`
	BookID       int      `json:"bookID"`
	Book         Book     `json:"bookInfo"`
	Score        null.Int `json:"score"`
	ChaptersRead int      `json:"chaptersRead"`
	BookState    int      `json:"bookState"`
	RegisteredAt string   `json:"registeredAt"`
}

type Registers []Register

// Validates an instance of Register.
func (r Register) IsValid() (bool, string) {
	if len(r.UserID) != 16 {
		return false, "User ID invalid."
	}

	if r.Score.Valid && (r.Score.Int64 < 1 || r.Score.Int64 > 10) {
		return false, "Score must be within the range of 1 and 10."
	}

	if r.ChaptersRead < 0 || r.ChaptersRead > 999 {
		return false, "Chapters read must be between 0 and 999."
	}

	if r.BookState < 0 || r.BookState > 3 {
		return false, "Invalid book state."
	}

	return true, ""
}

// Returns all the registers of a given user.
func (r *Registers) GetUserRegisters(db *sql.DB, userID []byte) (int, error) {
	selectRegisters := `
		SELECT Registers.*, Books.*
		FROM Registers
		INNER JOIN Books
		ON Registers.bookID = Books.bookID
		WHERE Registers.userID = ?;`

	rows, err := db.Query(selectRegisters, userID)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("Failed to retrieve user's book list.")
	}

	defer rows.Close()

	for rows.Next() {
		var reg Register
		err := rows.Scan(&reg.RegID, &reg.UserID, &reg.BookID, &reg.Score,
			&reg.ChaptersRead, &reg.BookState, &reg.RegisteredAt,
			&reg.Book.BookID, &reg.Book.CreatedBy, &reg.Book.CreatedAt,
			&reg.Book.AvgScore, &reg.Book.Title, &reg.Book.Writer,
			&reg.Book.Chapters, &reg.Book.Genre)
		if err != nil {
			return http.StatusInternalServerError,
				fmt.Errorf("Failed to retrieve user's book list.")
		}

		*r = append(*r, reg)
	}

	if err := rows.Err(); err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("Failed to retrieve user's book list.")
	}

	return http.StatusOK, nil
}

// Returns the info of a register.
func (r *Register) GetRegisterByID(db *sql.DB, id string) (int, error) {
	row := db.QueryRow("SELECT * FROM Registers WHERE regID = ?;", id)
	err := row.Scan(&r.RegID, &r.UserID, &r.BookID, &r.Score, &r.ChaptersRead,
		&r.BookState, &r.RegisteredAt)
	if err != nil {
		return http.StatusNotFound, fmt.Errorf("Resgister not found.")
	}

	return http.StatusOK, nil
}

// Creates a new register.
func (r Register) CreateRegister(db *sql.DB) (int, error) {

	return http.StatusCreated, nil
}

// Updates a register.
func (r Register) UpdateRegister(db *sql.DB) (int, error) {

	return http.StatusOK, nil
}

// Deletes a register.
func (r Register) DeleteRegister(db *sql.DB, id int) (int, error) {

	return http.StatusOK, nil
}
