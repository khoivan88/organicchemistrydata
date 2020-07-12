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

  if (targetElem === '.syntheses-groupedby') {
    loadSynthesis()
  }
}

/**
 * Load the correct index page for each button click
 */
function loadSideIndex () {
  document.querySelectorAll('.syntheses-navbar a').forEach(function (link) {
    link.onclick = function () {
      // link.classList.toggle('active')
      let url = ''
      if (!link.dataset.groupedby) {
        // Handle link without 'groupedby' dataset, just load using the href
        window.location.href = link.href
      } else {
        url = 'groupby/' + link.dataset.groupedby
        // console.log(url)  // !DEBUG
        loadPage(url, '.syntheses-groupedby')
      }

      openSideBarIfClosed()
    }
  })
}

/**
 * Force sidebar visible on all screen sizes when a index menu is clicked
 */
function openSideBarIfClosed () {
  // console.log('openSideBarIfClosed function is working!') // !DEBUG
  let marginLeft = parseInt($('#sidebar').css('marginLeft').replace('px', ''))
  // console.log(marginLeft)  // !DEBUG
  if (marginLeft < 0) {
    // When the side menu is hiding
    // console.log('margin-left < 0')  // !DEBUG
    $('#sidebar, #content').toggleClass('active')

    window.checkForChanges()
  }
}

async function loadSynthesis () {
  // console.log('something1') // !DEBUG
  document.querySelectorAll('.syntheses-groupedby a').forEach(function (link) {
  // $('.syntheses-groupedby a').on('click', function (link) {
    link.onclick = function () {
      // console.log('something2') // !DEBUG
      // link.classList.toggle('active')
      // let url = link.dataset.url
      // let url = '../../syntheses_data/' + link.href.split('#')[1]
      let url = 'syntheses_data/' + link.href.split('#')[1]
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

    // loadPage(`../../syntheses_data/${hash[1]}`, '#content .full-list')
    loadPage(`syntheses_data/${hash[1]}`, '#content .full-list')

    // Check the hash for 'groupby' indices first;
    // if not found, load default indexed by 'names' and then try to load the total synthesis page
    // loadPage(`groupby/${hash[1]}`, '.syntheses-groupedby')
    // // .then(function (response) {
    // //   console.log(response)
    // //   if (response.ok) {
    //   //   } else {
    //   //     return Promise.reject(response);
    //   //   }
    //   // })
    //   .catch(function (error) {
    //     console.warn(`${error}: indexed by '${hash[1]}'`) // !DEBUG
    //     loadPage('groupby/names', '.syntheses-groupedby')
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

  // $('.syntheses-groupedby a').on("click", function() {
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

function indexRedirect () {
  // console.log('indexRedirect JS working!') // !DEBUG

  const select = document.querySelector('.index')
  const options = document.querySelectorAll('.index option')

  // 1
  select.addEventListener('change', function () {
    const url = this.options[this.selectedIndex].dataset.url
    if (url) {
      // window.location.href = url
      loadPage(url, '.syntheses-groupedby')
      setTimeout(() => {
        console.log('scroll from top') // !DEBUG
        $(window).scrollTop(0)
      }, 100)
    }
  })

  // // 2
  // for (const option of options) {
  //   const url = option.dataset.url
  //   if (window.location.href.includes(url)) {
  //     option.setAttribute('selected', '')
  //     break
  //   }
  // }


  // openSideBarIfClosed()
}

$(document).ready(function () {
  // console.log('synthesesPages JS working!') // !DEBUG

  // If user provides a url with hash (e.g. 'example.com/#something') then try to load the correct page
  if (window.location.hash) {
    deepLink()
  }
  // else {
  //   // Initial load grouped by names page
  //   loadPage('groupby/names', '.syntheses-groupedby')
  // }

  loadPage('groupby/names', '.syntheses-groupedby')

  // loadSideIndex()

  indexRedirect()

  loadSynthesis()
})
