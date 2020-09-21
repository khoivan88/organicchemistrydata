// Refs:
// https://stackoverflow.com/a/31498736/6596203
// https://stackoverflow.com/a/3572361/6596203
$('.hex-holder .dropdown-toggle').click(function () {
  // console.log('worked!!')  // ! DEBUG
  // For all other buttons, close the descriptions, if opened
  $('.hex-holder .dropdown-toggle').not(this).each(function () {
    $(this).parent().parent().removeClass('open')
  })
  // For this button, toggle displaying of the description.
  // Require css for '.hex-holder.open'
  $(this).parent().parent().toggleClass('open')
})
