document.observe('dom:loaded', function(){
  Footnotes.initialize(this);
});

Element.addMethods({
  fitOnScreen: function(element, pos, offset){
    element = $(element);
    offset  = Object.extend({
      top:  0,
      left: 0
    }, offset || {});
    
    var dimensions      = element.getDimensions(),
        docDimensions   = document.viewport.getDimensions(),
        docScrollOffset = document.viewport.getScrollOffsets();
        
    var left = pos.left + offset.left;
    if (left + dimensions.width > docDimensions.width + docScrollOffset.left){
      left = docDimensions.width - dimensions.width + docScrollOffset.left - offset.left;
    }
    
    var top = pos.top + offset.top;
    if (top + dimensions.height > docDimensions.height + docScrollOffset.top){
      top = pos.top - dimensions.height - offset.top;
    }
    
    return element.setStyle({
      top:  top + "px",
      left: left + "px"
    });
  }
});

var Footnotes = (function(){
  var timeout     = null,
      noteDiv     = null,
      hideDiv     = null,
      hideOptions = { style: 'opacity:0', duration: 0.6, after: clear };
      
  function over(){
    clearTimeout(timeout);
    clear();
    
    var id  = this.getAttribute('href').substr(1); 
    
    noteDiv = new Element('div', {className: 'footnote'});
    noteDiv.observe('mouseover', overDiv);
    noteDiv.observe('mouseout', out);
    noteDiv.update($(id).innerHtml);
    noteDiv.setStyle({
        position:'absolute',
        width:'400px',
        opacity:0.9
    });
    
    document.body.appendChild(noteDiv);

    noteDiv.fitOnScreen(this.comutativeOffset(), {top: 20});
  }
  
  function overDiv(){
    clearTimeout(timeout);
    if (hideDiv){
      hideDiv.stop();
      noteDiv.setOpacity(0.9);
    }
  }
  
  function clear(){
    if (noteDiv){
      noteDiv.remove();
      noteDive = null;
    }
    if (hideDiv){
      hideDiv.stop();
      hideDiv = null;
    }
  }
  
  function out(){
    timeout = function(){ hideDiv = new S2.FX.Morph(noteDiv, hideOptions); }.delay(0.1);
  }
      
  return {
    initialize: function(element){
      element = $(element);
      element.on("mouseover", "a[rel='footnote']", over);
      element.on("mouseout", "a[rel='footnote']",  out);
    }
  }
});
