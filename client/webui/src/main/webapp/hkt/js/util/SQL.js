define([
  'jquery', 
], function($) {
  var SelectQuery = function(template) {
    $.extend(this, template) ;
    
    this.fieldPrepend = function(field) {
      if($.isArray(field)) this.fields = field.concat(this.fields) ;
      else this.fields.unshift(field) ;
    };
    
    this.fieldAppend = function(field) {
      if($.isArray(field)) this.fields = this.fields.concat(field) ;
      else this.fields.push(field) ;
    };
    
    this.groupByPrepend = function(groupBy) {
      if($.isArray(groupBy)) this.groupBy = groupBy.concat(this.groupBy) ;
      else this.groupBy.unshift(groupBy) ;
    };
    
    this.groupByAppend = function(groupBy) {
      if($.isArray(groupBy)) this.groupBy = this.groupBy.concat(groupBy) ;
      else this.groupBy.push(groupBy) ;
    };
    
    this.orderByPrepend = function(orderBy) {
      if($.isArray(orderBy)) this.orderBy = orderBy.concat(this.orderBy) ;
      else this.orderBy.unshift(orderBy) ;
    };
    
    this.orderByAppend = function(orderBy) {
      if($.isArray(orderBy)) this.orderBy = this.orderBy.concat(orderBy) ;
      else this.orderBy.push(orderBy) ;
    };
  
    this.join = function(exp, param) {
      if($.isEmptyObject(param)) return ;
      exp = exp.replace(':param', param) ;
      this.joins.unshift({expression: exp }) ;
    };
  } ;
  
  var sql = {
    SelectQuery : SelectQuery
  };
  return sql ;
});