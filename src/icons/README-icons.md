## Icons Overview

Icons are generated using SVG files in the raw-svg folder and converting them to a SVG sprite. Required gulp plugins are gulp-svg-sprites for sprite generation and gulp-svgmin for clean and optimization of SVG files. We are no longer using icon fonts.

## Generated Files 

The generated files include files css folder, svg folder and sprite.html. Please do not modify thse files as any changes made here will be erased once the gulp task for generating icons runs.


## Gulp Task 

Gulp task for generating icons is under ops/gulp/icons.js to generate icons use the command `gulp hyicon`

## Adding New Icons 

To add a new icon, simply drop an SVG file under raw-svg folder and run the gulp task `gulp hyicon`. All the icons will be generated and it should appear in sprite.html as a preview. 

Requirements for new icon -

- Filename of the svg file will be used as the class name. For example icon.svg will be converted into a CSS class `hyicon-icon` 
- The canvas size for the SVG should be 132 x 132 pixel
- All the SVG artwork should fill the canves edge to edge.
- Default color for all artwork should be black. Other color or multiple color fills are possible if required.
- Pull requests will not be merged for new icons unless they meet the above criteria for consistant icon size.