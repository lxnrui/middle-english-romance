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

function addGlosses(){

	var glossElements = document.querySelectorAll('tei\\:note[type="gloss"], tei\\:gloss');
	glossElements.forEach(function(glossElement) {
	
		glossElement.addEventListener('mouseover', function(e) {
			var glossText = glossElement.textContent; // Get the gloss content

			
			var tooltip = document.createElement('div');
			tooltip.classList.add('gloss-tooltip');
			tooltip.textContent = glossText;

			
			var rect = glossElement.getBoundingClientRect();
			tooltip.style.position = 'absolute';
			tooltip.style.left = rect.left + 'px';
			tooltip.style.top = rect.top + rect.height + 5 + 'px'; // 5px for a small gap
			document.body.appendChild(tooltip);
		});

		glossElement.addEventListener('mouseout', function() {
			
			var tooltip = document.querySelector('.gloss-tooltip');
			if (tooltip) {
				tooltip.remove();
			}
		});
	});
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
	addGlosses();
}

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
