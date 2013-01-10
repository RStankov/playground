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
