'use strict'

//  0-9 initally
class SevenSegmentDigit extends HTMLElement {

  //*** Setup ***
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }
  
  setupState() {
    this.value =
      this.hasAttribute("value") ?
      parseInt(this.getAttribute("value"), 10) :
      0;

    // Clamp to a single digit
    if(this.value > 9) {this.value = 9;}
    if(this.value < 0) {this.value = 0;}
  }

  setupDOM() {
    let svgNS = "http://www.w3.org/2000/svg";
    let svgRoot = document.createElementNS(svgNS, "svg");
    svgRoot.setAttributeNS(null,"id","svgRoot");
    svgRoot.setAttributeNS(null,"height","100");
    svgRoot.setAttributeNS(null,"width","100");
	
    let testCircle = document.createElementNS(svgNS, "circle");
    testCircle.setAttributeNS(null, "cx", 40);
    testCircle.setAttributeNS(null, "cy", 40);
    testCircle.setAttributeNS(null, "r", 30);

    testCircle.setAttributeNS(null, "fill", "yellow");

    svgRoot.appendChild(testCircle);
    this.shadowRoot.appendChild(svgRoot);
  }

  static get observedAttributes(){
    return ["value"];
  }

  // If we want to read attributes or the outside DOM in general,
  // we must wait for the custom element to be connected
  connectedCallback() {
    this.setupState();
    this.setupDOM();
  }

  
  // *** Update ***
  attributeChangedCallback(name, oldValue, newValue) {
    // Only update on actual change
    if(oldValue != newValue) {
      if(name == "value") {
	this.value =
	  parseInt(newValue, 10);
	// Clamp to a single digit
	if(this.value > 9) {this.value = 9;}
	if(this.value < 0) {this.value = 0;}
      }
    }
   }
}
customElements.define("seven-segment-digit", SevenSegmentDigit);

class SevenSegmentDisplay extends HTMLElement {

  // *** Setup ***
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  setupState() {
    let workingValue =
      this.hasAttribute("value") ?
      parseInt(this.getAttribute("value"), 10) :
      0;
    
    this.value = workingValue;
    this.numDigits = this.countDigits(workingValue);
  }

  setupDOM() {
    for(let i = 0; i < this.numDigits; i++) {
      let digit = new SevenSegmentDigit();
      this.shadowRoot.appendChild(digit);
    }
  }

  static get observedAttributes(){
    return ["value"];
  }
  
  // If we want to read attributes or the outside DOM in general,
  // we must wait for the custom element to be connected
  connectedCallback() {
    this.setupState();
    this.setupDOM();
  }

  // *** util ***
  // Primitive datatypes are passed by reference
  countDigits(number) {
    let count = 0;
    while(number > 1) {
      number = number * 0.1;
      count = count + 1;
    }
    return count;
  }
  
  // *** Update ***
  attributeChangedCallback(name, oldValue, newValue) {
    // Only update on actual change
    if(oldValue != newValue) {
      if(name == "value") {
	this.updateValue(newValue);
      }
    }
  }

  updateValue(newValue) {
    if(typeof(newValue) == "string") {
      this.value = parseInt(newValue, 10);
    }
    let newNumDigits = this.countDigits(newValue);
    let oldNumDigits = this.numDigits;

    this.numDigits = newNumDigits;
    
    if(newNumDigits != oldNumDigits) {
      this.updateDOM();
    }
  }

  updateDOM(){
   
  }
}
customElements.define("seven-segment-display", SevenSegmentDisplay);
