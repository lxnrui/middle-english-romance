//If W3C event model used, prefer that. Window events are fallbacks
if(document.addEventListener){
	//W3C event model used
	document.addEventListener("DOMContentLoaded", init, false);
	window.addEventListener("load", init, false);
} else if(document.attachEvent){
	//IE event model used
	document.attachEvent( "onreadystatechange", init);
	window.attachEvent( "onload", init);
}

function clearPageBreaks(){
	var breaks = document.querySelectorAll("pb");
	for(var i = 0; i < breaks.length; i++)
		breaks[i].style.display="none";
	
	var breaks = document.querySelectorAll(".-teibp-pb");
	for(var i = 0; i < breaks.length; i++)
		breaks[i].style.display="none";
}

function addPageBreaks(){
	var breaks = document.querySelectorAll("pb");
	for(var i = 0; i < breaks.length; i++)
		breaks[i].style.display="block";

	var breaks = document.querySelectorAll(".-teibp-pb");
	for(var i = 0; i < breaks.length; i++)
		breaks[i].style.display="block";
}

function init(){

	var pbt = document.getElementById('pbToggle');
	if(pbt != null){
		pbt.onclick = function(){
			if(this.checked)
				clearPageBreaks();
			else
				addPageBreaks();
		};
	
		addPageBreaks();
		document.getElementById('pbToggle').checked = false;
	}
	
	var htmlTitle = document.querySelector("html > head > title");
	var teiTitle = document.querySelector("tei-title");
	if(htmlTitle != null && teiTitle != null)
		htmlTitle.textContent = teiTitle.textContent;
	 setTimeout(initGlossary, 100);
}

function initGlossary() {
  // =====================
  // 1. SCROLL DOWN TO GLOSSARY
  // =====================
  document.querySelectorAll('term[id], term[xml\\:id]').forEach(term => {
    // Remove any existing handlers first
    term.replaceWith(term.cloneNode(true));
    
    // Add new handler
    term.style.cursor = 'pointer';
    term.addEventListener('click', function() {
      const targetId = this.getAttribute('xml:id') || this.id;
      
      // Find the matching glossary item (check both XML and HTML formats)
      const glossaryItem = document.querySelector(`
        item[xml\\:id="gloss-${targetId}"],
        #gloss-${targetId},
        [data-id="gloss-${targetId}"]
      `);
      
      if (glossaryItem) {
        // Smooth scroll with visual feedback
        glossaryItem.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Highlight animation
        glossaryItem.style.animation = 'none';
        void glossaryItem.offsetWidth; // Trigger reflow
        glossaryItem.style.animation = 'highlight 2s';
      }
    });
  });

  // =====================
  // 2. SCROLL UP TO TERMS
  // =====================
  document.querySelectorAll('ref[type="backlink"], .gloss-back').forEach(btn => {
    // Clean clone to remove old handlers
    btn.replaceWith(btn.cloneNode(true));
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get target from either attribute
      const targetId = this.getAttribute('target') || this.dataset.target;
      if (!targetId) return;
      
      // Find target term (check both XML and HTML formats)
      const targetTerm = document.querySelector(`
        term[xml\\:id="${targetId.replace('#', '')}"],
        #${targetId.replace('#', '')},
        [data-id="${targetId.replace('#', '')}"]
      `);
      
      if (targetTerm) {
        // Smooth scroll with visual feedback
        targetTerm.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Highlight

function blockUI(){
	var body = document.querySelector("body");
	var blocker = document.createElement('div');
	blocker.setAttribute('class', 'blocker');
	body.appendChild(blocker);	
}

function unblockUI(){
	var blocker = document.querySelector(".blocker");
	if(blocker)
		blocker.parentNode.removeChild(blocker)
}

function switchThemes(theme) {
	document.getElementById('maincss').href=theme.options[theme.selectedIndex].value;
}

function showFacs(num, url, id) {
	var imgs = "";
	var thumbs = document.querySelectorAll(".-teibp-thumbnail");
	for(var i = 0; i < thumbs.length; i++){
		imgs+= "<img id='" + thumbs[i].parentNode.parentNode.parentNode.getAttribute("id") + "' src='" + thumbs[i].getAttribute("src") + "' alt='facsimile page image'/>";
	}	
	var html = [
		"<html>",
			"<head>",
				"<title></title>",
				document.querySelector('#maincss').outerHTML,
				document.querySelector('#customcss').outerHTML,
				document.querySelector('#teibp-tagusage-css') != null ? document.querySelector('#teibp-tagusage-css').outerHTML : "",
				document.querySelector('#teibp-rendition-css') != null ? document.querySelector('#teibp-rendition-css').outerHTML : "",
				"<script src='../js/teibp.js'></script>",
			"</head>",
			"<body>",
				"<script>blockUI();</script>",
				document.querySelector("teiHeader").outerHTML,
				"<div id='resizable'>",
					"<div class='facsImage'>",
						imgs,
					"</div>",
				"</div>",
				document.querySelector("footer").outerHTML,
				
				"<script>",
					"document.getElementById('" + id + "').scrollIntoView();",
					"unblockUI();",
				"</script>",
			"</body>",
		"</html>",	
	].join('\n');
	
	facsWindow = window.open ("about:blank");
	facsWindow.document.write(html);
	facsWindow.document.close();
}
