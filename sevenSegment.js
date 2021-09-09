'use strict'

//  0-9 initally
class SevenSegmentDigit extends HTMLElement {

  //*** Setup ***
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    // index 0 is the number 0, index 1 is the number 1 etc
    // Light mapping is as follows
    //  0000
    // 1    2
    // 1    2
    //  3333
    // 4    5
    // 4    5
    //  6666
    // Least significant bit in pattern bit string sets light 0,
    // second light 1 etc.
    
    this.lightPatterns =
      [
	0b1110111, //0
	0b0100100, //1
	0b1011101, //2
	0b1101101, //3
	0b0101110, //4
	0b1101011, //5
	0b1111011, //6
	0b0100101, //7
	0b1111111, //8
	0b1101111, //9
      ]

    // Actual state of lights
    // reflected to visuals on a call to render()
    this.lightState = 0b0000000;

    // The colors used for the display
    this.onColor = "red";
    this.offColor = "#3d0f04";
  }
  
  setupState() {
    this.value =
      this.hasAttribute("value") ?
      parseInt(this.getAttribute("value"), 10) :
      0;

    console.log("At setup, value is " + this.value);

    // Clamp to a single digit
    if(this.value > 9) {this.value = 9;}
    if(this.value < 0) {this.value = 0;}
    console.log("At setup after clamp, value is " + this.value);
  }

  setupDOM() {
    let svgNS = "http://www.w3.org/2000/svg";
    let svgRoot = document.createElementNS(svgNS, "svg");
    svgRoot.setAttributeNS(null,"id","svgRoot");
    svgRoot.setAttributeNS(null,"height","60");
    svgRoot.setAttributeNS(null,"width","38");

    let backgroundRect = document.createElementNS(svgNS, "rect")
    backgroundRect.setAttributeNS(null, "width", "100%");
    backgroundRect.setAttributeNS(null, "height", "100%");
    backgroundRect.setAttributeNS(null, "fill", "black");

    let wrapperGroup = document.createElementNS(svgNS, "g");
    wrapperGroup.setAttributeNS(null,"id", "lightsGroup");
    wrapperGroup.setAttributeNS(null,"transform", "translate(4, 4)");

    // Create svg for number in off-state
    let light0 = document.createElementNS(svgNS, "polygon");
    light0.setAttributeNS(null, "id", "light0");
    light0.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light0.setAttributeNS(null, "fill", this.offColor);

    let light1 = document.createElementNS(svgNS, "polygon");
    light1.setAttributeNS(null, "id", "light1");
    light1.setAttributeNS(null, "transform-origin", "3 2");
    light1.setAttributeNS(null, "transform", "rotate(90)");
    light1.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light1.setAttributeNS(null, "fill", this.offColor);

    let light2 = document.createElementNS(svgNS, "polygon");
    light2.setAttributeNS(null, "id", "light2");
    light2.setAttributeNS(null, "transform-origin", "3 2");
    light2.setAttributeNS(null, "transform", "translate(24, 0) rotate(90)");
    light2.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light2.setAttributeNS(null, "fill", this.offColor);

    let light3 = document.createElementNS(svgNS, "polygon");
    light3.setAttributeNS(null, "id", "light3");
    light3.setAttributeNS(null, "transform", "translate(0, 24)");
    light3.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light3.setAttributeNS(null, "fill", this.offColor);
   
    let light4 = document.createElementNS(svgNS, "polygon");
    light4.setAttributeNS(null, "id", "light4");
    light4.setAttributeNS(null, "transform-origin", "3 2");
    light4.setAttributeNS(null, "transform", "translate(0, 24) rotate(90)");
    light4.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light4.setAttributeNS(null, "fill", this.offColor);

    let light5 = document.createElementNS(svgNS, "polygon");
    light5.setAttributeNS(null, "id", "light5");
    light5.setAttributeNS(null, "transform-origin", "3 2");
    light5.setAttributeNS(null, "transform", "translate(24, 24) rotate(90)");
    light5.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light5.setAttributeNS(null, "fill", this.offColor);

    let light6 = document.createElementNS(svgNS, "polygon");
    light6.setAttributeNS(null, "id", "light6");
    light6.setAttributeNS(null, "transform", "translate(0, 48)");
    light6.setAttributeNS(null, "points", "3 2, 5 0, 25 0, 27 2, 25 4, 5 4");
    light6.setAttributeNS(null, "fill", this.offColor);
    
    // Glue together the wrapper
    wrapperGroup.appendChild(light0);
    wrapperGroup.appendChild(light1);
    wrapperGroup.appendChild(light2);
    wrapperGroup.appendChild(light3);
    wrapperGroup.appendChild(light4);
    wrapperGroup.appendChild(light5);
    wrapperGroup.appendChild(light6);
    
    // Glue top level elements
    svgRoot.appendChild(backgroundRect);
    svgRoot.appendChild(wrapperGroup);
    
    // Deep copy the constructed svg for later
    // use as a rendering buffer 
    this.svgBuffer = svgRoot.cloneNode(true);

    // Finally attach constructed svg to render tree
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
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only update on actual change
    if(oldValue != newValue) {
      if(name == "value") {
	this.value =
	  parseInt(newValue, 10);
	// Clamp to a single digit
	if(this.value > 9) {this.value = 9;}
	if(this.value < 0) {this.value = 0;}

	// Render new value of this.value
	this.render();
      }
    }
  }

  //*** Render ***
  // Update buffer, then swap currently displayed SVG tree with buffer
  render() {

    let newPattern = this.lightPatterns[this.value];
    console.log(newPattern.toString(2))
    let isOn = 0;
    // Check bits of new pattern. If 1 turn light on, if 0 turn light off
    let bufferLights = this.svgBuffer.querySelector("g").childNodes;
    for(let i = 0; i < 7; i++) {
      isOn = (newPattern >> i) & 1;
      console.log(bufferLights[i])
      if(isOn) {
	bufferLights[i].setAttributeNS(null, "fill", this.onColor);
      }
      else {
	bufferLights[i].setAttributeNS(null, "fill", this.offColor);
      }
    }
    

    // Apply buffer
    let oldSvgRoot = this.shadowRoot.querySelector("#svgRoot");
    console.log(oldSvgRoot);
    this.shadowRoot.replaceChild(this.svgBuffer, oldSvgRoot);
    this.svgBuffer = oldSvgRoot;
    
  }
}
customElements.define("seven-segment-digit", SevenSegmentDigit);


// ***** DISPLAY *****
class SevenSegmentDisplay extends HTMLElement {

  // *** Setup ***
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  // If we want to read attributes or the outside DOM in general,
  // we must wait for the custom element to be connected
  connectedCallback() {
    this.setupState();
    this.setupDOM();
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
      digit.setAttribute("value", 5);
      this.shadowRoot.appendChild(digit);
    }
  }

  static get observedAttributes(){
    return ["value"];
  }

  // *** util ***
  countDigits(number) {
    let count = 0;
    while(number > 1) {
      number = number / 10;
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
