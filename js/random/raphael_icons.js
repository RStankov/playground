// <icon path="M5.665,16.618 5.667,16.618 8.832,14.172 13.88,20.707 24.917,6.423 28.081,8.869 13.878,27.248 5.665,16.618" width="32" height="32" />
// <icon name="check" width="32" height="32" />
// <span class="icon" data-name="" data-path="" data-width="" date-height=""></span>
// http://raphaeljs.com/icons/

Taskar.Icons = {
  Paths: {
    check: "M5.665,16.618 5.667,16.618 8.832,14.172 13.88,20.707 24.917,6.423 28.081,8.869 13.878,27.248 5.665,16.618"
  },
  Defaults: {
    width:  32,
    height: 32,
    path:   "M5.665,16.618 5.667,16.618 8.832,14.172 13.88,20.707 24.917,6.423 28.081,8.869 13.878,27.248 5.665,16.618"
  },
  draw: function(element){
    var icons = Taskar.Icons;
    Raphael(element, element.getAttribute("width") || icons.Defaults.width, element.getAttribute("height") || icons.Defaults.height)
		  .rect(0, 0, 32, 32)
		  .path(element.getAttribute('path') || icons.Paths[element.getAttribute('name')] || icons.Defaults.path)
		  .attr({fill: "#333", stroke: "none"});
  }
};

CD3.Behaviors({ 'icon': Taskar.Icons.draw });

var Icons = (function(){
  Icons = {
    Paths: {
      check: "M5.665,16.618 5.667,16.618 8.832,14.172 13.88,20.707 24.917,6.423 28.081,8.869 13.878,27.248 5.665,16.618"
    },
    Defaults: {
      width:  32,
      height: 32,
      path:   "M5.665,16.618 5.667,16.618 8.832,14.172 13.88,20.707 24.917,6.423 28.081,8.869 13.878,27.248 5.665,16.618"
    },
    draw: function(element){
      Raphael(element, element.getAttribute("width") || Icons.Defaults.width, element.getAttribute("height") || Icons.Defaults.height)
  		  .rect(0, 0, 32, 32)
  		  .path(element.getAttribute('path') || Icons.Paths[element.getAttribute('name')] || Icons.Defaults.path)
  		  .attr({fill: "#333", stroke: "none"});
    }
  }
  return Icons;
})();