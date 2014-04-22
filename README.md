javascript
==========

var View = jsa.Class({
   initialize: function() {
      
   },
   show: function() {
   
   }
});

var Child = View.extend({
  initialize: function(){
    this.callParent();
  },
  show: function() {
    this.callParent();
  }
});

// or 

var Child = jsa.Class({
  $extend: View,
  initialize: function(){
    this.callParent();
  },
  show: function() {
    this.callParent();
  }
});

var child = new Child();
  
