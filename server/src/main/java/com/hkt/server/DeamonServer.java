package com.hkt.server;

import java.io.FileOutputStream;
import java.io.PrintStream;

import com.hkt.server.http.JettyWebServer;


public class DeamonServer  {
  static PrintStream pout, perr ;
  static JettyWebServer httpServer ;
  
  static public void start() throws Exception {
    String appDir = System.getProperty("app.dir") ;
    appDir = appDir.replace('\\', '/') ;
    String logDir = appDir + "/logs" ;
    if(!FileUtil.exist(logDir)) {
      FileUtil.mkdirs(logDir);
    }
    pout = new PrintStream(new FileOutputStream(logDir + "/stdout.log")) ;
    perr = new PrintStream(new FileOutputStream(logDir + "/stderr.log")) ;
    System.setOut(pout);
    System.setErr(perr);
    System.out.println("Start Service!!!") ;
    if(httpServer == null) {
      httpServer = new JettyWebServer(appDir + "/webapps", 8080) ;
      httpServer.start(); 
    }
  }

  static public void stop() throws Exception {
    System.out.println("Stop Service!!!") ;
    if(httpServer != null) {
      httpServer.stop() ; 
    }
    if(pout != null) {
      pout.close() ; 
      perr.close() ; 
    }
  }
  

  static public void main(String[] args)  {
    try {
      if ("start".equals(args[0])) {
        start();
      } else if ("stop".equals(args[0])) {
        stop() ;
      }
    } catch(Exception ex) {
      ex.printStackTrace(); 
    }
    System.out.println("Run service command: " + args[0]);
  }
}