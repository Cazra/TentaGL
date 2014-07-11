README
========

/* 
 @preserve Copyright (c) 2014 Stephen "Cazra" Lindberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

TentaGL is a Javascript framework for creating games and interactive data
visualizations with WebGL. TentaGL is developed and tested using the Chrome
web browser on a 64-bit Windows 7 computer. I plan to extend support
for the framework in Firefox by major version 1. I do not plan to extend
support to Microsoft Internet Explorer. 


Requirements:
----------------
TentaGL requires the following to run:
* An HTML 5, Javascript, and WebGL-enabled web browser
* The glMatrix 2.0 library for vector and matrix math with typed arrays. A 
  minimized js file of the library is included with the examples, but is not 
  guaranteed to be the most up to date version. 
  glMatrix can be found here: http://glmatrix.net/
  
  
Compiling the library:
----------------
Included with the TentaGL project is a "compiler" written in Java which 
creates a single js file from all the TentaGL source js files. 
The compiler requires a destination file location and the path to the text
file listing the source files to be included in the build 
(in order of dependence). 

To use the compiler from the root directory: 
java JSMinifier [destFile] [srcListFile]

An official source listing file is at ./compileList.txt.
It is recommended to have the destFile be ./bin/TentaGL.min.js, as this is
the file that the examples look for. 

The output js file can be further minified with Google Closure Compiler.
https://developers.google.com/closure/compiler/


Using TentaGL:
----------------
The easiest way to use TentaGL in your project is to just include the compiled
TentaGL.min.js script file in ./bin, after including the script file(s) for 
glMatrix 2.0. 

For ease of usability and learnability, I've included some example programs 
demonstrating various features of TentaGL, and I also keep the source files
well documented. Some parts of TentaGL, like any 3D applications frameworks, 
require some basic knowledge of vector calculus, linear algebra, and OpenGL 
in general. Where possible, I've created APIs to abstract out this knowledge. 


Frequently Asked Questions:
----------------

Q: Why did you name it TentaGL?
A: It's a framework dealing with OpenGL stuff, specifically WebGL. When I first
   started learning WebGL, I was reading a WebGL book with a jellyfish on the 
   cover. It wasn't a very good book for actually learning WebGL, IMO, but 
   the invertebrate on its cover gave me the inspiration for the name of this
   framework. 

Q: When will TentaGL reach major version 1?
A: I will switch it to major version 1 once I'm confident that it could be used 
   to create a whole working game. This means that it needs APIs for
   importing 3D models, animating them, animating 2D sprites, playing sound and
   music, handling colissions, and all that other fun stuff that games do.
   
   
Don't see an answer to your question here or in the documentation? 
Fire me an email at sllindberg21@students.tntech.edu
