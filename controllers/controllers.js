'use strict'
window.addEventListener("load", init);

function init() {
  setupDigitDemo("1");
  setupDisplayDemo("123456", "dd:*dd.*dd");
}

function setupDigitDemo(startValue) {
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
