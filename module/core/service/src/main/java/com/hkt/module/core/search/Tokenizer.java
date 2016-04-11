package com.hkt.module.core.search;

import com.hkt.util.text.WordTokenizer;

public class Tokenizer {
  final static public Tokenizer DEFAULT = new Tokenizer() ;
  
  public String[] tokenize(String text) {
    if(text == null) return new String[0] ;
    return new WordTokenizer(text, WordTokenizer.INDEX_TOKEN_SEPARATOR).allTokens() ;
  }
  
  final static public String normalize(String token) {
    StringBuilder b = new StringBuilder() ;
    char[] buf = token.toCharArray() ;
    for(int j = 0; j < buf.length; j++) {
      if(buf[j] == ' ' || buf[j] == ':' || buf[j] == '=' || buf[j] == '-') b.append('.') ;
      else b.append(Character.toLowerCase(buf[j])) ;
    }
    return b.toString() ;
  }
  
  final static public String[] normalize(String[] token) {
    if(token.length == 0) return token ;
    StringBuilder b = new StringBuilder() ;
    for(int i = 0; i < token.length; i++) {
      b.setLength(0) ;
      char[] buf = token[i].toCharArray() ;
      for(int j = 0; j < buf.length; j++) {
        if(buf[j] == ' ' || buf[j] == ':' || buf[j] == '=') b.append('_') ;
        else b.append(Character.toLowerCase(buf[j])) ;
      }
      token[i] = b.toString();
    }
    return token ;
  }
}