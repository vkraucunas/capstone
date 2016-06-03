ZenvaRunner.MainMenu = function() {};

ZenvaRunner.MainMenu.prototype = {
  create: function() {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-80, 0);

    this.foreground = this.game.add.tileSprite(0, this.game.height-250, this.game.width, this.game.height - 160, 'foreground');
    this.foreground.autoScroll(-100,0);

    this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
    this.ground.autoScroll(-100, 0);



    this.player = this.add.sprite(this.game.width/5, this.game.height/2, 'player');
    this.player.anchor.setTo(0.5);


    this.player.animations.add('fly', [0,1,2,1]);
    this.player.animations.play('fly', 4, true);

    this.game.add.tween(this.player).to({y: this.player.y - 16}, 800, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);


    this.startText = this.game.add.bitmapText(0,0, 'minecraftia', 'tap to start', 32);
    this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
    this.startText.y = this.game.height / 2;

    this.description = this.game.add.bitmapText(0,0, 'minecraftia', 'tap to make shark swim upward. collect goodies. no dying. no stress.', 20);
    this.description.x = this.game.width / 2 - this.description.textWidth / 2;
    this.description.y = this.game.height / 2 + this.startText.height;

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('Game');
    }
  }
};