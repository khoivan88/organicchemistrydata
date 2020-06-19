// Use the correct icon on the toggle button
// Ref: https://stackoverflow.com/questions/19142762/changing-an-icon-inside-a-toggle-button
function checkForChanges () {
  setTimeout(function () {
    let marginLeft = parseInt($('#sidebar').css('marginLeft').replace('px', ''))
    // console.log(marginLeft)  // !DEBUG
    if (marginLeft < 0) {
      // When the side menu is hiding
      // console.log('margin-left < 0')  // !DEBUG
      $('#sidebarCollapse').children().addClass('fa-angle-double-right').removeClass('fa-angle-double-left')
    } else {
      // When the side menu is being displayed
      // console.log('margin-left >= 0')  // !DEBUG
      $('#sidebarCollapse').children().addClass('fa-angle-double-left').removeClass('fa-angle-double-right')
    }
  }, 300)
}

// Close the side menu on small screen (when the side menu display full width) after a link is click
function closeNavOnSmallScreen () {
  document.querySelectorAll('#sidebar a').forEach(function (link) {
    link.onclick = function () {
      let width = document.querySelector('#sidebar').offsetWidth + 50
      // console.log(width)
      if (width >= window.innerWidth) {
        document.querySelector('#sidebar').classList.toggle('active')
      }

      // Check if the side menu is displayed
      // then display the correct icon on the toggle button
      checkForChanges()
    }
  })
}

// Put footer section at the end of pages with toggle side menu
function adjustFooterPosition () {
  let footer = document.querySelector('footer')
  let fullList = document.querySelector('.full-list')
  let references = document.querySelector('#references')
  if (fullList || references) {
    document.querySelector('#content').append(footer)
  }
}

/**
 * Add bootstrap scrollspy
 * Ref: https://getbootstrap.com/docs/4.5/components/scrollspy/#via-javascript
*/
function addScrollSpy () {
  // Activate Bootstrap scrollspy (methods using HTML and CSS only does not work)
  $('body').scrollspy({
    target: '#navbar-left', // The element with link that will be highlighted
    offset: 170 // Offset from top due to headers
  })

  // Trying to bring the a tag in the side menu into view
  // Original example from Bootstrap 4 does not work, this is from: https://stackoverflow.com/a/48694139/6596203
  $(window).on('activate.bs.scrollspy', function (e, obj) {
    // console.log(obj);  // !DEBUG
    // Scroll the first active a tag into view if needed
    $(`#navbar-left .nav-item a[href="${obj.relatedTarget}"]`)[0].scrollIntoViewIfNeeded()
  })
}

$(document).ready(function () {
  // console.log('Side Menu JS working!')  // !DEBUG

  // Add bootstrap scrollspy
  // Ref: https://getbootstrap.com/docs/4.5/components/scrollspy/#via-javascript
  $('body').scrollspy({ target: '#navbar-left', offset: 170 })

  // Trying to bring the a tag in the side menu into view
  // Original example from Bootstrap 4 does not work, this is from: https://stackoverflow.com/a/48694139/6596203
  $(window).on('activate.bs.scrollspy', function (e, obj) {
    // console.log(obj);  // !DEBUG
    // Scroll the first active a tag into view if needed
    $(`#navbar-left .nav-item a[href="${obj.relatedTarget}"]`)[0].scrollIntoViewIfNeeded()
  })

  adjustFooterPosition()

  // Check if the side menu is displayed
  // then display the correct icon on the toggle button
  checkForChanges()

  // Close the side menu on small screen (when the side menu display full width) after a link is click
  closeNavOnSmallScreen()

  // In the event of window resize, check if the side menu is displayed
  // then display the correct icon on the toggle button
  // Ref: https://stackoverflow.com/a/60204716/6596203
  var resizeId
  $(window).resize(function () {
    clearTimeout(resizeId)
    resizeId = setTimeout(checkForChanges, 300)
  })

  // Use minimal scroll bar theme
  $('#sidebar').mCustomScrollbar({
    theme: 'minimal-dark' // http://manos.malihu.gr/repository/custom-scrollbar/demo/examples/scrollbar_themes_demo.html
  })

  $('#sidebarCollapse').on('click', function () {
    $('#sidebar, #content').toggleClass('active')
    checkForChanges()
  })
})
