package com.hkt.module.core.script;

import java.util.HashMap;

import org.junit.Test;

public class ScriptRunnerUnitTest {
  
  @Test
  public void testScriptRunner() throws Exception {
    HashMap<String, Object> ctx = new HashMap<String, Object>() ;
    ctx.put("hello", "Hello") ;
    ScriptRunner runner = new ScriptRunner(".", ctx) ;
    runner.eval("print('ctx hello = ' +  hello)") ;
    runner.eval("print('ctx hello = ' +  JSON.stringify({name: 'Tuan'}))") ;
  }
}
