var Rainbow = function(game, x, y, key, frame) {
  key = 'rainbow';
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.scale.setTo(0.5);
  this.anchor.setTo(0.7);

  this.animations.add('spin');

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;

  this.checkWorldBounds = true;
  this.onOutOfBoundsKill = true;

  this.events.onKilled.add(this.onKilled, this);
  this.events.onRevived.add(this.onRevived, this);

};

Rainbow.prototype = Object.create(Phaser.Sprite.prototype);
Rainbow.prototype.constructor = Rainbow;

Rainbow.prototype.onRevived = function() {
  this.body.velocity.x = -200;
  this.animations.play('spin', 7, true);
};

Rainbow.prototype.onKilled = function() {
  this.animations.frame = 0;
};

