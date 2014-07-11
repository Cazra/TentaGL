import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

public class JSMinifier {
  
  public static void main(String[] args) {
    if(args.length != 2) {
      System.out.println("Error: 2 arguments required: output file path and input file path.");
      return;
    }
    
    
    try {
    
      // Create the directory for the destination file, if necessary.
      File destFile = new File(args[0]);
      String destDirPath = destFile.getParent();
      if(destDirPath != null) {
        File destDir = new File(destDirPath);
        if(!destDir.exists()) {
          destDir.mkdir();
        }
      }
      
      File srcFile = new File(args[1]);
      if(!srcFile.exists()) {
        System.out.println("Error: Source file " + args[1] + " does not exist.");
        return;
      }
      
      List<File> jsFiles = getFileList(srcFile);
      String minContents = concatFileContents(jsFiles);
      
      FileWriter fw = new FileWriter(destFile);
      fw.write(minContents);
      fw.close();
    }
    catch(Exception e) {
      throw new RuntimeException(e);
    }
  }
  
  
  
  public static List<File> getFileList(File srcFile) throws Exception {
    FileReader fr = new FileReader(srcFile);
    BufferedReader br = new BufferedReader(fr);
    
    List<File> files = new ArrayList<>();
    
    String fileName = br.readLine();
    while(fileName != null) {
      fileName = fileName.trim();
      System.out.println("Reading " + fileName);
      
      if(!fileName.equals("")) {
        File f = new File(fileName);
        if(!f.exists()) {
          throw new RuntimeException("File " + fileName + " does not exist!");
        }
        
        files.add(f);
      }
      
      fileName = br.readLine();
    }
    
    br.close();
    
    return files;
  }
  
  
  
  
  public static String concatFileContents(List<File> files) throws Exception {
    StringBuilder sb = new StringBuilder();
    
    for(File f : files) {
      FileReader fr = new FileReader(f);
      BufferedReader br = new BufferedReader(fr);
      
      String line = br.readLine();
      while(line != null) {
        sb.append(line + "\n");
        line = br.readLine();
      }
      
      br.close();
    }
    
    return sb.toString();
  }
}

