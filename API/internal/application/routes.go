package application

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/vidacalura/My-Book-List/internal/handler"
)

func (a *App) newRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"*"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Route("/api/auth", a.loadAuthRoutes)
	r.Route("/api/books", a.loadBooksRoutes)
	r.Route("/api/registers", a.loadRegistersRoutes)
	//r.Route("/api/sessions", a.loadSessionsRoutes) -> Ver JWT
	r.Route("/api/users", a.loadUsersRoutes)

	return r
}

func (a *App) loadAuthRoutes(r chi.Router) {
	authHandler := &handler.AuthHandler{
		DB: a.DB,
	}

	r.Post("/login", authHandler.Login)
	r.Post("/logout", authHandler.Logout)
}

func (a *App) loadBooksRoutes(r chi.Router) {
	bookHandler := &handler.BookHandler{
		DB: a.DB,
	}

	r.Get("/feed", bookHandler.GetTopBooks)
	r.Get("/id/{id}", bookHandler.GetBookByID)
	r.Get("/search/{title}", bookHandler.GetBookByTitle)
	r.Get("/genre/{genre}", bookHandler.GetBookByGenre)
	r.Post("/", bookHandler.CreateBook)
	r.Put("/", bookHandler.UpdateBook)
	r.Delete("/{id}", bookHandler.DeleteBook)
}

func (a *App) loadRegistersRoutes(r chi.Router) {
	regHandler := &handler.RegisterHandler{
		DB: a.DB,
	}

	r.Get("/{id}", regHandler.GetRegisterByID)
	r.Post("/", regHandler.CreateRegister)
	r.Put("/", regHandler.UpdateRegister)
	r.Delete("/{id}", regHandler.DeleteRegister)
}

func (a *App) loadUsersRoutes(r chi.Router) {
	userHandler := &handler.UserHandler{
		DB: a.DB,
	}

	r.Get("/profile/{username}", userHandler.GetUserProfile)
	r.Post("/", userHandler.CreateUser)
	r.Put("/", userHandler.UpdateUser)
	r.Delete("/{username}", userHandler.DeleteUser)
}
