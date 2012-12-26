var POP = {
  isOnMobile: (function(){
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('android') > -1 || ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;
  })(),

  requestAnimFrame: (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback) { window.setTimeout(callback, 1000 / 60); };
  })()
};

POP.Game =  function(canvas, width, height) {
  this.width  = width;
  this.height = height;
  this.canvas = canvas;

  this.score = {
    taps:     0,
    hit:      0,
    escaped:  0,
    accuracy: 0
  };

  this.draw  = new POP.Draw(this.canvas.getContext('2d'));
  this.input = new POP.Input();

  this.nextBubble = 100;
  this.entities = [new POP.Waves(this.width)];

  this.resize();
  this.loop();

  var input = this.input;
  window.addEventListener('click', function(e) {
      input.set(e);
  }, false);

  window.addEventListener('touchstart', function(e) {
      input.set(e.touches[0]);
  }, false);

  var self = this;
  window.addEventListener('resize', function(e) {
    self.resize()
  }, false);

  ['click', 'touchstart', 'touchmove', 'touchend'].forEach(function(eventName) {
    window.addEventListener(function(e){ e.preventDefault(); }, false);
  });
};

POP.Game.prototype = {
  resize: function() {
    var currentHeight = window.innerHeight,
        currentWidth  = currentHeight * (this.width / this.height);

    if (POP.isOnMobile) {
      document.body.style.height = (currentHeight + 50) + 'px';
    }

    this.canvas.width        = this.width;
    this.canvas.height       = this.height;
    this.canvas.style.width  = currentWidth + 'px';
    this.canvas.style.height = currentHeight + 'px';

    this.input.setField(this.canvas);

    window.setTimeout(function() { window.scrollTo(0,1); }, 1);
  },

  update: function() {
    var checkCollision = false;

    this.nextBubble -= 1;

    if (this.nextBubble < 0) {
      this.entities.push(new POP.Bubble(this.width, this.height));
      this.nextBubble = ( Math.random() * 100 ) + 100;
    }

    if (this.input.tapped) {
      this.score.taps += 1;
      this.entities.push(new POP.Touch(this.input.x, this.input.y));
      this.input.tapped = false;
      checkCollision = true;
    }

    for (var i = 0; i < this.entities.length; i += 1) {
      var entity = this.entities[i];

      entity.update();

      if (entity.collides) {
        if (checkCollision) {
          if (entity.collides(this.input)) {
            for (var n = 0; n < 5; n +=1 ) {
              this.entities.push(new POP.Particle(entity.x, entity.y, 2));
            }
            this.score.hit += 1;
            entity.remove = true;
          }
        } else {
          if (entity.remove) {
            this.score.escaped += 1;
          }
        }
      }


      if (entity.remove) {
          this.entities.splice(i, 1);
      }
    }

    this.score.accuracy = this.score.taps == 0 ? 0 : ~~((this.score.hit/this.score.taps) * 100);
  },

  render: function() {
    this.draw.rect(0, 0, this.width, this.height, '#036');

    for (var i = 0, l = this.entities.length; i < l; i += 1) {
      this.entities[i].renderTo(this.draw);
    }

    this.draw.text('Hit: ' + this.score.hit, 20, 30, 14, '#fff');
    this.draw.text('Escaped: ' + this.score.escaped, 20, 50, 14, '#fff');
    this.draw.text('Accuracy: ' + this.score.accuracy + '%', 20, 70, 14, '#fff');
  },

  loop: function() {
    POP.requestAnimFrame.call(window, this.loop.bind(this));
    this.update();
    this.render();
  }
};

POP.Draw = function(ctx) {
  this.ctx = ctx;
};

POP.Draw.prototype = {
  rect: function(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  },
  circle: function(x, y, r, col) {
    this.ctx.fillStyle = col;
    this.ctx.beginPath();
    this.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
  },
  text: function(string, x, y, size, col) {
    this.ctx.font = 'bold ' + size + 'px Monospace';
    this.ctx.fillStyle = col;
    this.ctx.fillText(string, x, y);
  }
};

POP.Input = function() {
  this.x       = 0;
  this.y       = 0;
  this.r       = 7;
  this.tapped  = false;
  this.scale   = 1;
  this.offsetX = 0;
  this.offsetY = 0;
};

POP.Input.prototype = {
  set: function(data) {
    this.x = (data.pageX - this.offsetX) / this.scale;
    this.y = (data.pageY - this.offsetY) / this.scale;
    this.tapped = true;
  },

  setField: function(field) {
    this.scale   = (parseInt(field.style.width, 10 || 0)) / field.width;
    this.offsetX = field.offsetLeft;
    this.offsetY = field.offsetTop;
  }
};

POP.Waves = function(fieldWidth) {
  this.total = Math.ceil(fieldWidth / this.r) + 1;
  this.offset = 0;
}

POP.Waves.prototype = {
  x: -25,
  y: -40,
  r: 50,

  update: function() {
    this.offset = Math.sin(new Date().getTime() * 0.0016) * 5;
  },

  renderTo: function(draw) {
    for (var i = 0, l = this.total; i < l; i += 1) {
      draw.circle(this.x + this.offset +  (i * this.r), this.y, this.r, '#fff');
    }
  }
}

POP.Touch = function(x, y) {
  this.x       = x;
  this.y       = y;
  this.opacity = 1;
};

POP.Touch.prototype = {
  remove: false,

  r:      5,
  fade:   0.5,

  update: function() {
    this.opacity -= this.fade;
    this.remove   = this.opacity < 0;
  },

  renderTo: function(draw) {
    draw.circle(this.x, this.y, this.r, 'rgba(255,0,0,' + this.opacity + ')');
  }
};

POP.Bubble = function(fieldWidth, fieldHeight) {
  this.r      = (Math.random() * 20) + 10;
  this.speed  = (Math.random() * 3) + 1;

  this.x = (Math.random() * (fieldWidth) - this.r);
  this.y = fieldHeight + (Math.random() * 100) + 100;

  this.waveSize  = 5 + this.r;
  this.xConstant = this.x;
};

POP.Bubble.prototype = {
  remove: false,

  update: function() {
    var time = new Date().getTime() * 0.002;

    this.y -= this.speed;
    this.x  = this.waveSize * Math.sin(time) + this.xConstant;

    if (this.y < -10) {
      this.remove = true;
    }
  },

  collides: function(target) {
    var distanceSquared = Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2),
        radiiSquared    = Math.pow(this.r + target.r, 2);

    return distanceSquared < radiiSquared;
  },

  renderTo: function(draw) {
    draw.circle(this.x, this.y, this.r, 'rgba(255,255,255,1)');
  }
};

POP.Particle = function(x, y, r, opacity) {
  this.x   = x;
  this.y   = y;
  this.r   = r;
  this.col = 'rgba(255,255,255,' + (Math.random() * 1) + ')';
  this.vx  = ~~(Math.random() * 4) * (Math.random() * 2 > 1 ? 1 : -1);
  this.vy  = ~~(Math.random() * 7);
};

POP.Particle.prototype = {
  remove: false,

  update: function() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx = this.vx * 0.99;
    this.vy = this.vy * 0.99 - 0.25;

    if (this.y < 0) {
      this.remove = true;
    }
  },

  renderTo: function(draw) {
    draw.circle(this.x, this.y, this.r, this.col);
  }
};

new POP.Game(document.getElementsByTagName('canvas')[0], 320, 480);
