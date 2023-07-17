# sevenSegments
Web components that emulates seven segment displays. Currently contains a component for a single seven segment digit that accepts a value in the range [0, 9] to render, and a seven segment display that uses multiple seven segment digits.

## Usage
Include the script for the component
``` <script type="module" src="sevenSegment.js"></script> ```

Import and register the components in a script
```
import {
    SevenSegmentDisplay,
    SevenSegmentDigit
} from "../components/sevenSegment.js"

customElements.define("seven-segment-display", SevenSegmentDisplay);
customElements.define("seven-segment-digit", SevenSegmentDigit);

```
Use the components!
```  
<seven-segment-display
        id="display-test"
        value="1234678"
        format="dd:*dd.*dd">
</seven-segment-display>
```

## Installation
There is no npm pacage or similar for this project. Copy and paste sevenSegment.js

## Todo
* Wrap in module for use in other js projects
* Resizable display
* More components (stopwatch, wall clock, timer etc)
