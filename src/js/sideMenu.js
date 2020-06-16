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
  document.querySelectorAll('.nav-collapse a').forEach(function (link) {
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

$(document).ready(function () {
  // console.log('Side Menu JS working!')  // !DEBUG

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
