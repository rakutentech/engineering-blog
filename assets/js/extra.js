(function(){
    // Add observer to change the color of the logo in dark mode
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    const targetNode = document.body;
    const config = { attributes: true, childList: false, subtree: false };
    const callback = function(mutationsList, observer) {
        if (targetNode.getAttribute("style") === "--tooltip:lightgrey;") {
            // Light mode
            if ( targetNode.classList.contains('light') ) {
            } else {
                targetNode.classList.add("light");
            }
        } else {
            // Dark mode
            if ( targetNode.classList.contains('light') ) {
                targetNode.classList.remove("light");
            } else {
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);    
})()
