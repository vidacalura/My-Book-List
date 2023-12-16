package application

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type App struct {
	Router http.Handler
	DB     *sql.DB
}

// Initializes an instance of App.
func (a *App) New() error {
	if err := a.ConnectDB(); err != nil {
		return err
	}

	a.Router = a.newRouter()

	return nil
}

// Connects to database.
func (a *App) ConnectDB() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}

	a.DB, err = sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		return err
	}

	return a.DB.Ping()
}

// Runs the App.
func (a *App) Run(ctx context.Context) error {
	server := &http.Server{
		Addr:    os.Getenv("PORT"),
		Handler: a.Router,
	}

	ch := make(chan error, 1)

	defer func() {
		if err := a.DB.Close(); err != nil {
			fmt.Println("Error closing SQL connection: ", err)
		}
	}()

	go func() {
		err := server.ListenAndServe()
		if err != nil {
			ch <- fmt.Errorf("failed to run server: %w", err)
		}
		close(ch)
	}()

	select {
	case <-ch:
		return <-ch
	case <-ctx.Done():
		timeout, cancel := context.WithTimeout(context.Background(), time.Second*10)
		defer cancel()

		return server.Shutdown(timeout)
	}
}
