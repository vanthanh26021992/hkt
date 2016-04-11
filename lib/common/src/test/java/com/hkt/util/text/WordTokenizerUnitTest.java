package com.hkt.util.text;

import java.io.IOException;

import org.junit.Assert;
import org.junit.Test;

public class WordTokenizerUnitTest {
  @Test
  public void test() throws IOException {
    verify("this is a test", "this", "is", "a", "test") ;
    verify("HktConsultant@yahoo.com.vn", "HktConsultant@yahoo.com.vn") ;
  }
  
  private void verify(String text, String ... expectToken) {
    Assert.assertArrayEquals(expectToken, new WordTokenizer(text).allTokens()) ;
  }
}
