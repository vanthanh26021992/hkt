define([
  'jquery'
], function($) {
  /**@type test.Assert */
  var Assert = {
    /**@memberOf test.Assert */
    assertTrue: function(b, msg) {
      if(!b) {
        if(msg == null || msg == undefined) {
          throw new Error("expect a true value") ;
        }
        throw new Error(msg) ;
      }
    },
    
    /**@memberOf test.Assert */
    assertFalse: function(b, msg) {
      if(b) {
        if(msg == null || msg == undefined) {
          throw new Error("expect a false value") ;
        }
        throw new Error(msg) ;
      }
    },
    
    /**@memberOf test.Assert */
    assertNull: function(obj, msg) {
      if(obj != null) {
        if(msg == null || msg == undefined) {
          throw new Error("expect a null value") ;
        }
        throw new Error(msg) ;
      }
    },
    

    /**@memberOf test.Assert */
    assertNotNull: function(obj, msg) {
      if(obj == null) {
        if(msg == null || msg == undefined) {
          throw new Error("expect a non null value") ;
        }
        throw new Error(msg) ;
      }
    },
    
    /**@memberOf test.Assert */
    assertEquals: function(o1, o2, msg) {
      if(o1 !== o2) {
        if(msg == null || msg == undefined) {
          throw new Error("expect " + o1 + ", but result " + o2) ;
        }
        throw new Error(msg) ;
      }
    },
    
    /**@memberOf test.Assert */
    fail: function(msg) {
      throw new Error(msg) ;
    }
  };
  return Assert ;
});