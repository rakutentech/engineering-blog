(function() {
  // Add observer to change the color of the logo in dark mode
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  const targetNode = document.body;
  const config = {
    attributes: true,
    childList: false,
    subtree: false
  };
  const callback = function(mutationsList, observer) {
    if (targetNode.getAttribute("style") === "--tooltip:lightgrey;") {
      // Light mode
      if (targetNode.classList.contains('dark')) {
        targetNode.classList.remove("dark");
      } else {
      }
    } else {
      // Dark mode
      if (targetNode.classList.contains('dark')) {
      } else {
        targetNode.classList.add("dark");
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})()
