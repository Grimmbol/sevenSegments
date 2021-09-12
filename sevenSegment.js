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

    // Run setup and render inital state
    this.setupState();
    this.setupDOM();
    this.render();
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

  // Optimisation: avoid transforms
  setupDOM() {
    let svgNS = "http://www.w3.org/2000/svg";
    let svgRoot = document.createElementNS(svgNS, "svg");
    svgRoot.setAttributeNS(null,"id","svgRoot");
    svgRoot.setAttributeNS(null,"height","60");
    svgRoot.setAttributeNS(null,"width","32");

    /* Leave it to users to add background. Saves rendering time
    let backgroundRect = document.createElementNS(svgNS, "rect")
    backgroundRect.setAttributeNS(null, "width", "100%");
    backgroundRect.setAttributeNS(null, "height", "100%");
    backgroundRect.setAttributeNS(null, "fill", "black");
    */
    
    let wrapperGroup = document.createElementNS(svgNS, "g");
    wrapperGroup.setAttributeNS(null,"id", "lightsGroup");

    // Create svg for number in off-state
    // Avoids transforms for faster rendering
    let light0 = document.createElementNS(svgNS, "polygon");
    light0.setAttributeNS(null, "id", "light0");
    light0.setAttributeNS(null, "points", "4 2, 6 0, 26 0, 28 2, 26 4, 6 4");
    light0.setAttributeNS(null, "fill", this.offColor);

    let light1 = document.createElementNS(svgNS, "polygon");
    light1.setAttributeNS(null, "id", "light1");
    light1.setAttributeNS(null, "points", "2 4, 4 6, 4 26, 2 28, 0 26, 0 6");
    light1.setAttributeNS(null, "fill", this.offColor);

    let light2 = document.createElementNS(svgNS, "polygon");
    light2.setAttributeNS(null, "id", "light2");
    light2.setAttributeNS(null, "points", "30 4, 32 6, 32 26, 30 28, 28 26, 28 6 ");
    light2.setAttributeNS(null, "fill", this.offColor);

    let light3 = document.createElementNS(svgNS, "polygon");
    light3.setAttributeNS(null, "id", "light3");
    light3.setAttributeNS(null, "points", "4 30, 6 28, 26 28, 28 30, 26 32, 6 32");
    light3.setAttributeNS(null, "fill", this.offColor);
   
    let light4 = document.createElementNS(svgNS, "polygon");
    light4.setAttributeNS(null, "id", "light4");
    light4.setAttributeNS(null, "points", "2 32, 4 34, 4 54, 2 56, 0 54, 0 34");
    light4.setAttributeNS(null, "fill", this.offColor);

    let light5 = document.createElementNS(svgNS, "polygon");
    light5.setAttributeNS(null, "id", "light5");
    light5.setAttributeNS(null, "points", "30 32, 32 34, 32 54, 30 56, 28 54, 28 34");
    light5.setAttributeNS(null, "fill", this.offColor);

    let light6 = document.createElementNS(svgNS, "polygon");
    light6.setAttributeNS(null, "id", "light6");
    light6.setAttributeNS(null, "points", "4 58, 6 56, 26 56, 28 58, 26 60, 6 60");
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
    //svgRoot.appendChild(backgroundRect);
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

  attributeChangedCallback(name, oldValue, newValue) {
    // Only update on actual change
    if(oldValue != newValue) {
      // TODO: permit bitstring input for manual light controll?
      if(name == "value") {
	this.value =
	  parseInt(newValue, 10);

	if (isNaN(this.value)) {
	  this.value = 0;
	}
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
    let isOn = 0;
    // Check bits of new pattern. If 1 turn light on, if 0 turn light off
    let bufferLights = this.svgBuffer.querySelector("g").childNodes;
    for(let i = 0; i < 7; i++) {
      isOn = (newPattern >> i) & 1;
      if(isOn) {
	bufferLights[i].setAttributeNS(null, "fill", this.onColor);
      }
      else {
	bufferLights[i].setAttributeNS(null, "fill", this.offColor);
      }
    }
    

    // Swap buffers
    let oldSvgRoot = this.shadowRoot.querySelector("#svgRoot");
    this.shadowRoot.replaceChild(this.svgBuffer, oldSvgRoot);
    this.svgBuffer = oldSvgRoot;
    
  }
}
customElements.define("seven-segment-digit", SevenSegmentDigit);


// ***** DISPLAY *****
// Stores display value as string
class SevenSegmentDisplay extends HTMLElement {

  // *** Setup ***
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    // Set up svg prototypes for '.' and ':' that can be cloned and
    // inserted into the display if requested by format string
    this.onColor = "red";
    this.offColor = "#3d0f04";
    this.createTemplates();
    // For colons on/off. Should be passed to seven segment digits as attributes?
  }
  
  // If we want to read attributes or the outside DOM in general,
  // we must wait for the custom element to be connected
  connectedCallback() {
    this.loaded = true;
    this.setupState();
    this.setupDOM();
  }

  // Optimisation: avoid transforms
  createTemplates() {
    let svgNS = "http://www.w3.org/2000/svg";
    let svgColonRoot = document.createElementNS(svgNS, "svg");
    let svgDotRoot = document.createElementNS(svgNS, "svg");
    let svgDot = document.createElementNS(svgNS, "circle");

    svgDot.setAttributeNS(null, "r", "3");
    svgDot.setAttributeNS(null, "cx", "3");
    svgDot.setAttributeNS(null, "cy", "3");
    svgDot.setAttributeNS(null, "fill", this.onColor); // lit by default

    let colonDot1 = svgDot.cloneNode(true);
    let colonDot2 = svgDot.cloneNode(true);
    let dotDot = svgDot.cloneNode(true);
    
    svgColonRoot.setAttributeNS(null,"id","svgColonRoot");
    svgColonRoot.setAttributeNS(null,"height","60");
    svgColonRoot.setAttributeNS(null,"width","16");

    colonDot1.setAttributeNS(null, "cx", "6");
    colonDot1.setAttributeNS(null, "cy", "16");
    colonDot2.setAttributeNS(null, "cx", "6");
    colonDot2.setAttributeNS(null, "cy", "44");
    svgColonRoot.appendChild(colonDot1);
    svgColonRoot.appendChild(colonDot2);
    
    svgDotRoot.setAttributeNS(null,"id","svgDotRoot");
    svgDotRoot.setAttributeNS(null,"height","60");
    svgDotRoot.setAttributeNS(null,"width","16");

    dotDot.setAttributeNS(null, "cx", "4");
    dotDot.setAttributeNS(null, "cy", "56");
    
    svgDotRoot.appendChild(dotDot);

    // make templates visible
    this.colon = svgColonRoot;
    this.dot = svgDotRoot;
  }

  setupState() {
    this.value =
      this.hasAttribute("value") ?
      this.getAttribute("value") :
      "0";
    
    let tmpFormat = ""
    if(this.hasAttribute("format")) {
      tmpFormat = this.getAttribute("format");
    }
    else {
      // If no format is specified, fill with enough digits to display value
      for(let i = 0; i < this.value.length; i++) {
	tmpFormat += "d"
      }
    }
    this.format = tmpFormat;
  }


  // Two steps:
  // 1. add DOM nodes to match given format
  // 2. fill in digits at digit slots, matching digit slots and digits ltr
  //    For instance, dd:dd and 12345 should render 12:34.
  setupDOM() {
    // First create component tree to match format string
    let wrapperElem = document.createElement("div");
    wrapperElem.setAttribute("id", "displayWrapper");

    // Parse format string and create DOM nodes
    let bufferStart = 0;

    // Add margin style to all children
    while(bufferStart < this.format.length) {
      let curChar = this.format[bufferStart];
   
      if(curChar == "d" || curChar == "D") {
	let digit = document.createElement("seven-segment-digit");
	digit.style.margin = "2px";
	wrapperElem.appendChild(digit);
	bufferStart += 1;
      }

      // Create ':' in off state if alone, or on state if followed by '*'
      else if(curChar == ':') {
	if((bufferStart + 1) < this.format.length
	   && this.format[bufferStart+1] == '*') {
	  // Create lit ':'
	  let newLitColon = this.colon.cloneNode(true);
	  wrapperElem.appendChild(newLitColon);
	  bufferStart += 2;
	}
	else {
	  // Create unlit ':'
	  let newUnlitColon = this.colon.cloneNode(true);
	  let unlitCircles = newUnlitColon.querySelectorAll("circle");
	  
	  unlitCircles[0].setAttributeNS(null, "fill", this.offColor);
	  unlitCircles[1].setAttributeNS(null, "fill", this.offColor);

	  wrapperElem.appendChild(newUnlitColon);
	  bufferStart += 1;
	}
      }

      else if(curChar == '.') {
	if((bufferStart + 1) < this.format.length
	   && this.format[bufferStart+1] == '*') {
	  // Create lit '.'
	  let newLitDot = this.dot.cloneNode(true);
	  wrapperElem.appendChild(newLitDot);
	  bufferStart += 2;
	}
	else {
	  // Create unlit '.'
	  let newUnlitDot = this.dot.cloneNode(true);
	  newUnlitDot.childNodes[0].setAttributeNS(null, "fill", this.offColor);
	  wrapperElem.appendChild(newUnlitDot);
	  bufferStart += 1;
	}
      }
    }

    // Fill available seven segment digits with as much of this.value as possible
    // Digits without value remain zero
    let digitNodes = wrapperElem.querySelectorAll("seven-segment-digit");
    let numDigitNodes = digitNodes.length;
    for(let i = 0; i < this.value.length; i++) {
      if(i < numDigitNodes) {
	digitNodes[i].setAttribute("value", this.value[i]);
      }
    }

    // Update buffer *before* inserting into live DOM tree to reduce redraws
    this.displayBuffer = wrapperElem.cloneNode(true);
    
    this.shadowRoot.appendChild(wrapperElem);
    this.style.backgroundColor = "black";
    //this.style.padding = "2px";
  }

  static get observedAttributes(){
    return ["value", "format"];
  }
  
  // *** Update ***
  attributeChangedCallback(name, oldValue, newValue) {
    // Only update on actual change
    if(oldValue != newValue) {
      if(name == "value") {
	this.value = newValue;
	this.renderValue();
      }
      if(name == "format") {
	this.format = newValue;
	this.renderFormat();
      }

    }
  }

  // This method only alters the value of the digit elements
  renderValue() {
    // No rendering before the element is actually loaded
    if(!this.loaded) {
      return;
    }

    // TODO: if no format is specified, the display
    // should grow and shrink to accomodate all digits in this.value
    
    // No buffering, under the assumption that few digits change at once
    let curDigits = this.shadowRoot.querySelectorAll("seven-segment-digit");
    for(let i = 0; i < Math.max(this.value.length, curDigits.length); i++) {
      let curDigit = curDigits[i];
      let curDigitValue = curDigit.getAttribute("value");
      // Compare digit in value to the digit already written
      if(curDigitValue !== this.value[i]) {
	curDigit.setAttribute("value", this.value[i]);
      }
    }
  }

  renderFormat() {
    // No rendering before the element is actually loaded
    if(!this.loaded) {
      return;
    }
  }

  updateDOM(){
    
    
  }
}
customElements.define("seven-segment-display", SevenSegmentDisplay);
