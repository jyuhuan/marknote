'use strict'

const sqlite3 = require('sqlite3').verbose()

module.exports.Library = class Library {
  
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath)
  }

  addNote({title, body, dateCreated, dateDue}) {
    let dateDueFormatted = 'null'
    if (dateDue) dateDueFormatted = dateDue

    const stmt = `insert into notes(title, body, date_created, date_due, not_done) values("${title}", "${body}", "${dateCreated}", "${dateDueFormatted}", 1)`

    this.db.run(stmt, function (err) {
      console.log(this.lastID)
    })
  }

  test() {
    this.db.each("select * from notes", (err, row) => {
      console.log(row)
    })
  }
}


