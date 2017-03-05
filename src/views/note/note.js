const $ = require("jquery")
const marked = require('marked')
const hljs = require('highlight.js')

hljs.initHighlightingOnLoad();

$(() => {

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
      'padding': '20px',
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
      'color': 'gray'
    },
    previewing: {
      'color': 'black'
    }
  }

  $('#note-editor').css(noteEditorCss.hidden)
  $('#note-previewer').css(notePreviewerCss.visible)

  let isInEditMode = false

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

      // Render Markdown
      const mdCode = $('#textarea').val()
      const html = marked(mdCode)
      console.log(html);

      $('#note-previewer').html(html)
      MathJax.Hub.Typeset()

      hljs.initHighlighting.called = false;
      hljs.initHighlighting();

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


})


