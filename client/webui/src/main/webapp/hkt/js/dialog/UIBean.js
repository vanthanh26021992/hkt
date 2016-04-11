define([
  'jquery', 
  'underscore', 
  'backbone',
  'i18n',
  'ui/Validator',
  'text!dialog/UIBean.jtpl',
  'css!ui/UIBean.css'
], function($, _, Backbone, i18n, Validator, UIBeanTmpl) {
  
  /**
   *@type ui.UIBean 
   */
  var UIBean = Backbone.View.extend({
    
    initialize: function (options) {
      //create a clean config for each instance ;
    	this.tableId = this.randomId() ;
      this.config = $.extend(true, {}, this.config);
      this.beanStates = {} ;
      _.bindAll(this, 'render','onEditAction') ;
    },
    
    /**@memberOf ui.UIBean*/
    bind: function(name, bean, setDefault) {
      if(setDefault) {
        var beanConfig = this._getBeanConfig(name) ;
      }
      var size = Object.keys(this.beanStates).length ;
      var select = false ;
      if(size == 0) select = true ;
      this.beanStates[name] = { bean: bean, editMode: false, select: select, state: {}} ;
    },
    
    /**@memberOf ui.UIBean*/
    bindArray: function(name, array) {
      if(this.config.type != 'array') {
        throw new Error("Expect config type is array") ;
      }
      if(array.length == 0) array.push({});
      this.beanArray = array ;
      this.beanName = name ;
      for(var i = 0; i < array.length; i++) {
        this.beanStates[name + '_' + i] = { bean: array[i], editMode: false, select: false, state: {}} ;
      }
    },
    
    getBeanConfig: function(name) {
      return new BeanConfig(this.config.beans[name]) ;
    },
    
    getBeanState: function(name) {
      return this.beanStates[name] ;
    },
    
    getBean: function(name) {
      return this.beanStates[name].bean ;
    },
    
    restoreBeanState: function(beanName) {
      var beanState = this.beanStates[beanName] ;
      var bean = beanState.bean ;
      if(beanState.origin != null) {
        for(var name in bean) delete bean[name] ;
        $.extend(true, beanState.bean, beanState.origin) ;
      }
      this.render() ;
    },
    
    _template: _.template(UIBeanTmpl),
    
    render: function() {
      var params = {
        config: this.config, beanStates: this.beanStates 
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create");
    },
    
    events: {
      'click a.onEditAction': 'onEditAction'
    },
    
    onEditAction: function(evt) {
      var beanName = $(evt.target).closest("[bean]").attr('bean') ;
      var beanConfig = this._getBeanConfig(beanName) ;
      var beanState = this.beanStates[beanName] ;
      var actionName = $(evt.target).closest("a").attr("action") ;
      var actions = beanConfig.edit.actions ;
      for(var i = 0; i < actions.length; i++) {
        if(actions[i].action == actionName) {
          actions[i].onClick(this, beanConfig, beanState) ;
          return ;
        }
      }
    },
    _getBeanConfig: function(beanName) {
      if(this.config.type == 'array') {
        var idx = beanName.lastIndexOf('_');
        var configName = beanName.substring(0, idx);
        return this.config.beans[configName] ;
      } else {
        return this.config.beans[beanName]; 
      }
    },
    _validateBeanState: function(beanConfig, beanState) {
      var fields = beanConfig.fields ;
      beanState.fieldErrors = {} ;
      var hasError = false ;
      for(var i = 0; i < fields.length; i++) {
        var field = fields[i].field ;
        var value = beanState.bean[field];
        var validator = fields[i].validator ;
        if(validator == null) continue ;
        if(Validator[validator.name] != undefined) {
          var validate = Validator[validator.name] ;
          try {
            if (value instanceof Array) {
              for(var j = 0; j < value.length; j++) {
                beanState.bean[field][j] = validate(validator, value[j]) ;
              }
            } else {
              beanState.bean[field] = validate(validator, value) ;
            }
          } catch(err) {
            beanState.fieldErrors[field] = err ;
            hasError = true ;
          }
        } else {
          throw new Error("Unknown validator " + validator) ;
        }
      }
      return !hasError ;
    },
    
    randomId: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ ) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
  });
  
  return UIBean ;
});