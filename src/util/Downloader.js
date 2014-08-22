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


/** 
 * A small API for opening save dialogs to download data generated in the browser.
 */
Util.Downloader = {
  
  invisInput: undefined,
  
  /** 
   * Displays a save dialog for saving text to a file.
   * @param {string} fileName   The default destination file name.
   * @param {string} content    The text that will be saved to the file.
   */
  saveAsText: function(fileName, content) {
    var link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    link.download = fileName;
    link.click();
  },
  
  
  /** 
   * Displays an open dialog for asynchronously reading the contents of a file 
   * as a string.
   * @param {function(content: string) : void}
   * @param {string} mimeFilter   Optional. A set of comma-separated strings, 
   *      each of which is a valid MIME type with no parameters.
   */
  openDialog: function(successCB, mimeFilter) {
    var fOpen = document.createElement("INPUT");
    fOpen.setAttribute("type", "file");
    
    if(mimeFilter) {
      fOpen.setAttribute("accept", mimeFilter);
    }
    
    fOpen.style.display = "none";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(fOpen);
    
    fOpen.onchange = function(changeEvent) {
      var fr = new FileReader();
      
      fr.onload = function(loadEvent) {
        successCB(loadEvent.target.result);
        
        body.removeChild(fOpen);
      };
      
      fr.readAsText(changeEvent.target.files[0]);
    };
    
    fOpen.click();
  }
  
};
