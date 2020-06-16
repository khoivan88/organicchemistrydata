// (function () {
//   console.log('Invoke the static site template JavaScript!')
// })()

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

document.addEventListener('DOMContentLoaded', function () {
  // console.log('main.js working!')
  // adjustFooterPosition()
})
