'use strict'
window.addEventListener("load", init);

function init() {
  setupDigitDemo("1", "32", "60", "false");
  setupDisplayDemo("__-3456", "dd:*dd.*dd");
}

function setupDigitDemo(startValue, startWidth, startHeight, startDisable) {
  let digitDemoWrap = document.querySelector(".digit-demo");
  let keyValuePairs = digitDemoWrap.querySelectorAll(".key-value-pair");
  let demoElement = digitDemoWrap.querySelector("seven-segment-digit");
  
  for(let curKeyValue of keyValuePairs) {
    let curKey = curKeyValue.querySelector(".key").textContent;
    let curValueField = curKeyValue.querySelector(".value");
    // Prune : and space, and set to lower case
    curKey = curKey.replace(':', '').replace(' ', '').toLowerCase();

    if(curKey === "value") {
      // Inital state
      demoElement.setAttribute("value", startValue);
      curValueField.value = startValue;
      // Event listener
      curValueField.addEventListener('input', (e) => {
	// Clear old, replace with new
	curValueField.value = e.data;
	demoElement.setAttribute("value", e.data);
      });
    }
    else if(curKey === "width") {
      // Inital state
      demoElement.setAttribute("width", startWidth);
      curValueField.value = startWidth;
      // Event listener
      curValueField.addEventListener('input', (e) => {
	// Clear old, replace with new
	demoElement.setAttribute("width", e.data);
      });
    }
    
    else if(curKey === "height") {
      // Inital state
      demoElement.setAttribute("height", startHeight);
      curValueField.value = startHeight;
      // Event listener
      curValueField.addEventListener('input', (e) => {
	// Clear old, replace with new
	demoElement.setAttribute("height", e.data);
      });
     }
    else if(curKey === "disable") {
      // Inital state
      demoElement.setAttribute("disable", startDisable);
      curValueField.checked =
	(startDisable == "true" ? true : false);

      curValueField.addEventListener('change', (e) => {
	console.log("Flippy")
	let newDisable =
	  (curValueField.checked == true ? "true" : "false") 
	demoElement.setAttribute("disable", newDisable);
      });

    }
  }
}


function setupDisplayDemo(startValue, startFormat) {
  let displayDemoWrap = document.querySelector(".display-demo");
  let keyValuePairs = displayDemoWrap.querySelectorAll(".key-value-pair");
  let displayElement = displayDemoWrap.querySelector("seven-segment-display");

  for(let curKeyValue of keyValuePairs) {
    let curKey = curKeyValue.querySelector(".key").textContent;
    let curValueField = curKeyValue.querySelector(".value");
    // Prune : and space, and set to lower case
    curKey = curKey.replace(':', '').replace(' ', '').toLowerCase();

    if(curKey === "value") {
      // Inital state
      displayElement.setAttribute("value", startValue);
      curValueField.value = startValue;

      // Event listener
      curValueField.addEventListener("input", (e) => {
	curValueField.value = e.target.value;
	displayElement.setAttribute("value", e.target.value);
      });
    }

    else if(curKey === "format") {
      // Initial state
      displayElement.setAttribute("format", startFormat);
      curValueField.value = startFormat;

      // Event listener
      curValueField.addEventListener("input", (e) => {
	curValueField.format = e.target.value;
	displayElement.setAttribute("format", e.target.value);
      });
    }
  }
}
