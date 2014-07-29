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
    link.href = "data:text;charset=utf-8," + encodeURIComponent(content);
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
