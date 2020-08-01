window.loadFirstLink = loadFirstLink

/**
 * It downloads HTML as text and then feeds it to the innerHTML of your container element.
 * Ref: https://stackoverflow.com/a/52349344/6596203
 * @param {String} url - address for the HTML to fetch
 * @return {String} the resulting HTML string fragment
*/
function fetchHtmlAsText (url) {
  // let response = await fetch(url)

  // if (response.ok) { // if HTTP-status is 200-299
  //   // get the response body (the method explained below)
  //   return response.text()
  // } else {
  //   console.warn(`Could not find a page from ${url}`)
  //   return Promise.reject(response)
  // }

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(function (response) {
        if (response.ok) { // if HTTP-status is 200-299
          // get the response body (the method explained below)
          return resolve(response.text())
        } else {
          console.warn(`Could not find a page from ${url}`)
          return reject(response)
        }
      })
  })
}

async function loadPage (url, targetElem) {
  try {
    let contentDiv = document.querySelector(targetElem)

    let content = await fetchHtmlAsText(url)
    contentDiv.innerHTML = content

    if (targetElem === '.index-content') {
      loadContent()
    }

    var pageDataRe = /id=['"]pageData['"]/
    return pageDataRe.test(content)
  } catch (error) {
    console.warn(error)  // ! DEBUG
    setTimeout(window.location.reload.bind(window.location), 1)
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

/**
 * To check if an element is existed
 * @param {String} selector : the CSS selector string
 * ! Be careful with CSS selector for element with attr starting with number
 * See this: https://drafts.csswg.org/cssom/#the-css.escape()-method
 */
function elementExisted (selector) {
  let el = document.querySelector(selector)
  return (typeof (el) !== 'undefined' && el != null)
}

function loadContent () {
  // console.log('"loadContent()" working') // !DEBUG
  document.querySelectorAll('.index-content a').forEach(function (link) {
  // $('.index-content a').on('click', function (link) {
    link.onclick = function (e) {
      if (!elementExisted('#content .full-list #pageData')) {
        e.preventDefault()
        console.log('sidemenu link clicked!'); // !DEBUG
        // link.classList.toggle('active')

        // Split the href value into page and sections
        [currentPath, page, section, ...rest] = link.href.split('#')

        let url = getDataPath() + page
        // console.log(url) // !DEBUG
        loadPage(url, '#content .full-list')
          .then(function () {
            // Reload page and create new url (optional)
            // url = window.location.href.replace(/\/#/, "#");
            window.history.pushState(null, null, link.href)

            // Scroll to top of the new content page
            setTimeout(window.topFunction, 100)

            // Scroll to section if exists
            if (section) {
              // Have to use `CSS.escape()` for element with ID starts with number, ref: https://drafts.csswg.org/cssom/#the-css.escape()-method
              window.elementReady('#' + CSS.escape(section))
                .then(function (el) {
                  console.log(`Should be running because element with id ${section} exists`) // !DEBUG
                  setTimeout(function () {
                    el.scrollIntoView({ behavior: 'smooth' })
                  }, 500)
                })
            }
          })
          .catch(function (error) {
            console.warn(error)  // !DEBUG
            setTimeout(function () {
              // console.log(link.href)  // !DEBUG
              window.location.href = link.href
            }, 1)
          })
      }

      window.closeNavOnSmallScreen()

      // For pages with image to display over text (such as those in NMR section)
      setTimeout(activateTooltip, 1000)
    }
  })
}

/**
 * For links on side menu that include specific section
 */
// function scrollToSection (sectionId) {
//   // console.log(`section is : ${sectionId}`) // !DEBUG
//   // window.location.hash = sectionId
//   document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' })
// }

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
  console.log('"deepLink()" working!')
  let url = window.location.href.replace(/\/$/, '')
  // console.log(`deepLink url: ${url}`) // !DEBUG

  if (window.location.hash) {
    const hash = url.split('#')
    // console.log(`deepLink hash: ${hash}`) // !DEBUG

    let contentUrl = getDataPath() + hash[1]
    // console.log(`contentUrl: ${contentUrl}`) // !DEBUG

    loadPage(contentUrl, '#content .full-list')
      .then(function () {
        if (hash[2]) {
          // Have to use `CSS.escape()` for element with ID starts with number, ref: https://drafts.csswg.org/cssom/#the-css.escape()-method
          window.elementReady('#' + CSS.escape(hash[2]))
            .then(function (el) {
              console.log(`Should be running because element with id ${hash[2]} exists`) // !DEBUG
              setTimeout(function () {
                el.scrollIntoView({ behavior: 'smooth' })
              }, 500)
            })
        } else {
          // Scroll to top of the new content page
          setTimeout(window.topFunction, 100)
        }
        // Wait longer before activating tooltip on direct load
        setTimeout(activateTooltip, 300)
      })

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
  // console.log('indexRedirect() JS working!') // !DEBUG

  const select = document.querySelector('.index')
  // const options = document.querySelectorAll('.index option')

  // Retrieve the page url related to the selected option and force a redirection to this page.
  select.addEventListener('change', function () {
    let url = this.options[this.selectedIndex].dataset.url
    if (url) {
      loadPage(url, '.index-content')
        .then(function (hasPageData) {
          console.log('indexRedirect() loadPage first ".then()" call') //! DEBUG
          $('#sidebar').mCustomScrollbar('update')
          $('#sidebar').mCustomScrollbar('scrollTo', 'top', {
            timeout: 500,
            scrollEasing: 'linear'
          })

          if (hasPageData) {
            injectContent()
          } else {
            // Load first link as default:
            setTimeout(loadFirstLink, 500)
          }
        })
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
  console.log('"loadFirstLink()" working!') // !DEBUG
  window.elementReady('.index-content a:first-of-type')
    .then(function (firstATag) {
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
  console.log('"injectContent()" ran!') // !DEBUG
  let mainContent = document.querySelector('#content .full-list')
  mainContent.innerHTML = ''
  mainContent.appendChild(document.getElementById('pageData'))
  window.scrollTo(0, 0)
}

/**
 * Use as direct link to change dropdown select option
 * @param {element} e pass in the data itself
 * Refs:
 * https://stackoverflow.com/a/2856602/6596203;
 * https://stackoverflow.com/a/10911718/6596203
 */
function changeIndex (e) {
  console.log('changeIndex() runs') // !DEBUG
  // console.log(e.dataset.value)
  document.querySelector('select.index').value = e.dataset.value
  // firing the event properly according to StackOverflow
  // http://stackoverflow.com/questions/2856513/how-can-i-trigger-an-onchange-event-manually
  if ('createEvent' in document) {
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent('change', false, true)
    document.querySelector('select.index').dispatchEvent(evt)
  } else {
    document.querySelector('select.index').fireEvent('onchange')
  }
}

// When back arrow is clicked, show previous section
window.onpopstate = function () {
  console.log('"onpopstate" event!') // ! DEBUG

  // ! The popstate event is fired when the active history entry changes, this includes clicking
  // on a 'href' tag, see: https://stackoverflow.com/questions/26147580/window-onpopstate-its-activated-with-all-href-links#:~:text=The%20reason%20window.,are%20doing%20a%20browser%20action.
  // Because we are calling `deepLink()` on this event, accidentally, we don't need 'onclick="setTimeout(deepLink, 10)"'
  // on internal links in 'nmr_data' folder anymore.
  deepLink()
}

$(document).ready(function () {
  // console.log('sideMenuWithDropdown JS working!') // !DEBUG

  if (document.querySelector('.index')) {
    indexRedirect()
  }

  loadContent()

  // If user provides a url with hash (e.g. 'example.com/#something') then try to load the correct page
  // ! IMPORTANT that this is after `indexRedirect()` or window will reload the first link
  deepLink()

  if (document.querySelector('#scrollToLinkForm')) {
    scrollToLink()
  }
})
