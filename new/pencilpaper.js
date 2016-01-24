var PencilPaper = (function() {
  "use stict";
  
  function elementsIntersect(a, b) {
    var rect1 = a.getBoundingClientRect();
    var rect2 = b.getBoundingClientRect();
    return (rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
  };

  var pp = function(element) {
    this._element = element;
    element.style.overflow = 'hidden';
    //element.style.cssText = '';
    
    this.factories = [];

    this.containers = [];
    for(var i = 0; i < 3; i++) {
      var div = document.createElement('div');
      
      //div.innerHTML = 'el-' + i;
      //div.style.backgroundColor = ['#f00', '#0f0', '#00f'][i];
      
      div.className = 'depth-' + i;
      //div.style.opacity = (10 - i) / 10;
      div.style.position = 'absolute';
      div.style.width = 10;
      div.style.height = 10;
      div.style.top = 0;
      div.style.left = 0;
      div.style.zIndex = 100 - 20 * i;
      element.appendChild(div);
      this.containers.push(div);
    }
    
    this._pX = 0;
    this._pY = 0;
    
    this._vX = 0;
    this._vY = 0;
    this._vY = 0;
  };
  pp._density = 0.05; // per 100 px
  
  pp.prototype._setPosition = function(x, y) {
    for (var i = 0; i < this.containers.length; i++) {
      var container = this.containers[i];
      container.style.left = container.style.zIndex * x + 'px';
      container.style.top = container.style.zIndex * y + 'px';
    }
  };
  
  pp.prototype._tick = function(delta) {
    var dX = this._vX / 10;
    var dY = this._vY / 10;
    
    var area = Math.abs(dX * this._element.clientWidth + dY * this._element.clientHeight);
    //console.log(area);
    if (Math.random() < area * pp._density)
      this._addElement();
    
    this._pX += dX
    this._pY += dY
    
    this._setPosition(this._pX, this._pY);
  };
  
  pp.prototype._makeElement = function() {
    if (!this.factories.length)
      return null;
    var factory = this.factories[Math.floor(Math.random() * this.factories.length)];
    var newEl = factory();
    newEl.style.position = 'absolute';
    return newEl;
  };
  
  pp.prototype._addElement = function() {
    console.log('adding');
    var container = this.containers[Math.floor(Math.random() * this.containers.length)];
    var newEl = this._makeElement();
    container.appendChild(newEl);
    
    var minY = -parseInt(container.style.top.substring(-2), 10);
    var minX = -parseInt(container.style.left.substring(-2), 10);
    
    var width = this._element.clientWidth + newEl.clientWidth * 4;
    var height = this._element.clientHeight + newEl.clientHeight * 4;

    outer:
    for(var k = 0; k < 10; k++) { // try 10 times
      newEl.style.top = minY + Math.floor(height * Math.random()) + 'px';
      newEl.style.left = minX + Math.floor(width * Math.random()) + 'px';

      for (var j = 0; j < container.childNodes.length; j++) {
        if (elementsIntersect(container.childNodes[j], newEl))
          continue outer;
      }
      return; //success
    }
    container.removeChild(newEl); //failure
  };
  
  pp.prototype._addElements = function(count) {
    count = count|0;
    outerOuter:
    for (var i = 0; i < count; i++)
      this._addElement();
  };
  
  pp.prototype._mouseMove = function(mx, my) {
    var elementHeight = this._element.clientHeight;
    var elementWidth = this._element.clientWidth;
    var elementRect = this._element.getBoundingClientRect();
    var elementX = elementRect.left;
    var elementY = elementRect.top;
    
    this._vX = (elementX - mx) / elementWidth + 0.5;
    this._vY = (elementY - my) / elementHeight + 0.5;
  };

  pp.prototype.start = function() {
    
    var elementSize = this._element.clientHeight * this._element.clientWidth / 10000;
    this._addElements(elementSize * pp._density);
    /*for (var i = 0; i < pp._density * elementSize; i++) {
      var newEl = this._makeElement();
      newEl.style.top = Math.round(this._element.clientHeight * Math.random()) + 'px';
      newEl.style.left = Math.round(this._element.clientWidth * Math.random()) + 'px';
      
      this.containers[Math.floor(Math.random() * this.containers.length)].appendChild(newEl);
    }*/
      
    
    this._element.onmousemove = function(e) {
      this._mouseMove(e.clientX, e.clientY);
    }.bind(this);
    this._setPosition(2, 2);
    
    var loop = function() {
      this._tick();
      setTimeout(loop, 10);
    }.bind(this);
    loop();
  };
  
  pp.prototype.addFactory = function(func) {
    this.factories.push(func);
  };

  return pp;
})();