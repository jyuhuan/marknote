const {remote} = require('electron')
const {app, Menu} = remote

const appMenu = Menu.buildFromTemplate([
  {
    label: "Marknote",
    submenu: [
      {
        label: 'New Note',
        click: () => { }
      }
    ]
  }
])

Menu.setApplicationMenu(appMenu)