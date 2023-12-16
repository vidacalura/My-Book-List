package models

import "database/sql"

type Log struct {
	LogID     int    `json:"logId"`
	ReqType   string `json:"reqType"`
	ApiPath   string `json:"apiPath"`
	ResStatus int    `json:"resStatus"`
	SessionID []byte `json:"sessionID"`
}

// Registers a log on the database.
func (l Log) RegisterLog(db *sql.DB) error {

	return nil
}
