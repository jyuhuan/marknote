const electron  = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const {ipcMain} = require('electron')

console.log(__dirname)
console.log(__filename)

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {


  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}



/**
 * A mapping from noteId to {note, noteWindow}
 */
const noteWindows = new Map();

function createNoteWindow({note, isNew}) {
  const noteWindow = new BrowserWindow({
    width: 400,
    height: 300,
    titleBarStyle: 'hidden'
  })

  noteWindows.set(note.id, {
    note: note,
    noteWindow: noteWindow
  })

  //noteWindow.webContents.openDevTools()
  noteWindow.loadURL('file://' + __dirname + "/views/note/note.html")
  noteWindow.webContents.on('did-finish-load', () => {
    noteWindow.webContents.send('note-content', {note: note, isNew: isNew})
  })
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  const {Library, Note} = require('./Library')

  const lib = new Library('./db.sqlite')

  lib.getUndoneNotes().then((notes) => {
    notes.forEach(note => {
      // Show the note
      createNoteWindow({note: note, isNew: false})
    })
  })

  ipcMain.on('note-action:save', (e, note) => {
    lib.updateNote({
      id: note.id,
      title: note.title,
      body: note.body,
      dateDue: note.dateDue
    })
  })

  ipcMain.on('note-action:create', (e, arg) => {
    const n = {
      title: "",
      body: "",
      dateCreated: 0,
      dateDue: 0
    }
    lib.addNote(n).then((newId) => {
      n.id = newId
      createNoteWindow({note: n, isNew: true})
    })
  })

  ipcMain.on('note-action:delete', (e, id) => {
    lib.deleteNote(id).then(() => {
      e.sender.send('note-action-result:delete', 'success')
    })
  })


  ipcMain.on('note-action:size-position-update', (e, arg) => {
    lib.updateNoteGui(arg)
  })

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.




