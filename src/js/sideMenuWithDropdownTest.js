window.loadFirstLink = loadFirstLink

/**
 * It downloads HTML as text and then feeds it to the innerHTML of your container element.
 * Ref: https://stackoverflow.com/a/52349344/6596203
 * @param {String} url - address for the HTML to fetch
 * @return {String} the resulting HTML string fragment
*/
function fetchHtmlAsText (url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(function (response) {
        if (response.ok) { // if HTTP-status is 200-299
          // get the response body (the method explained below)
          resolve(response.text())
        } else {
          console.warn(`Could not find a page from ${url}`)
          reject(response)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

function loadPage (url, targetElem) {
  return new Promise((resolve, reject) => {
    let contentDiv = document.querySelector(targetElem)
    let content = fetchHtmlAsText(url)
    content
      .then(responseText => {
        contentDiv.innerHTML = responseText
        if (targetElem === '.index-content') {
          loadContent()
        }
        var pageDataRe = /id=['"]pageData['"]/
        resolve(pageDataRe.test(responseText))
      })
      .catch(error => {
        // console.error(error) // ! DEBUG
        reject(error)
      })
  })
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
      // Check if the link if PDF and load into '<object></object>' tag if this page has this setting
      let isContinued = loadPdfAndMakeUrl(e, this)

      // For pages WITHOUT element with selector: '#content .full-list #pageData'
      if (isContinued && !elementExisted('#content .full-list #pageData')) {
        e.preventDefault()
        console.log('sidemenu link clicked!') // !DEBUG
        // link.classList.toggle('active')

        // Split the href value into page and sections
        // let [currentPath, page, section, ...rest] = link.href.split('#')
        let linkUrl = new URL(link.href)
        // console.log(`deepLink linkUrl: ${linkUrl}`) // !DEBUG

        // Load the index page using query string
        if (linkUrl.search) {
          var urlParams = new URLSearchParams(linkUrl.search)
          var page = urlParams.get('page')
          var section = page.split('#')[1] || null
          var url = getDataPath() + page
          // console.log(url) // !DEBUG
        }

        // Check if this is a new page or just a different section of the same page
        // if (page != window.location.hash.split('#')[1]) {
        if (linkUrl.search !== window.location.search) {
          loadPage(url, '#content .full-list')
            .then(function () {
              // Reload page and create new url (optional)
              // url = window.location.href.replace(/\/#/, "#");
              window.history.pushState(null, null, link.href)
            })
            .catch(function (error) {
              // console.error(error)  // !DEBUG
              setTimeout(function () {
                // console.log(link.href)  // !DEBUG
                window.location.href = link.href
              }, 1)
            })
        }

        // For display pointer to specific step in syntheses
        if (this.dataset.top && link.dataset.left) {
          let top = parseInt(this.getAttribute('data-top'))
          let left = parseInt(this.getAttribute('data-left'))
          setTimeout(function () {
            window.showPointer(top, left)
          }, 500)
        }

        // Scroll to section if exists
        if (section) {
          // Reload page and create new url (optional)
          window.history.pushState(null, null, link.href)

          // Have to use `CSS.escape()` for element with ID starts with number, ref: https://drafts.csswg.org/cssom/#the-css.escape()-method
          window.elementReady('#' + CSS.escape(section))
            .then(function (el) {
              // console.log(`Should be running because element with id ${section} exists`) // !DEBUG
              setTimeout(function () {
                // let el = document.querySelector('#' + CSS.escape(section))
                el.scrollIntoView({ behavior: 'auto' })
              }, 200)
            })
        } else {
          // Scroll to top of the new content page
          setTimeout(window.topFunction, 100)
        }

        // setTimeout(loadPdfForMainContentLinks, 500)
        // wait for elementready
        window.elementReady('#content .full-list a[href$=".pdf"]')
          .then(function (el) {
            // console.log(`Should be running because following element exists.\n${el} `) // !DEBUG
            setTimeout(loadPdfForMainContentLinks, 300)
          })
      }

      window.closeNavOnSmallScreen()

      // For pages with image to display over text (such as those in NMR section)
      setTimeout(activateTooltip, 1000)
    }
  })
}

/**
 * Activate Bootstrap 4 tooltip with html true
 */
function activateTooltip () {
  // console.log('tooltip activated')  // ! DEBUG
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
async function deepLink () {
  console.log('"deepLink()" working!')
  let currentUrl = new URL(window.location.href)
  // console.log(`deepLink currentUrl: ${currentUrl}`) // !DEBUG

  // Load the index page using query string
  if (currentUrl.search) {
    var urlParams = new URLSearchParams(currentUrl.search)
    let indexPage = urlParams.get('index')
    let [page, section] = urlParams.get('page').split('#')

    if (indexPage) {
      console.log(`deepLink indexPage: ${indexPage}`) // !DEBUG
      // Mark dropdown option in side menu 'selected'
      document.querySelector('select.index').value = indexPage.split('/')[1]

      var hasPageData = await loadPage(indexPage, '.index-content')
      if (hasPageData) {
        injectContent()

        // Scroll to section if exists
        if (currentUrl.hash) {
          // console.log(`Should be running because element with id ${currentUrl.hash} exists`) // !DEBUG
          setTimeout(function () {
            document.querySelector(currentUrl.hash).scrollIntoView()
          }, 300)
        }
      }
    } else if (page) {
      // const hash = currentUrl.hash.split('#')
      // console.log(`deepLink hash: ${hash}`) // !DEBUG
      console.log(`deepLink page: ${page}`) // !DEBUG

      let contentUrl = getDataPath() + page
      // console.log(`contentUrl: ${contentUrl}`) // !DEBUG

      if (page.endsWith('.pdf')) {
        loadPdf(contentUrl, '#content .full-list')

        // Scroll to top of the new content page
        setTimeout(window.topFunction, 100)
      } else {
        loadPage(contentUrl, '#content .full-list')
          .then(function () {
            if (section) {
              // Have to use `CSS.escape()` for element with ID starts with number, ref: https://drafts.csswg.org/cssom/#the-css.escape()-method
              window.elementReady('#' + CSS.escape(section))
                .then(function (el) {
                  // console.log(`Should be running because element with id ${section} exists`) // !DEBUG
                  setTimeout(function () {
                    el.scrollIntoView({ behavior: 'auto' })
                  }, 200)
                })
            } else {
              // Scroll to top of the new content page
              setTimeout(window.topFunction, 100)
            }
          })
      }
    }
  }

  // // Load the content page into main content and scroll to subsection if exists
  // // if (currentUrl.hash && !hasPageData) {
  // if (currentUrl.search && !hasPageData) {
  //   const hash = currentUrl.hash.split('#')
  //   // console.log(`deepLink hash: ${hash}`) // !DEBUG
  //   let page, section = currentUrl.search.get

  //   let contentUrl = getDataPath() + hash[1]
  //   // console.log(`contentUrl: ${contentUrl}`) // !DEBUG

  //   if (hash[1].endsWith('.pdf')) {
  //     loadPdf(contentUrl, '#content .full-list')

  //     // Scroll to top of the new content page
  //     setTimeout(window.topFunction, 100)
  //   } else {
  //     loadPage(contentUrl, '#content .full-list')
  //       .then(function () {
  //         if (hash[2]) {
  //           // Have to use `CSS.escape()` for element with ID starts with number, ref: https://drafts.csswg.org/cssom/#the-css.escape()-method
  //           window.elementReady('#' + CSS.escape(hash[2]))
  //             .then(function (el) {
  //               // console.log(`Should be running because element with id ${hash[2]} exists`) // !DEBUG
  //               setTimeout(function () {
  //                 el.scrollIntoView({ behavior: 'auto' })
  //               }, 200)
  //             })
  //         } else {
  //           // Scroll to top of the new content page
  //           setTimeout(window.topFunction, 100)
  //         }
  //       })
  //   }
  // }

  // Wait longer before activating tooltip on direct load
  setTimeout(activateTooltip, 300)

  // setTimeout(loadPdfForMainContentLinks, 500)
  // wait for elementready
  window.elementReady('#content .full-list a[href$=".pdf"]')
    .then(function (el) {
      // console.log(`Should be running because following element exists.\n${el} `) // !DEBUG
      setTimeout(loadPdfForMainContentLinks, 300)
    })
}

/**
 * Load index page upon a select option is chosen
 * Ref: https://webdesign.tutsplus.com/tutorials/dropdown-navigation-how-to-maintain-the-selected-option-on-page-load--cms-32210
 */
function indexRedirect () {
  // console.log('indexRedirect() JS working!') // !DEBUG

  const select = document.querySelector('.index')

  // Retrieve the page url related to the selected option and force a redirection to this page.
  select.addEventListener('change', function () {
    let url = this.options[this.selectedIndex].dataset.url
    if (url) {
      loadPage(url, '.index-content')
        .then(function (hasPageData) {
          // console.log('indexRedirect() loadPage first ".then()" call') //! DEBUG
          $('#sidebar').mCustomScrollbar('update')
          $('#sidebar').mCustomScrollbar('scrollTo', 'top', {
            timeout: 500,
            scrollEasing: 'linear',
            scrollInertia: 0
          })

          if (hasPageData) {
            injectContent()
          } else {
            // Load first link as default:
            setTimeout(loadFirstLink, 500)
            setTimeout(window.scrollTo(0, 0), 800)
          }

          // For pages with image to display over text (such as those in NMR section)
          setTimeout(activateTooltip, 300)
        })

      // Create new url
      // Use 'data-url' value of each link to build query string part
      let parts = url.split('/').filter(Boolean)
      let file = parts.pop()
      let path = parts.pop()
      let params = new URLSearchParams({
        index: `${path}/${file}`
      })
      // Create new url with the query string
      let newUrl = new URL(window.location.href)
      newUrl.search = params
      // Remove current url hash if there is any
      newUrl.hash = ''
      // console.log(`"newUrl" is :${newUrl}`)  // ! DEBUG
      window.history.pushState(null, null, newUrl.href)

      // In some cases with links that has tooltip in the main content, the tooltip picture keep displaying
      // This is to hide the tooltip in these cases
      $('.tooltip').tooltip('hide')
    }
  })
}

/**
 * Iterate through all options, grab their data-url attribute value, and check to see whether this value is part of the page url or not.
 * If it is, we mark the related option as selected and jump out of the loop.
 */
// function setOptionSelected () {
//   const options = document.querySelectorAll('.index option')
//   for (let option of options) {
//     let url = option.dataset.url
//     if (window.location.href.includes(url)) {
//       option.setAttribute('selected', '')
//       break
//     }
//   }
// }

/**
 * Load the first link as default
 */
function loadFirstLink () {
  console.log('"loadFirstLink()" working!') // !DEBUG
  window.elementReady('.index-content a:first-of-type')
    .then(function (firstATag) {
      let url = getDataPath() + firstATag.href.split('#')[1]
      loadPage(url, '#content .full-list')
      window.history.pushState(null, null, firstATag.href)

      // setTimeout(loadPdfForMainContentLinks, 500)
      // wait for elementready
      window.elementReady('#content .full-list a[href$=".pdf"]')
        .then(function (el) {
          // console.log(`Should be running because following element exists.\n${el} `) // !DEBUG
          setTimeout(loadPdfForMainContentLinks, 300)
        })
    })
}

/**
 * Process an array and return previous or next item in the array
 * Ref: https://stackoverflow.com/a/26945342/6596203
 */
class SearchResult {
  constructor (arr) {
    this.arr = arr
    this.i = 0
    this.length = arr.length
    this.firstItem = arr[0]
  }

  nextItem () {
    this.i++ // increase i by one
    this.i = this.i % this.arr.length // if we've gone too high, start from `0` again
    // console.log(this.arr[this.i])  // ! DEBUG
    return [this.i, this.arr[this.i]] // give us back the item of where we are now
  }

  prevItem () {
    if (this.i === 0) { // i would become 0
      this.i = this.arr.length // so put it at the other end of the array
    }
    this.i-- // decrease by one
    // console.log(this.arr[this.i])  // ! DEBUG
    return [this.i, this.arr[this.i]] // give us back the item of where we are now
  }
}

/**
 * Return an array of nodes of elements found by XPATH
 * Ref: https://stackoverflow.com/a/42600459/6596203
 * @param {string} xPathSelector XPath selector string
 */
function getElementsByXPath (xPathSelector) {
  let aResult = []
  // Use "ORDERED_NODE_SNAPSHOT_TYPE" to return all of the matched nodes
  let a = document.evaluate(xPathSelector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  for (var i = 0; i < a.snapshotLength; i++) {
    aResult.push(a.snapshotItem(i))
  }
  return aResult
}

/**
 * To return offset pixel of an element from the top of the content using malihu custom scrollbar
 * Ref: https://github.com/malihu/malihu-custom-scrollbar-plugin/issues/184
 * @param {object} el the element that you want to scroll to
 * @param {int} offset the number of pixel offset, default to 100
 */
function scrollToOffset (el, offset = 90) {
  var elTop = $(el).offset().top - $('#sidebar .mCSB_container').offset().top
  return elTop - offset
}

/**
 * Return a string with all regex special characters escaped
 * Ref: https://stackoverflow.com/a/9310752/6596203
 * @param {*} text
 */
function escapeRegExp (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

/**
 * Add simple search function and scroll to item
 */
function scrollToLink () {
  // console.log('"scrollToLink" working!')  // !DEBUG

  // Instantiate Mark object
  const instance = new Mark(document.querySelector('#sidebar'))

  // Instantiate element to display match result
  const matchDiv = document.querySelector('#matchResult')
  const matchResultText = document.querySelector('#matchText')

  // Disable search button till there is not empty query
  const submitButton = document.querySelector('#scrollToLinkButton')
  submitButton.disabled = true
  const inputSideMenuSearch = document.querySelector('#sideMenuSearch')

  const ignoredPunctuations = ":;.,-–—‒_(){}[]!'\"+="
  const ignoredPuncRegex = new RegExp(`[${escapeRegExp(ignoredPunctuations)}]`)

  inputSideMenuSearch.onkeyup = function () {
    if (inputSideMenuSearch.value.trim() !== '' && inputSideMenuSearch.value.length > 0) {
      submitButton.disabled = false
    } else {
      submitButton.disabled = true
      matchDiv.classList.remove('d-flex') // Hide the match result div
    }
  }

  document.querySelector('#scrollToLinkForm').addEventListener('submit', function (e) {
    e.preventDefault()

    instance.unmark() // unmark previously searched query

    // Get the query term
    let query = this.getElementsByTagName('input')[0].value.toLowerCase()
    // let query = this.getElementById('sideMenuSearch').value

    // Popover setup, ref: https://getbootstrap.com/docs/4.5/components/popovers/
    let pop = $(this).find('input')
    pop.popover({
      trigger: 'manual',
      title: 'Term not found',
      // content: 'Try using single word!',
      placement: 'bottom'
    })

    // `translate()` was used in conjunction with input.toLowerCase() to search for case insensitive. Ref: https://stackoverflow.com/a/8474109/6596203
    // "//div[@id='navbar-left']/div//" was used to only search inside this div, otherwise, it would return the whole html body
    // See this for incredible explantion on Xpath Selector: https://stackoverflow.com/a/3655588/6596203
    // XPath Selector cheatsheet: https://devhints.io/xpath
    // var xpath = `//div[@id='navbar-left']/div//*[text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${query}')]]`
    // console.log(xpath)

    // let foundNodes = getElementsByXPath(xpath)
    // // console.log(`${foundNodes.length} match(es).`) // ! DEBUG
    // console.log(foundNodes)

    let foundNodes = []

    // Highlight search termm using 'mark.js', ref: https://markjs.io/
    // !Define option inside mark is somehow give faster executiontime
    // See this for more detail: https://markjs.io/#mark
    instance.mark(query, {
      'separateWordSearch': false,
      'acrossElements': true, // Whether to search for matches across elements
      'ignoreJoiners': true, // Whether to also find matches that contain soft hyphen, zero width space, zero width non-joiner and zero width joiner.
      'ignorePunctuation': ignoredPunctuations.split(''), // e.g. setting this option to ["'"] would match "Worlds", "World's" and "Wo'rlds"
      'each': function (node) {
        // node is the marked DOM element
        let queryWithoutIgnoredPunctuations = query.replace(ignoredPuncRegex, '')
        let nodeTextContent = node.textContent.replace(ignoredPuncRegex, '').toLowerCase()
        if (queryWithoutIgnoredPunctuations.startsWith(nodeTextContent)) {
          foundNodes.push(node)
        }
      }
    })
    // console.log(`${foundNodes.length} match(es).`) // ! DEBUG
    // console.log(foundNodes)

    let result = new SearchResult(foundNodes)
    // console.log(typeof (foundNodes.snapshotLength))

    if (result.length > 0) { // if a tag is found
      // Update match result
      matchDiv.classList.add('d-flex')
      matchResultText.innerHTML = `1/${result.length}`

      pop.popover('hide') // Hide popover

      // Scroll to the first item with offset (in pixel)
      $('#sidebar').mCustomScrollbar('scrollTo',
        scrollToOffset(result.firstItem),
        { scrollInertia: 0 } // default is too slow and cause issue with items at the bottom or a long list
      )

      // For button to go scroll to previous match
      document.getElementById('prev_button').onclick = function (e) { // the e here is the event itself
        // console.log('Prev button clicked.')  // ! DEBUG
        let [i, item] = result.prevItem()
        matchResultText.innerHTML = `${i + 1}/${result.length}`
        // Scroll to the next item with offset (in pixel)
        $('#sidebar').mCustomScrollbar('scrollTo',
          scrollToOffset(item),
          { scrollInertia: 0 } // default is too slow and cause issue with items at the bottom or a long list
        )
      }

      // For button to go scroll to next match
      document.getElementById('next_button').onclick = function (e) { // the e here is the event itself
        // console.log('Next button clicked.')  // ! DEBUG
        let [i, item] = result.nextItem()
        matchResultText.innerHTML = `${i + 1}/${result.length}`
        // Scroll to the next item with offset (in pixel)
        $('#sidebar').mCustomScrollbar('scrollTo',
          scrollToOffset(item),
          { scrollInertia: 0 } // default is too slow and cause issue with items at the bottom or a long list
        )
      }
    } else {
      pop.popover('show')
      // Hide popover after 5 sec
      pop.on('shown.bs.popover', function () {
        setTimeout(function () {
          pop.popover('hide')
        }, 5000)
      })

      matchDiv.classList.remove('d-flex')
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
  // console.log('changeIndex() runs') // !DEBUG
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

/**
 * Load PDF file into <object> tag, and inject that content to the targetElem
 * @param {string} url
 * @param {string} targetElem CSS selector of the target element
 */
function loadPdf (url, targetElem) {
  // console.log('"loadPdf()" running!')
  let contentDiv = document.querySelector(targetElem)
  let content = `
    <object class="embed-pdf" data="${url}" type="application/pdf">
      <embed src="${url}" type="application/pdf" />
    </object>`
  contentDiv.innerHTML = content
}

/**
 * Check if the link is internal PDF and load into '<object></object>' tag if this page has 'loadPdfInFrame' == true
 * 'loadPdfInFrame' is set in in the html page
 * @param {*} event the onclick event
 * @param {*} link the a tag that is cliked on
 */
function loadPdfAndMakeUrl (event, link) {
  // Check if link contains pdf file and it is internal link
  if (typeof loadPdfInFrame !== 'undefined' && // Checking for pages that does not have `var loadPdfInFrame` set
    loadPdfInFrame &&
    link.href.endsWith('.pdf') &&
    (window.location.hostname === link.hostname || !link.hostname.length)) {
    // console.log('Load PDF file into main content')  // ! DEBUG
    event = event || window.event
    if (event) {
      event.preventDefault()
    }
    // let pdfName = new URL(link.href).pathname.split('/').filter(Boolean).pop()
    let pdfUrl = getDataPath() + link.getAttribute('href')
    console.log(pdfUrl) // ! DEBUG
    loadPdf(pdfUrl, '#content .full-list')

    // Create new url with the query string
    let newUrl = new URL(window.location.href)
    // Remove current url hash if there is any
    // newUrl.hash = pdfName
    newUrl.hash = link.getAttribute('href')
    // console.log(`"newUrl" is :${newUrl}`)  // ! DEBUG
    window.history.pushState(null, null, newUrl.href)

    // Scroll to top of the new content page
    setTimeout(window.topFunction, 100)

    return false
  }
  return true
}

/**
 * For links in the main content section, load internal PDF file into '<object></object>' tag
 * if this page has 'loadPdfInFrame' == true
 * 'loadPdfInFrame' is set in in the html page
 */
function loadPdfForMainContentLinks () {
  // console.log('"loadPdfForMainContentLinks" is running!')  // ! DEBUG
  if (loadPdfInFrame) {
    document.querySelectorAll('#content .full-list a[href$=".pdf"]').forEach(function (link) {
      link.onclick = function (e) {
        console.log('For links to PDF in the main content') // !DEBUG
        // In some cases with links that has tooltip in the main content, the tooltip picture keep displaying
        // This is to hide the tooltip in these cases
        $('.tooltip').tooltip('hide')

        loadPdfAndMakeUrl(e, this)
      }
    })
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
