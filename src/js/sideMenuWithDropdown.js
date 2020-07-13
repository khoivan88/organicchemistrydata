/**
 * It downloads HTML as text and then feeds it to the innerHTML of your container element.
 * Ref: https://stackoverflow.com/a/52349344/6596203
 * @param {String} url - address for the HTML to fetch
 * @return {String} the resulting HTML string fragment
*/
async function fetchHtmlAsText (url) {
  // const response = await fetch(url)
  const res = await fetch(url)
    .then(function (response) {
      if (response.ok) {
        return response
        // return response.text()
      } else {
        return Promise.reject(response)
        // throw Error(`Request rejected with status ${res.status}`);
      }
    })
    // .catch(function (error) {
    //   console.warn(`${error}. Could not find a page from ${url}`)
    // })
  return await res.text()
}

async function loadPage (url, targetElem) {
  let contentDiv = document.querySelector(targetElem)

  var content = await fetchHtmlAsText(url)
  contentDiv.innerHTML = content

  if (targetElem === '.index-content') {
    loadContent()
  }
}

/**
 * Load the correct index page for each button click
 */
// function loadSideIndex () {
//   document.querySelectorAll('.syntheses-navbar a').forEach(function (link) {
//     link.onclick = function () {
//       // link.classList.toggle('active')
//       let url = ''
//       if (!link.dataset.groupedby) {
//         // Handle link without 'groupedby' dataset, just load using the href
//         window.location.href = link.href
//       } else {
//         url = 'groupby/' + link.dataset.groupedby
//         // console.log(url)  // !DEBUG
//         loadPage(url, '.index-content')
//       }

//       openSideBarIfClosed()
//     }
//   })
// }

/**
 * Force sidebar visible on all screen sizes when a index menu is clicked
 */
// function openSideBarIfClosed () {
//   // console.log('openSideBarIfClosed function is working!') // !DEBUG
//   let marginLeft = parseInt($('#sidebar').css('marginLeft').replace('px', ''))
//   // console.log(marginLeft)  // !DEBUG
//   if (marginLeft < 0) {
//     // When the side menu is hiding
//     // console.log('margin-left < 0')  // !DEBUG
//     $('#sidebar, #content').toggleClass('active')

//     window.checkForChanges()
//   }
// }

/**
 * Use URL to find correct data path
 */
function getDataPath () {
  // Get the last segment of the URL, for example:
  // 'https://organicchemistrydata.org/hansreich/resources/syntheses/' -> 'syntheses'
  // 'https://organicchemistrydata.org/hansreich/resources/syntheses/#abscisic-acid-constantino' -> 'syntheses'
  let segment = new URL(window.location.href).pathname.split('/').filter(Boolean).pop();
  return `${segment}_data/`
}

async function loadContent () {
  // console.log('something1') // !DEBUG
  document.querySelectorAll('.index-content a').forEach(function (link) {
  // $('.index-content a').on('click', function (link) {
    link.onclick = function () {
      // console.log('something2') // !DEBUG
      // link.classList.toggle('active')
      // let url = link.dataset.url
      let url = getDataPath() + link.href.split('#')[1]
      // console.log(url) // !DEBUG
      loadPage(url, '#content .full-list')

      window.closeNavOnSmallScreen()
    }
  })
}

/**
 * To load the exact side Index if users provides a link with hash (e.g. "http://example.com/#index")
 * Ref: https://webdesign.tutsplus.com/tutorials/how-to-add-deep-linking-to-the-bootstrap-4-tabs-component--cms-31180
 */
function deepLink () {
  let url = window.location.href.replace(/\/$/, '')
  // console.log(`deepLink url: ${url}`) // !DEBUG

  if (window.location.hash) {
    const hash = url.split('#')
    // console.log(`deepLink hash: ${hash}`) // !DEBUG

    let contentUrl = getDataPath() + hash[1]
    loadPage(contentUrl, '#content .full-list')

    // Check the hash for 'groupby' indices first;
    // if not found, load default indexed by 'names' and then try to load the total synthesis page
    // loadPage(`groupby/${hash[1]}`, '.index-content')
    // // .then(function (response) {
    // //   console.log(response)
    // //   if (response.ok) {
    //   //   } else {
    //   //     return Promise.reject(response);
    //   //   }
    //   // })
    //   .catch(function (error) {
    //     console.warn(`${error}: indexed by '${hash[1]}'`) // !DEBUG
    //     loadPage('groupby/names', '.index-content')
    //     loadPage(`syntheses_data/${hash[1]}`, '#content .full-list')
    //   })

    // Reload page and create new url (optional)
    // url = window.location.href.replace(/\/#/, "#");
    // window.history.replaceState(null, null, url)

    // // Optionally, force the page scroll to start from the top of the page.
    // setTimeout(() => {
    //   // console.log('scroll from top') // !DEBUG
    //   $(window).scrollTop(0)
    // }, 100)
  }

  // $('.index-content a').on("click", function() {
  //   let newUrl;
  //   const hash = $(this).attr("href");
  //   if(hash == "#home") {
  //     newUrl = url.split("#")[0];
  //   } else {
  //     newUrl = url.split("#")[0] + hash;
  //   }
  //   newUrl += "/";
  //   history.replaceState(null, null, newUrl);
  // });
}

/**
 * Load index page upon a select option is chosen
 * Ref: https://webdesign.tutsplus.com/tutorials/dropdown-navigation-how-to-maintain-the-selected-option-on-page-load--cms-32210
 */
function indexRedirect () {
  // console.log('indexRedirect JS working!') // !DEBUG

  const select = document.querySelector('.index')
  // const options = document.querySelectorAll('.index option')

  // Retrieve the page url related to the selected option and force a redirection to this page.
  select.addEventListener('change', function () {
    const url = this.options[this.selectedIndex].dataset.url
    if (url) {
      // window.location.href = url
      loadPage(url, '.index-content')

      // Update scroll bar then Scroll to top, used with malihu scrollbar: http://manos.malihu.gr/jquery-custom-content-scroller/#methods-section-scrollTo
      $('#sidebar').mCustomScrollbar('update')
      $('#sidebar').mCustomScrollbar('scrollTo', 'top', { timeout: 400 })
    }
  })

  // // Iterate through all options, grab their data-url attribute value, and check to see whether this value is part of the page url or not. If it is, we mark the related option as selected and jump out of the loop.
  // for (const option of options) {
  //   const url = option.dataset.url
  //   if (window.location.href.includes(url)) {
  //     option.setAttribute('selected', '')
  //     break
  //   }
  // }
}

$(document).ready(function () {
  // console.log('sideMenuWithDropdown JS working!') // !DEBUG

  // If user provides a url with hash (e.g. 'example.com/#something') then try to load the correct page
  if (window.location.hash) {
    deepLink()
  }

  indexRedirect()

  loadContent()
})
