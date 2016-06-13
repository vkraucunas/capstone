var Starfish = function(game, x, y, key, frame) {
    key = 'starfish';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.scale.setTo(0.5);
    this.anchor.setTo(0.8);

    this.animations.add('spin');

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;

    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);

};

Starfish.prototype = Object.create(Phaser.Sprite.prototype);
Starfish.prototype.constructor = Starfish;

Starfish.prototype.onRevived = function() {
    this.body.velocity.x = -260;
    this.animations.play('spin', 10, true);
};

Starfish.prototype.onKilled = function() {
    this.animations.frame = 0;
};
