define([
  'jquery',
  'underscore', 
  'moment'
], function($, _, moment) {
  var DateTime = {
    fromDateTimeToDDMMYYYY : function(datetime) {
      if(_.isEmpty(datetime)) return null ;
      return moment(datetime, "DD/MM/YYYY HH:mm:ss ZZ").format('DD/MM/YYYY') ;
    },
    fromDateTimeToMMYYYY : function(datetime) {
        if(_.isEmpty(datetime)) return null ;
        return moment(datetime, "DD/MM/YYYY HH:mm:ss ZZ").format('MM/YYYY') ;
      },
    
    fromDDMMYYYYToDateTime : function(date) {
      if(_.isEmpty(date)) return null ;
      return date + ' 00:00:00 GMT+0700'
    },
    
    fromDateTimeToDDMMYYYYHHmmss : function(datetime) {
        if(_.isEmpty(datetime)) return null ;
        return moment(datetime, "DD/MM/YYYY HH:mm:ss ZZ").format('DD/MM/YYYY HH:mm:ss') ;
    },
    
    fromDateTimeToYYYY : function(datetime) {
        if(_.isEmpty(datetime)) return null ;
        return moment(datetime, "DD/MM/YYYY HH:mm:ss ZZ").format('YYYY') ;
    },
    
    fromDateTimeToMM : function(datetime) {
        if(_.isEmpty(datetime)) return null ;
        return moment(datetime, "DD/MM/YYYY HH:mm:ss ZZ").format('MM') ;
    },
    fromDateTimeToDD : function(datetime) {
        if(_.isEmpty(datetime)) return null ;
        return moment(datetime, "DD/MM/YYYY HH:mm:ss ZZ").format('DD') ;
    },
    
    formatDateSql : function(d) {
      var month = d.getMonth()+1;
      if(month.length=1){
        month = "0"+month;
      }
      return "'"+d.getFullYear()+"-"+month+"-"+d.getUTCDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"'";
    },
    
    parseDate: function(stringDate) {
    	return moment(stringDate, "DD/MM/YYYY HH:mm:ss ZZ").toDate();
    },
    
    getCurrentDate : function(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss') + ' GMT+0700';
      },
    
    getCurrentDate : function() {
      return moment(new Date()).format('DD/MM/YYYY HH:mm:ss') + ' GMT+0700';
    }
  };
  return DateTime ;
});