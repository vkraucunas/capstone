var Diamond = function(game, x, y, key, frame) {
    key = 'diamond';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.scale.setTo(0.5);
    this.anchor.setTo(0.5);

    this.animations.add('spin');

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;

    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);

};

Diamond.prototype = Object.create(Phaser.Sprite.prototype);
Diamond.prototype.constructor = Diamond;

Diamond.prototype.onRevived = function() {
    this.body.velocity.x = -320;
    this.animations.play('spin', 8, true);
};

Diamond.prototype.onKilled = function() {
    this.animations.frame = 0;
};