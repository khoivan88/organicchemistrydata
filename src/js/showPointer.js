window.showPointer = showPointer

// Offset in px for new pointer picture
const pointerOffsetTop = -5
const pointerOffsetLeft = -16

/**
 *
 * @param {int} top : offset top in pixel from the top left corner of the image to display the pointer
 * @param {int} left: offset left in pixel from the top left corner of the image to display the pointer
 */
function showPointer (top, left) {
  console.log('"showPointer()" is running.')
  // Create the img tag for the pointer
  var pointer = document.createElement('img')
  pointer.id = 'pointer'
  pointer.src = '/img/dot.gif'
  pointer.width = '25'

  // Set its original top * left coordinates (relative to the top left corner of the picture)
  // This is set as a reference in case of resizing
  pointer.dataset.top = top
  pointer.dataset.left = left

  var img = document.querySelector('.full-list .synthesis')
  let a = [top, left]
  // Get the ratio of the current img compared to its original size
  let ratio = img.width / img.naturalWidth
  // Get the new position using ratio and the img offset position
  let b = [a[0] * ratio + img.offsetTop + pointerOffsetTop, a[1] * ratio + img.offsetLeft + pointerOffsetLeft]
  let y = 'position:absolute; top:' + b[0] + 'px; left:' + b[1] + 'px;'
  pointer.style.cssText = y

  // Put the pointer element right before the img element
  img.before(pointer)
}

function movePointer () {
  var pointer = document.querySelector('#pointer')
  var img = document.querySelector('.full-list .synthesis')
  if (pointer && img) {
    console.log('Moving pointer because image is being resized')
    // Get the ratio of the current img compared to its original size
    let ratio = img.width / img.naturalWidth
    // Get the new position using ratio and the img offset position
    let newPos = [pointer.dataset.top * ratio + img.offsetTop + pointerOffsetTop, pointer.dataset.left * ratio + img.offsetLeft + pointerOffsetLeft]
    // Move the pointer to the new position
    pointer.style.top = `${newPos[0]}px`
    pointer.style.left = `${newPos[1]}px`
  }
}

window.addEventListener('resize', function () {
  clearTimeout(window.resizeId)
  window.resizeId = setTimeout(movePointer, 300)
})
