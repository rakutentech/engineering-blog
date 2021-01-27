(function() {
  function onAttributeChange(targetNode, callback) {
    // Add observer to change the color of the logo in dark mode
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    const config = {
      attributes: true,
      childList: false,
      subtree: false
    }
    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
  }

  const targetNode = document.body
  onAttributeChange(targetNode, () => {
    const newModeIsDark = (localStorage.getItem('isLight') === 'false')
    const oldModeIsDark = targetNode.classList.contains('dark')
    if (newModeIsDark && !oldModeIsDark) {
        targetNode.classList.add('dark')
    } else if (!newModeIsDark && oldModeIsDark) {
        targetNode.classList.remove('dark')
    }
  })
})()
