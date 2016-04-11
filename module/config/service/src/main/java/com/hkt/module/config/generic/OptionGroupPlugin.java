package com.hkt.module.config.generic;

import java.io.IOException;

import com.hkt.util.IOUtil;
import com.hkt.util.json.JSONSerializer;

abstract public class OptionGroupPlugin {
  abstract public OptionGroup[] getOptionGroups() throws Exception ;

  protected OptionGroup[] loadOptionGroups(String[] resPath) throws IOException {
    OptionGroup[] optGroups = new OptionGroup[resPath.length] ;
    for(int i = 0; i < resPath.length; i++) {
      String json = IOUtil.loadResAsString(resPath[i]) ;
      optGroups[i] = JSONSerializer.INSTANCE.fromString(json, OptionGroup.class) ;
    }
    return optGroups ;
  }
}
