"use strict";

//This program creates 20 random colored triagnles, each slightly smaller than the last, stacked on top of each other.

// declare global variables
let gl; 
let points;
let colors;

window.onload = function init()
{
    let dx = 1;
    //Set the width to one
    let dy = 2;
    //Set the height to 2

    let canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }


    //  Initialize our data for the triangles
    //
    //(red, green, blue) values for all of the vertices
    colors = [];

    // And, add our vertices point into our array of points
    points = [];

    // Math.random() gives a random number between 0 and 1
    for (let i = 0; i <20; i++){
            dx = dx - 0.0495;
            dy = dy - 0.0495;
            //This makes the triangles get slight smaller in each dimension each time the loop executes.
            //Using 0.05 would have made the last triangle invisible so made it 0.0495 instead.
            let r = Math.random()
            let g = Math.random()
            let b = Math.random()
            let pt0 = vec2(0,-1);
            //The x origin is in the middle and the y origin is at the bottom
            let color = vec3(r,g,b);
            drawSolidTriangle(pt0, dx, dy, color);
    }

    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, .9, .9, 1.0 ); //slight grey

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    let colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
    
    // Load the data into the GPU

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    let aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( aPosition );


    render();
};

function drawSolidTriangle(pt0, dx, dy, color) {
    //adds values to points and colors global variables
    //creates a triangle at pt0, with width dx, and height dy
    let pt1 = vec2(pt0[0], pt0[1]+dy);
    let pt2 = vec2(pt0[0] + dx, pt0[1]+dy);
    points.push(pt0);
    points.push(pt1);
    points.push(pt2);

    colors.push(color);
    colors.push(color);
    colors.push(color);


    let pt3  = vec2(pt0[0] - dx, pt0[1]+dy);
    //Changed to - dx so that it goes to the left instead of to the right. This creates a mirror image on the left.
    points.push(pt2);
    points.push(pt3);
    points.push(pt0);

    colors.push(color);
    colors.push(color);
    colors.push(color);


}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
}
