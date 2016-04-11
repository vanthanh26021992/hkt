package com.hkt.module.config.generic;

import org.springframework.stereotype.Component;

@Component
public class LocaleOptionGroupPlugin extends OptionGroupPlugin {
  public OptionGroup[] getOptionGroups() throws Exception {
    String[] resPath = {
      "classpath:config/locale/certificates.json",
      "classpath:config/locale/genders.json",
      "classpath:config/locale/languages.json",
      "classpath:config/locale/marial_status.json",
      "classpath:config/locale/type_restaurant.json"
    };
    return loadOptionGroups(resPath);
  }

}
