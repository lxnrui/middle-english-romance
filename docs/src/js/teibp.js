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
	 initGlossary();
}

function initGlossary() {
  
  var terms = document.querySelectorAll('term[id]');
  
  for (var i = 0; i < terms.length; i++) {
    terms[i].addEventListener('click', function() {
      var targetId = this.getAttribute('xml:id') || this.id;
      var glossaryEntry = document.querySelector('term[ref="#' + targetId + '"]');
      
      if (glossaryEntry) {
        
        glossaryEntry.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

       
        var listItem = glossaryEntry.closest('item');
        listItem.style.backgroundColor = '#fffacd';
        setTimeout(function() {
          listItem.style.backgroundColor = '';
        }, 2000);
      }
    });
  }

 
  var glossaryItems = document.querySelectorAll('item[id^="gloss-"]');
  
  for (var j = 0; j < glossaryItems.length; j++) {
    var item = glossaryItems[j];
    var termId = item.id.replace('gloss-', '');
    
   
    var backButton = document.createElement('button');
    backButton.className = 'gloss-back';
    backButton.innerHTML = '↩ Back to term';
    backButton.style.cssText = `
      margin-left: 10px;
      padding: 2px 8px;
      background: #f8f4e8;
      border: 1px solid #d4c9a8;
      border-radius: 3px;
      font-size: 0.8em;
      cursor: pointer;
    `;
    
   
    backButton.addEventListener('click', function(termId) {
      return function() {
        var targetTerm = document.querySelector('term[id="' + termId + '"]');
        if (targetTerm) {
          targetTerm.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          
         
          targetTerm.style.outline = '2px solid #5f0000';
          setTimeout(function() {
            targetTerm.style.outline = '';
          }, 2000);
        }
      };
    }(termId));
    
    
    var termRef = item.querySelector('term[ref]');
    if (termRef) {
      termRef.parentNode.insertBefore(backButton, termRef.nextSibling);
    } else {
      item.appendChild(backButton);
    }
  }
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
