package models

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"gopkg.in/guregu/null.v3"
)

type Book struct {
	BookID    int        `json:"bookID"`
	CreatedBy []byte     `json:"createdBy"`
	CreatedAt string     `json:"createdAt"`
	AvgScore  null.Float `json:"avgScore"`
	Title     string     `json:"title"`
	Writer    string     `json:"writer"`
	Chapters  int        `json:"chapters"`
	Genre     string     `json:"genre"`
}

type Books []Book

// Validates an instance of Book.
func (b Book) IsValid() (bool, string) {
	if b.BookID < 0 || b.BookID > 99999999 {
		return false, "Invalid book ID."
	}

	if len(b.CreatedBy) == 0 || len(b.CreatedBy) > 16 {
		return false, "ID of user who registered the book must be properly identified."
	}

	if b.AvgScore.Valid && (b.AvgScore.Float64 > 10 || b.AvgScore.Float64 < 0) {
		return false, "Average score can't be inferior to 0 or superior to 10."
	}

	if len(b.Title) == 0 || len(b.Title) > 60 {
		return false, "Book title should have between 1 and 60 characters."
	}

	if len(b.Writer) < 2 || len(b.Writer) > 80 {
		return false, "Writer's name should have between 2 and 80 characters."
	}

	if b.Chapters < 1 || b.Chapters > 999 {
		return false, "Book should contain between 1 and 999 chapters."
	}

	if len(b.Genre) == 0 || len(b.Genre) > 24 {
		return false, "Genre should contain between 1 and 24 characters."
	}

	return true, ""
}

// Returns the 10 most well avaliated books.
func (b *Books) GetFeedBooks(db *sql.DB) (int, error) {
	selectFeed := "SELECT * FROM Books ORDER BY average_score LIMIT 10;"

	rows, err := db.Query(selectFeed)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("Failed to retrieve lastest feed.")
	}

	defer rows.Close()

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.BookID, &book.CreatedBy, &book.CreatedAt,
			&book.AvgScore, &book.Title, &book.Writer, &book.Chapters,
			&book.Genre)
		if err != nil {
			log.Println(err)
			return http.StatusInternalServerError,
				fmt.Errorf("Failed to retrieve latest feed.")
		}

		*b = append(*b, book)
	}

	return http.StatusOK, nil
}

// Returns a book based on it's ID.
func (b *Book) FindByID(db *sql.DB, id string) (int, error) {
	row := db.QueryRow("SELECT * FROM Books WHERE bookID = ?;", id)
	err := row.Scan(&b.BookID, &b.CreatedBy, &b.CreatedAt, &b.AvgScore,
		&b.Title, &b.Writer, &b.Chapters, &b.Genre)
	if err != nil {
		return http.StatusNotFound,
			fmt.Errorf("Book not found.")
	}

	return http.StatusOK, nil
}

// Returns books based on part of or it's full title.
func (b *Books) FindByTitle(db *sql.DB, title string) (int, error) {
	selectBooks := `
		SELECT * FROM Books WHERE title LIKE ?
		ORDER BY average_score LIMIT 50;`

	rows, err := db.Query(selectBooks, "%"+title+"%")
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("Failed to retrieve books from database.")
	}

	defer rows.Close()

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.BookID, &book.CreatedBy, &book.CreatedAt,
			&book.AvgScore, &book.Title, &book.Writer, &book.Chapters,
			&book.Genre)
		if err != nil {
			log.Println(err)
			return http.StatusInternalServerError,
				fmt.Errorf("Failed to retrieve books from database.")
		}

		*b = append(*b, book)
	}

	return http.StatusOK, nil
}

// Returns the top 50 books of a given genre.
func (b *Books) FindByGenre(db *sql.DB, genre string) (int, error) {
	selectBooks := `
		SELECT * FROM Books WHERE genre = ? ORDER BY average_score LIMIT 50;`

	rows, err := db.Query(selectBooks, genre)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("Failed to retrieve books from database.")
	}

	defer rows.Close()

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.BookID, &book.CreatedBy, &book.CreatedAt,
			&book.AvgScore, &book.Title, &book.Writer, &book.Chapters,
			&book.Genre)
		if err != nil {
			log.Println(err)
			return http.StatusInternalServerError,
				fmt.Errorf("Failed to retrieve books from database.")
		}

		*b = append(*b, book)
	}

	return http.StatusOK, nil
}

// Registers a new book on the system.
func (b Book) CreateBook(db *sql.DB) (int, error) {
	insert :=
		`INSERT INTO Books (created_by, created_at, average_score, title, writer,
		chapters, genre) VALUES(?, ?, 0, ?, ?, ?, ?);`

	now := time.Now().Format("2006-01-02 15:04:05")

	_, err := db.Exec(insert, b.CreatedBy, now, b.Title, b.Writer, b.Chapters,
		b.Genre)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("%s %s",
				"Failed to register new book. Inform the problem to a",
				"maintainer of the project or create an issue on our github.")
	}

	return http.StatusCreated, nil
}

// Updates a registered book on the system.
func (b Book) UpdateBook(db *sql.DB) (int, error) {
	update := `
		UPDATE Books SET title = ?, writer = ?, chapters = ?, genre = ?
		WHERE bookID = ?;`

	_, err := db.Exec(update, b.Title, b.Writer, b.Chapters, b.Genre, b.BookID)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("%s %s",
				"Failed to update book's info. Inform the problem to a",
				"maintainer of the project or create an issue on our github.")
	}

	return http.StatusOK, nil
}

// Deletes a book from the system.
func (b Book) DeleteBook(db *sql.DB) (int, error) {
	deleteBook := "DELETE FROM Books WHERE bookID = ?;"

	_, err := db.Exec(deleteBook, b.BookID)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError,
			fmt.Errorf("%s %s",
				"Failed to delete book. Inform the problem to a",
				"maintainer of the project or create an issue on github.")
	}

	return http.StatusOK, nil
}

func (b Book) UpdateBookAverageScore(db *sql.DB, id int) (int, error) {
	update := `
		UPDATE Books SET average_score = (
		SELECT AVG(score) FROM Registers WHERE bookID = ?)
		WHERE bookID = ?;`

	_, err := db.Exec(update, id)
	if err != nil {
		return http.StatusInternalServerError,
			fmt.Errorf("Failed to update book's average score.")
	}

	return http.StatusOK, nil
}

// Returns if a book exists or not.
func (b Book) BookExists(db *sql.DB, id int) bool {
	row := db.QueryRow("SELECT title FROM Books WHERE bookID = ?;", id)

	var title string
	if err := row.Scan(&title); err != nil {
		return false
	}

	return true
}
