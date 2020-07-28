window.topFunction = topFunction
window.elementReady = elementReady

var mybutton = document.getElementById('toTopButton')

function scrollFunction () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = 'block'
  } else {
    mybutton.style.display = 'none'
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction () {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

// // Vanilla JS to toggle sidebar when the toggle button is clicked
// function toggleSideBar () {
//   const sidebar = document.querySelector('#sidebar')
//   const mainContent = document.querySelector('#content')
//   document.querySelector('#sidebarCollapse').onclick = function () {
//     sidebar.classList.toggle('active')
//     mainContent.classList.toggle('active')
//   }
// }

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() }

// // Get the current domain name and url suffix and modify the data-url for share to social media buttons
// function getCurrentUrl () {
//   var protocol = location.protocol
//   var slashes = protocol.concat('//')
//   var host = slashes.concat(window.location.hostname)
//   const addthisDataDiv = document.querySelector('.addthis_sharing_toolbox')
//   let url = addthisDataDiv.dataset.url
//   addthisDataDiv.dataset.url = `${host}${url}`
//   // console.log(url);
// }

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param selector
 * @returns {Promise}
 *
 * MIT Licensed
 * Author: jwilson8767
 * Ref: https://stackoverflow.com/a/61747276/6596203
 */
function elementReady (selector) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector)
    if (el) { resolve(el) }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element)
        // Once we have resolved we don't need the observer anymore.
        observer.disconnect()
      })
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      })
  })
}

// ------------------------------------------------------- //
// Multi Level dropdowns
// ------------------------------------------------------ //
// $("ul.dropdown-menu [data-toggle='dropdown']").on('click', function (event) {
$("ul.dropdown-menu [data-toggle='dropdown']").on('click', function (event) {
  event.preventDefault()
  event.stopPropagation()

  $(this).siblings().toggleClass('show')

  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass('show')
  }
  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
    $('.dropdown-submenu .show').removeClass('show')
  })
})

document.addEventListener('DOMContentLoaded', function () {
  // console.log('main.js working!')
  // adjustFooterPosition()
})
