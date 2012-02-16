jQuery.fn.deleteData = function(key){
  var data = this.data(key);
  this.removeData(key);
  return data;
};

(function(){
  
  function smooth(a1, a2, b1, b2) {
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b == 0 ) {
      // parallel
      return false;
    }

    var ua = ua_t / u_b;
    var ub = ub_t / u_b;

    if (ua > 6 || ua < -6 || ub > 6 || ub < -6) {
      // intersection point too far from surrounding points; use average
      return false
    }

    // find intersection point
    var x = a1.x + ua * (a2.x - a1.x);
    var y = a1.y + ua * (a2.y - a1.y);

    // average with surrounding points
    x = (x + x + a2.x + b1.x) / 4;
    y = (y + y + a2.y + b1.y) / 4;

    return {x: x, y: y};
  }

  function nearby(a, b) {
    return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
  }

  function nearbyPoints(original){
    var points = [original[0]];
    
    for (var i = 1, l = original.length-1; i < l; i++) {
      if (!nearby(points[points.length-1], original[i])) {
        points.push(original[i])
      }
    }
    points.push(original[original.length-1]);
    
    return points;
  }

  jQuery.fn.initStroke = function(e){
    this.data("stroke", []);
    this.data("pixels", this[0].getContext("2d").getImageData(0, 0, this.width(), this.height()));

    return this;
  };

  jQuery.fn.addStroke = function(e){
    var offset = this.offset();

    this.data("stroke").push({
      x: e.pageX - offset.left,
      y: e.pageY - offset.top
    });

    return this;
  };

  jQuery.fn.isDrawing = function(){
    return this.data("stroke") != null;
  };

  jQuery.fn.drawStroke = function(){
    var stroke = this.data("stroke"),
        size   = stroke.length;

    return this.drawLine(stroke[size - 2], stroke[size - 1]);
  };

  jQuery.fn.drawLine = function(from, to){
    var context = this[0].getContext("2d");

    context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();

    return this;
  };

  jQuery.fn.smoothStrokes = function(){  
    var context = this[0].getContext("2d"),
        points  = nearbyPoints(this.deleteData("stroke"));

    context.putImageData(this.deleteData("pixels"), 0, 0);

    context.strokeStyle = "#000";
    var control;
    for (i=0; i<points.length-1; i++) {
      context.beginPath();
      context.moveTo(points[i].x, points[i].y);
      if (i < 2 || i > points.length-3) {
        context.lineTo(points[i+1].x, points[i+1].y);
      } else {
        control = smooth(points[i-1], points[i], points[i+1], points[i+2]);
        if (!control) {
          context.lineTo(points[i+1].x, points[i+1].y);
        } else {
          context.quadraticCurveTo(control.x, control.y, points[i+1].x, points[i+1].y);
        }
      }
      context.stroke();
    }
    context.stroke();
  };

  function mouseDown(e) {
    $(this).initStroke().addStroke(e);
  }

  function mouseUp(e) {
    $(this).addStroke(e).smoothStrokes();
  }

  function mouseMove(e) {
    if ($(this).isDrawing()) {
      $(this).addStroke(e).drawStroke();
    }
  }

  var canvases = $("canvas");

  canvases.live('mousedown', mouseDown);
  canvases.live('mouseup',   mouseUp);
  canvases.live('mouseout',  mouseUp);
  canvases.live('mousemove', mouseMove);
  
  canvases.each(function(){
    var parent  = $(this).parent(),
        width   = parent.width(),
        height  = parent.height(),
        context = this.getContext("2d");

    this.width  = width;
    this.height = height;

    context.lineWidth   = 3;
    context.fillStyle   = "rgba(0,0,0,0)";
    context.lineCap     = "round";
    context.strokeStyle = "#000";
    context.fillRect(0, 0, width, height);
  });
})();
