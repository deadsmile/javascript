  // MAGIC
  // #1
  link.onload = function () {
    CSSDone('onload listener');
  }
  // #2
  if (link.addEventListener) {
    link.addEventListener('load', function() {
      CSSDone("DOM's load event");
    }, false);
  }
  // #3
  link.onreadystatechange = function() {
    var state = link.readyState;
    if (state === 'loaded' || state === 'complete') {
      link.onreadystatechange = null;
      CSSDone("onreadystatechange");
    }
  };
  
  // #4
  var cssnum = document.styleSheets.length;
  var ti = setInterval(function() {
    if (document.styleSheets.length > cssnum) {
      // needs more work when you load a bunch of CSS files quickly
      // e.g. loop from cssnum to the new length, looking
      // for the document.styleSheets[n].href === url
      // ...
      
      // FF changes the length prematurely :()
      CSSDone('listening to styleSheets.length change');
      clearInterval(ti);
      
    }
  }, 10);
  
  // MAGIC ends
