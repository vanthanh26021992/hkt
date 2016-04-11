package com.hkt.client.web.rest;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hkt.module.account.AccountService;
import com.hkt.module.account.entity.Account;
import com.hkt.module.config.webui.UIConfigService;
import com.hkt.module.core.rest.Request;
import com.hkt.module.core.rest.Response;
import com.hkt.module.core.rest.RestService;
import com.hkt.util.IOUtil;
import com.hkt.util.json.JSONSerializer;

@org.springframework.stereotype.Controller
@RequestMapping("/")
public class Controller {
  private List<ServiceDescription> services = new ArrayList<ServiceDescription>() ;
  
  @Autowired
  private  ServletContext sContext;
  
  @Autowired
  private RestService service;
  
  @Autowired
  private AccountService accService ;
  
  @Autowired
  private UIConfigService uiConfigService ;
  
  private WebAppConfig config ;
  
  
  @PostConstruct 
  public void onInit() throws Exception {
    InputStream is= sContext.getResourceAsStream("/hkt/config/webapp.json");
    String json = IOUtil.getStreamContentAsString(is, "UTF-8") ;
    config = JSONSerializer.INSTANCE.fromString(json, WebAppConfig.class) ;
    uiConfigService.setUIConfigTemplate(config.getWebuiConfig()) ;
  }
  
  @RequestMapping(value="help", method=RequestMethod.GET)
  public @ResponseBody List<ServiceDescription> help() {
    return services ;
  }
  
  @RequestMapping(value="add", method=RequestMethod.POST)
  public  @ResponseBody ServiceDescription add(@RequestBody ServiceDescription desc) {
    services.add(desc) ;
    return desc;
  }
  
  @RequestMapping(value="login", method=RequestMethod.POST)
  public String login(HttpServletRequest req,
                      @RequestParam(required = true) String loginId, 
                      @RequestParam(required = true) String password) throws Exception {
    Account account = accService.login(loginId, password) ;
    if(account != null) {
      ClientContext ctx = new ClientContext() ;
      ctx.setAccount(account) ;
      ctx.setWebuiConfig(uiConfigService.getUIConfig(loginId)) ;
      ClientContext.set(req, ctx) ;
      System.out.println("login with context " + loginId);
    } else {
      if(config.isAdmin(loginId, password)) {
        account = new Account() ;
        account.setLoginId(loginId) ;
        ClientContext ctx = new ClientContext() ;
        ctx.setAccount(account) ;
        ctx.setWebuiConfig(uiConfigService.getAdminUIConfig()) ;
        ClientContext.set(req, ctx) ;
        System.out.println("login with admin context " + loginId);
      } else {
        ClientContext.set(req, null) ;
        return "redirect:../hkt/login.html" ;
      }
    }
    return "redirect:../hkt/index.html" ;
  }
  
  @RequestMapping(value="getClientContext", method=RequestMethod.GET)
  public @ResponseBody ClientContext getClientContext(HttpServletRequest req)  {
    ClientContext ctx =  ClientContext.get(req) ;
    return ctx ;
  }
  
  @RequestMapping(value="updateClientContext", method=RequestMethod.GET)
  public @ResponseBody ClientContext updateClientContext(HttpServletRequest req,
                                                         @RequestParam String name,
                                                         @RequestParam String value)  {
    ClientContext ctx =  ClientContext.get(req) ;
    if(ctx == null) return null ;
    if("language".equals(name)) ctx.getWebuiConfig().setLanguage(value) ;
    return ctx ;
  }
  
  @RequestMapping(value="get", method=RequestMethod.GET)
  public @ResponseBody Response get(@RequestParam String req) throws UnsupportedEncodingException {
    Request request = null ;
    try {
      request = JSONSerializer.INSTANCE.fromString(URLDecoder.decode(req, "UTF-8"), Request.class) ;
    } catch (IOException e) {
      Response response = new Response() ;
      response.setException(e.getMessage()) ;
      return response ;
    }
    return service.dispatch(request) ;
  }
  
  @RequestMapping(value="post", method=RequestMethod.POST)
  public  @ResponseBody Response post(@RequestBody Request request) {
    return service.dispatch(request) ;
  }
}