const { screen, document } = window
const swypeStep = (screen.width > screen.height ? screen.height : screen.width) / 15
const hypotenuseStep = swypeStep / 3
let touchStartX = 0
let touchStartY = 0
let touchEnd = false


document.body.addEventListener('touchstart', function touchstart(e) {
  touchStartX = e.targetTouches[0].clientX
  touchStartY = e.targetTouches[0].clientY
}, false)

document.body.addEventListener('touchmove', function touchmove(e) {
  if (!touchEnd) {
    const absX = Math.abs(touchStartX - e.targetTouches[0].clientX)
    const absY = Math.abs(touchStartY - e.targetTouches[0].clientY)

    if (absX > hypotenuseStep && absY > hypotenuseStep) {
      touchStartX = e.targetTouches[0].clientX
      touchStartY = e.targetTouches[0].clientY
    } else {
      if (e.targetTouches[0].clientX - touchStartX > swypeStep) {
        window.dispatchEvent(new Event('touch:swype:left_to_right'))
        touchEnd = true
      } else if (touchStartX - e.targetTouches[0].clientX > swypeStep) {
        window.dispatchEvent(new Event('touch:swype:right_to_left'))
        touchEnd = true
      } else if (touchStartY - e.targetTouches[0].clientY > swypeStep) {
        window.dispatchEvent(new Event('touch:swype:bottom_to_up'))
        touchEnd = true
      }
    }
  }
}, false)

document.body.addEventListener('touchend', function touchend(e) {
  touchStartX = 0
  touchStartY = 0
  touchEnd = false
}, false)
