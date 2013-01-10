POP.update = function() {
  var checkCollision = false;

  POP.nextBubble -= 1;

  if (POP.nextBubble < 0) {
    POP.entities.push(new POP.Bubble());
    POP.nextBubble = ( Math.random() * 100 ) + 100;
  }

  if (POP.Input.tapped) {
    POP.score.taps += 1;
    POP.entities.push(new POP.Touch(POP.Input.x, POP.Input.y));
    POP.Input.tapped = false;
    checkCollision = true;
  }

  for (var i = 0; i < POP.entities.length; i += 1) {
    POP.entities[i].update();

    if (POP.entities[i].type === 'bubble' && checkCollision) {
      hit = POP.collides(POP.entities[i], {x: POP.Input.x, y: POP.Input.y, r: 7});
      if (hit) {
        for (var n = 0; n < 5; n +=1 ) {
          POP.entities.push(new POP.Particle( POP.entities[i].x, POP.entities[i].y, 2, 'rgba(255,255,255,'+Math.random()*1+')'));
        }
        POP.score.hit += 1;
      }

      POP.entities[i].remove = hit;
    }

    if (POP.entities[i].remove) {
        POP.entities.splice(i, 1);
    }
  }

  // update wave offset
  // feel free to play with these values for
  // either slower or faster waves
  POP.wave.time = new Date().getTime() * 0.002;
  POP.wave.offset = Math.sin(POP.wave.time * 0.8) * 5;

  // calculate accuracy
  POP.score.accuracy = (POP.score.hit / POP.score.taps) * 100;
  POP.score.accuracy = isNaN(POP.score.accuracy) ?  0 : ~~(POP.score.accuracy); // a handy way to round floats
};
