javascript
==========

var View = jsa.Class({
   initialize: function() {
      
   },
   show: function(name) {
&nbsp;&nbsp;&nbsp;&nbsp;alert(name);
   }
});

var Child = View.extend({<br>
&nbsp;&nbsp;initialize: function(){<br>
&nbsp;&nbsp;&nbsp;&nbsp;this.callParent();<br>
&nbsp;&nbsp;},<br>
&nbsp;&nbsp;show: function(name) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;this.callParent(name);<br>
&nbsp;&nbsp;}<br>
});<br>
<br>
// or<br> 
<br>
var Child = jsa.Class({<br>
&nbsp;&nbsp;$extend: View,<br>
&nbsp;&nbsp;initialize: function(){<br>
&nbsp;&nbsp;&nbsp;&nbsp;this.callParent();<br>
&nbsp;&nbsp;},<br>
&nbsp;&nbsp;show: function(name) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;this.callParent(name);<br>
&nbsp;&nbsp;}<br>
});<br>
<br>
var child = new Child();<br>
child.show('hello');

  
