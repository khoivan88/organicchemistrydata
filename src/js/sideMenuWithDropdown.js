window.loadFirstLink = loadFirstLink

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
 * Use URL to find correct data path
 */
function getDataPath () {
  // Get the last segment of the URL, for example:
  // 'https://organicchemistrydata.org/hansreich/resources/syntheses/' -> 'syntheses'
  // 'https://organicchemistrydata.org/hansreich/resources/syntheses/#abscisic-acid-constantino' -> 'syntheses'
  let segment = new URL(window.location.href).pathname.split('/').filter(Boolean).pop()
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

      // Split the href value into page and sections
      [currentPath, page, section, ...rest] = link.href.split('#')

      let url = getDataPath() + page
      // console.log(url) // !DEBUG
      loadPage(url, '#content .full-list')

      // Scroll to top of the new content page
      setTimeout(window.topFunction, 100)

      if (section) {
        setTimeout(function () {
          scrollToSection(section)
        }, 700)
      }

      // Scroll to section if exists
      window.closeNavOnSmallScreen()

      // For pages with image to display over text (such as those in NMR section)
      // run the display image function after setTimeout
      // setTimeout(window.displayImage, 1000)
      setTimeout(activateTooltip, 1000)
    }
  })
}

/**
 * For links on side menu that include specific section
 */
function scrollToSection (sectionId) {
  // console.log(`section is : ${sectionId}`) // !DEBUG
  // window.location.hash = sectionId
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' })
}

/**
 * Activate Bootstrap 4 tooltip with html true
 */
function activateTooltip () {
  // $('[data-toggle="tooltip"]').tooltip({ html: true })
  $('[data-toggle="tooltip"]').tooltip('dispose').tooltip({
    boundary: 'window', // to resolve parent div has overflow auto and scroll
    placement: 'bottom', // placement 'top' makes tooltip flicker
    html: true, // to display image
    template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner border border-dark bg-white"></div></div>' // to make background white and dark border
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

    // Scroll to top of the new content page
    setTimeout(window.topFunction, 100)

    if (hash[2]) {
      console.log(hash[2]) // !DEBUG
      setTimeout(function () {
        scrollToSection(hash[2])
      }, 1000)
    }

    // Wait longer before activating tooltip on direct load
    setTimeout(activateTooltip, 3000)

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

      setTimeout(function () {
        if (document.getElementById('pageData')) {
          injectContent()
        }
      }, 100)

      // Load first link as default:
      setTimeout(loadFirstLink, 300)

      // Update scroll bar then Scroll to top, used with malihu scrollbar: http://manos.malihu.gr/jquery-custom-content-scroller/#methods-section-scrollTo
      $('#sidebar').mCustomScrollbar('update')
      $('#sidebar').mCustomScrollbar('scrollTo', 'top', { timeout: 500 })
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

/**
 * Load the first link as default
 */
function loadFirstLink () {
  window.elementReady('.index-content a:first-of-type').then(function (firstATag) {
    let url = getDataPath() + firstATag.href.split('#')[1]
    loadPage(url, '#content .full-list')
  })
}

/**
 * Add simple search function and scroll to item
 */
function scrollToLink () {
  // console.log('"scrollToLink" working!')  // !DEBUG
  document.querySelector('#scrollToLinkForm').addEventListener('submit', function (e) {
    e.preventDefault()

    // Get the query term
    let query = this.getElementsByTagName('input')[0].value

    // Popover setup, ref: https://getbootstrap.com/docs/4.5/components/popovers/
    let pop = $(this).find('input')
    pop.popover({
      trigger: 'manual',
      title: 'Term not found',
      content: 'Try using single word!',
      placement: 'bottom'
    })

    let aTag = document.querySelector(`a[href*="${query}" i]`) // 'i' is for case INSENSITIVE search, ref: https://stackoverflow.com/a/26721521/6596203
    if (aTag) { // if a tag is found
      pop.popover('hide') // Hide popover

      // Scroll to the first item with offset (in pixel)
      $('#sidebar').mCustomScrollbar('scrollTo', function () {
        return (aTag.offsetTop) - 100
      })

      // Highlight search termm using 'mark.js', ref: https://markjs.io/
      var instance = new Mark(document.querySelector('#sidebar'))
      instance.unmark() // unmark previously searched query
      instance.mark(query)
    } else {
      pop.popover('show')
      // Hide popover after 5 sec
      pop.on('shown.bs.popover', function () {
        setTimeout(function () {
          pop.popover('hide')
        }, 5000)
      })
    }
  })
}

/**
* Put the content of element with '#pageData' into the main content
* This is currently applied to data inside 'Hans Reich' > 'NMR' section
* data such as couplings and chemicals shifts
*/
function injectContent () {
  // console.log('"injectContent()" ran!') // !DEBUG
  // document.querySelector('#content .full-list').appendChild(document.getElementById('pageData'))
  let mainContent = document.querySelector('#content .full-list')
  mainContent.innerHTML = ''
  mainContent.appendChild(document.getElementById('pageData'))
  window.scrollTo(0, 0)
}

$(document).ready(function () {
  // console.log('sideMenuWithDropdown JS working!') // !DEBUG

  // If user provides a url with hash (e.g. 'example.com/#something') then try to load the correct page
  if (window.location.hash) {
    deepLink()
  }

  if (document.querySelector('.index')) {
    indexRedirect()
  }

  loadContent()

  if (document.querySelector('#scrollToLinkForm')) {
    scrollToLink()
  }
})
