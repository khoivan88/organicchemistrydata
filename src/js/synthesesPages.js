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
  // if (!content) return
  contentDiv.innerHTML = content

  // let content = await fetchHtmlAsText(url)
  // // if (!content) return
  // contentDiv.innerHTML = content

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
      let url = 'groupby/' + link.dataset.groupedby
      // console.log(url)  // !DEBUG
      loadPage(url, '.syntheses-groupedby')

      // loadSynthesis()

      // waitUntilElementsLoaded('#fnt a', 100000).then(function (elements) {
      //   for (const element of elements) {
      //     element.onclick = function () {
      //       console.log('something')
      //       let url = element.dataset.url
      //       console.log(url) // !DEBUG
      //       // loadPage(url, '#content .full-list')
      //     }
      //   }
      // }).catch(function (error) {
      //   // elements not found withing 10 seconds
      //   console.log(`ERROR: ${error}`)
      // })
    }
  })
}

async function loadSynthesis () {
  // console.log('something1') // !DEBUG
  document.querySelectorAll('.syntheses-groupedby a').forEach(function (link) {
  // $('.syntheses-groupedby a').on('click', function (link) {
    link.onclick = function () {
      // console.log('something2') // !DEBUG
      // link.classList.toggle('active')
      let url = link.dataset.url
      // console.log(url) // !DEBUG
      loadPage(url, '#content .full-list')
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

    // Check the hash for 'groupby' indices first;
    // if not found, load default indexed by 'names' and then try to load the total synthesis page
    loadPage(`groupby/${hash[1]}`, '.syntheses-groupedby')
      // .then(function (response) {
      //   console.log(response)
      //   if (response.ok) {

      //   } else {
      //     return Promise.reject(response);
      //   }
      // })
      .catch(function (error) {
        console.warn(`${error}: indexed by '${hash[1]}'`) // !DEBUG
        loadPage('groupby/names', '.syntheses-groupedby')
        loadPage(`syntheses_data/${hash[1]}`, '#content .full-list')
      })

    // Reload page and create new url (optional)
    // url = window.location.href.replace(/\/#/, "#");
    // window.history.replaceState(null, null, url)

    // // Optionally, force the page scroll to start from the top of the page.
    // setTimeout(() => {
    //   $(window).scrollTop(0)
    // }, 400)
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

$(document).ready(function () {
  // console.log('synthesesPages JS working!') // !DEBUG

  // If user provides a url with hash (e.g. 'example.com/#something') then try to load the correct page
  if (window.location.hash) {
    deepLink()
  } else {
    // Initial load grouped by names page
    loadPage('groupby/names', '.syntheses-groupedby')
  }

  loadSideIndex()
})
