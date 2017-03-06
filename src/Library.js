'use strict'

const sqlite3 = require('sqlite3').verbose()

module.exports.Library = class Library {
  
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath)
  }


  /**
   * Returns a Promise.
   * When success, the id of the new note is returned.
   * When failure, the error 
   */
  addNote({title, body, dateCreated, dateDue}) {
    return new Promise((resolve, reject) => {
      let dateDueFormatted = 'null'
      if (dateDue) dateDueFormatted = dateDue

      const stmt = `insert into notes(title, body, date_created, date_due, not_done) values("${title}", "${body}", "${dateCreated}", "${dateDueFormatted}", 1); insert into notesgui(note_id, x, y,height,width) values(last_insert_rowid(), 0,0,100,100)`

      this.db.run(stmt, function (err) {
        if (err) reject(`Database error: ${err}`)
        else resolve(this.lastID)
      })
    })
  }

  /**
   * The note with the given ID should be guaranteed to exist
   */
  updateNote({id, title, body, dateDue}) {
    let dateDueFormatted = 'null'
    if (dateDue) dateDueFormatted = dateDue

    const stmt = `update notes set body="${body}" where notes.id=${id}`
    this.db.run(stmt, function (err) {
      if (err) console.log(`database error: ${err}`)
    })
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      const stmt = `delete from notes where notes.id=${id}`
      this.db.run(stmt, function (err) {
        if (err) reject(`database error: ${err}`)
        else resolve()
      })
    })
  }

  updateNoteGui({id, x, y, width, height}) {
    console.log("resized")
    const stmt = `update notesgui set x=${x}, y=${y}, width=${width}, height=${height} where notesgui.note_id=${id}`
    this.db.run(stmt, function (err) {
      if (err) console.log(`database error: ${err}`)
    })
  }

  getUndoneNotes() {
    return new Promise((resolve, reject) => {
      const stmt = `select * from notes where notes.not_done=1`
      this.db.all(stmt, function (err, rows) {
        if (err) reject(`Database error: ${err}`)
        else resolve(rows)
      })
    })
  }
  

}


