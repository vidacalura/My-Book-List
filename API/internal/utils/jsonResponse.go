// This file is responsible for implementing the logic using in all JSON
// responses from the API.
package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

type JsonRes map[string]interface{}

// JsonResponseWrite takes a map and a status code and transforms it into JSON
// to send it to the client through a http.ResponseWriter.
func JsonResponseWrite(w http.ResponseWriter, statusCode int,
	response JsonRes) {

	jsonData, err := json.Marshal(response)
	if err != nil {
		log.Println(err)
		jsonData, _ = json.Marshal(map[string]string{
			"error": "Error sending JSON response to client.",
		})
	}

	w.Header().Set("Content-type", "Application/JSON")
	w.WriteHeader(statusCode)
	w.Write(jsonData)
}
