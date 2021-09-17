'use strict'
window.addEventListener("load", init);

function init() {
  setupDigitDemo("1");
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
      curValueField.style.width = "50px";
      // Event listener
      curValueField.addEventListener('input', (e) => {
	// Clear old, replace with new
	curValueField.value = e.data;
	demoElement.setAttribute("value", e.data);
      })
    }
  }
}
