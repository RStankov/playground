window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

var POP = {
  WIDTH:          320,
  HEIGHT:         480,
  scale:          1,
  offset:         {top: 0, left: 0},
  entities:       [],
  nextBubble:     100,
  canvas:         null,

  score: {
    taps:     0,
    hit:      0,
    escaped:  0,
    accuracy: 0
  },

  isOnMobile: (function(){
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('android') > -1 || ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;
  })(),

  init: function(canvas) {
    this.canvas = canvas;
    this.draw   = new POP.Draw(this.canvas.getContext('2d'));
    this.wave = {
        x: -25,     // x coord of first circle
        y: -40,     // y coord of first circle
        r: 50,      // circle radius
        time: 0,    // we'll use this in calculating the sine wave
        offset: 0   // this will be the sine wave offset
    };
    this.wave.total = Math.ceil(POP.WIDTH / this.wave.r) + 1;

    var input = this.input = new POP.Input(this);

    this.resize();
    this.loop();

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
  },

  resize: function() {
    var currentHeight = window.innerHeight,
        currentWidth  = currentHeight * (POP.WIDTH / POP.HEIGHT);

    if (this.isOnMobile) {
      document.body.style.height = (currentHeight + 50) + 'px';
    }

    this.canvas.width        = POP.WIDTH;
    this.canvas.height       = POP.HEIGHT;
    this.canvas.style.width  = currentWidth + 'px';
    this.canvas.style.height = currentHeight + 'px';

    this.scale       = currentWidth / POP.WIDTH;
    this.offset.top  = this.canvas.offsetTop;
    this.offset.left = this.canvas.offsetLeft;

    window.setTimeout(function() { window.scrollTo(0,1); }, 1);
  },
  // this is where all entities will be moved
  // and checked for collisions etc
  update: function() {
    var checkCollision = false;

    this.nextBubble -= 1;

    if (this.nextBubble < 0) {
      this.entities.push(new POP.Bubble());
      this.nextBubble = ( Math.random() * 100 ) + 100;
    }

    if (this.input.tapped) {
      this.score.taps += 1;
      this.entities.push(new POP.Touch(this.input.x, this.input.y));
      this.input.tapped = false;
      checkCollision = true;
    }

    for (var i = 0; i < this.entities.length; i += 1) {
      this.entities[i].update();

      if (checkCollision && this.entities[i].type === 'bubble') {
        var hit = this.collides(this.entities[i], {x: this.input.x, y: this.input.y, r: 7});
        if (hit) {
          for (var n = 0; n < 5; n +=1 ) {
            this.entities.push(new POP.Particle( this.entities[i].x, this.entities[i].y, 2, 'rgba(255,255,255,'+Math.random()*1+')'));
          }
          this.score.hit += 1;
        }

        this.entities[i].remove = hit;
      }

      if (this.entities[i].remove) {
          this.entities.splice(i, 1);
      }
    }

    // update wave offset
    // feel free to play with these values for
    // either slower or faster waves
    this.wave.time = new Date().getTime() * 0.002;
    this.wave.offset = Math.sin(this.wave.time * 0.8) * 5;

    // calculate accuracy
    this.score.accuracy = (this.score.hit / this.score.taps) * 100;
    this.score.accuracy = isNaN(this.score.accuracy) ?  0 : ~~(this.score.accuracy); // a handy way to round floats
  },
  render: function() {
      this.draw.rect(0, 0, this.WIDTH, this.HEIGHT, '#036');

      var i,l;

      for (i = 0, l = this.wave.total; i < l; i += 1) {
        this.draw.circle(this.wave.x + this.wave.offset +  (i * this.wave.r), this.wave.y, this.wave.r, '#fff');
      }

      for (i = 0, l = this.entities.length; i < l; i += 1) {
        this.entities[i].renderTo(this.draw);
      }

      this.draw.text('Hit: ' + this.score.hit, 20, 30, 14, '#fff');
      this.draw.text('Escaped: ' + this.score.escaped, 20, 50, 14, '#fff');
      this.draw.text('Accuracy: ' + this.score.accuracy + '%', 20, 70, 14, '#fff');
  },
  loop: function() {
      requestAnimFrame(this.loop.bind(this));
      this.update();
      this.render();
  },
  collides: function(a, b) {
    var distance_squared = ( ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
    var radii_squared = (a.r + b.r) * (a.r + b.r);

    return distance_squared < radii_squared;
  }
};

POP.Draw = function(ctx) {
  this.ctx = ctx;
};

POP.Draw.prototype = {
  clear: function() {
    this.ctx.clearRect(0, 0, POP.WIDTH, POP.HEIGHT);
  },
  rect: function(x, y, w, h, col) {
    this.ctx.fillStyle = col;
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

POP.Input = function(game) {
  this.x      = 0;
  this.y      = 0;
  this.tapped = false;
  this.game   = game;
};

POP.Input.prototype.set = function(data) {
  this.x = (data.pageX - this.game.offset.left) / this.game.scale;
  this.y = (data.pageY - this.game.offset.top) / this.game.scale;
  this.tapped = true;
};

POP.Touch = function(x, y) {
  this.type = 'touch';    // we'll need this later
  this.x = x;             // the x coordinate
  this.y = y;             // the y coordinate
  this.r = 5;             // the radius
  this.opacity = 1;       // inital opacity. the dot will fade out
  this.fade = 0.05;       // amount by which to fade on each game tick
  // this.remove = false;    // flag for removing this entity. POP.update
                          // will take care of this

  this.update = function() {
    // reduct the opacity accordingly
    this.opacity -= this.fade;
    // if opacity if 0 or less, flag for removal
    this.remove = (this.opacity < 0) ? true : false;
  };

  this.renderTo = function(draw) {
    draw.circle(this.x, this.y, this.r, 'rgba(255,0,0,'+this.opacity+')');
  };
};

POP.Bubble = function() {
  this.type = 'bubble';
  this.r = (Math.random() * 20) + 10;
  this.speed = (Math.random() * 3) + 1;

  this.x = (Math.random() * (POP.WIDTH) - this.r);
  this.y = POP.HEIGHT + (Math.random() * 100) + 100;

  // the amount by which the bubble
  // will move from side to side
  this.waveSize = 5 + this.r;
  // we need to remember the original
  // x position for our sine wave calculation
  this.xConstant = this.x;

  this.remove = false;

  this.update = function() {
    // a sine wave is commonly a function of time
    var time = new Date().getTime() * 0.002;

    this.y -= this.speed;
    // the x coord to follow a sine wave
    this.x = this.waveSize * Math.sin(time) + this.xConstant;

    // if offscreen flag for removal
    if (this.y < -10) {
        POP.score.escaped += 1; // update score
        this.remove = true;
    }
  };

  this.renderTo = function(draw) {
    draw.circle(this.x, this.y, this.r, 'rgba(255,255,255,1)');
  };
};

POP.Particle = function(x, y,r, col) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.col = col;

  // determines whether particle will
  // travel to the right of left
  // 50% chance of either happening
  this.dir = (Math.random() * 2 > 1) ? 1 : -1;

  // random values so particles do no
  // travel at the same speeds
  this.vx = ~~(Math.random() * 4) * this.dir;
  this.vy = ~~(Math.random() * 7);

  this.remove = false;

  this.update = function() {
    // update coordinates
    this.x += this.vx;
    this.y += this.vy;

    // increase velocity so particle
    // accelerates off screen
    this.vx *= 0.99;
    this.vy *= 0.99;

    // adding this negative amount to the
    // y velocity exerts an upward pull on
    // the particle, as if drawn to the
    // surface
    this.vy -= 0.25;

    // offscreen
    if (this.y < 0) {
        this.remove = true;
    }
  };

  this.renderTo = function(draw) {
    draw.circle(this.x, this.y, this.r, this.col);
  };
};

POP.init(document.getElementsByTagName('canvas')[0]);
