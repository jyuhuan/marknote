const $ = require("jquery")
const marked = require('marked')
const hljs = require('highlight.js')
const {ipcRenderer} = require('electron')
const {remote} = require('electron')

hljs.initHighlightingOnLoad();

$(() => {

  let thisNote = {
    id: 0,
    title: "",
    body: "",
    dateCreate: 0,
    dateDue: 0,
    notDone: 0
  }

  const noteEditorCss = {
    visible: {
      'flex-grow': 200,
      'display': 'flex'
    },
    hidden: {
      display: 'none'
    }
  }

  const notePreviewerCss = {
    visible: {
      'padding': '0 20px 10px 20px',
      'flex-grow': 200,
      'display': 'flex',
      'flex-direction': 'column'
    },
    hidden: {
      display: 'none'
    }
  }

  const editButtonCss = {
    editing: {
      'color': '#F44336'
    },
    previewing: {
      'color': 'inherit'
    }
  }

  $('#note-editor').css(noteEditorCss.hidden)
  $('#note-previewer').css(notePreviewerCss.visible)

  let isInEditMode = false

  function setEditorContent(str) {
    $('#note-editor > #textarea').val(str)
  }

  function setPreviewContent(html) {
    $('#note-previewer').html(html)
    MathJax.Hub.Typeset()
    hljs.initHighlighting.called = false
    hljs.initHighlighting()
  }

  function doRendering() {
    const mdCode = $('#textarea').val()
    const html = marked(mdCode)
    setPreviewContent(html)
  }  

  /**
   * Toggling between edit mode and preview mode
   */
  function toggleEditPreview() {
    if (isInEditMode) {
      // Switch to preview
      $('#note-editor').css(noteEditorCss.hidden)
      $('#note-previewer').css(notePreviewerCss.visible)
      $('#btn-edit').css(editButtonCss.previewing)
      isInEditMode = false

      thisNote.body = $('#textarea').val()

      // Render Markdown
      doRendering()

      // Update note
      requestNoteUpdate()
    }
    else {
      // Switch to edit
      $('#note-editor').css(noteEditorCss.visible)
      $('#note-previewer').css(notePreviewerCss.hidden)
      $('#btn-edit').css(editButtonCss.editing)
      isInEditMode = true
    }
  }

  $('#btn-edit').on('click', function () {
    toggleEditPreview()
  })

  ipcRenderer.on('note-content', (evt, {note, isNew}) => {
    setEditorContent(note.body)
    thisNote = note;
    if (isNew) {
      toggleEditPreview()
      document.getElementById('textarea').focus()
    }
    else doRendering()
  })



  // Handle note update
  function requestNoteUpdate() {
    ipcRenderer.send('note-action:save', thisNote)
  }

  // Handle note creation
  $('#btn-add').on('click', requestNewNoteWindow)
  function requestNewNoteWindow() {
    ipcRenderer.send('note-action:create', {})
  }


  // Handle note deletion
  $('#btn-delete').on('click', requestNoteDeletion)
  function requestNoteDeletion() {
    ipcRenderer.send('note-action:delete', thisNote.id)
    ipcRenderer.on('note-action-result:delete', (e, arg) => {
      if (arg === 'success') {
        remote.getCurrentWindow().close();
      }
    })
  }


  // Handle note position/size update
  function requestPositionSizeUpdate() {
    const w = remote.getCurrentWindow()
    ipcRenderer.send('note-action:size-position-update', {
      id: thisNote.id,
      x: w.getPosition()[0],
      y: w.getPosition()[1],
      width: w.getSize()[0],
      height: w.getSize()[1]
    })
  }
  
  remote.getCurrentWindow().on('close', function() {
    
  });




})


