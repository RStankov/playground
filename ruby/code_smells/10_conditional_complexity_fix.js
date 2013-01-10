if (entity.collides && entity.collides(this.input)) {
  this.entities = this.entities.concat(entity.particles());

  entity.remove = true;
  entity.hit = true;
}

if (entity.remove) {
  this.score[entity.hit ? 'hit' : 'escaped'] += 1;
  this.entities.splice(i, 1);
}
