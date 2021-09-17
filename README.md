# sevenSegments
Web components that emulates seven segment displays. Currently contains a component for a single seven segment digit that accepts a value in the range [0, 9] to render, and a seven segment display that uses multiple seven segment digits.

## Usage
Include the script for the component
``` <script type="text/javascript" src="sevenSegment.js"></script> ```

Use the components!
```  
<seven-segment-display
        id="display-test"
        value="1234678"
        format="dd:*dd.*dd">
</seven-segment-display>
```

## Installation
It's a web component, so all you need to do is to include the source script.

## Todo
* Wrap in module for use in other js projects
* Resizable display
* More components (stopwatch, wall clock, timer etc)
