ZenvaRunner.Preload = function() {
  this.ready = false;
};

ZenvaRunner.Preload.prototype = {
  preload: function() {



    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('ground', 'assets/images/ground1.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('foreground', 'assets/images/foreground2.png');

    this.load.spritesheet('coins', 'assets/images/coins-ps.png', 51, 51, 7);
    this.load.spritesheet('starfish', 'assets/images/starfishSprite.png', 50, 50, 7);
    this.load.spritesheet('diamond', 'assets/images/diamondSprite.png', 60, 60, 35);
    this.load.spritesheet('rainbow', 'assets/images/rainbowGemSprite.png', 60, 60, 5);
    this.load.spritesheet('player', 'assets/images/greenSharkSprite.png', 160, 58, 2);
    this.load.spritesheet('playerYellow', 'assets/images/yellowSharkSprite.png', 160, 58, 2);
    this.load.spritesheet('playerOrange', 'assets/images/orangeSharkSprite.png', 160, 58, 2);
    this.load.spritesheet('playerRainbow', 'assets/images/rainbowSharkSprite.png', 160, 58, 7);
    this.load.spritesheet('playerSparkle', 'assets/images/sparkleSharkSprite.png', 200, 58, 9);


    this.load.audio('gameMusic','assets/audio/underwater.mp3');

    this.load.audio('bounce', 'assets/audio/bounce.wav');
    this.load.audio('coin', 'assets/audio/coin.wav');

    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

    this.load.onLoadComplete.add(this.onLoadComplete, this);
  },
  create: function() {
    this.preloadBar.cropEnabled = false;
  },
  update: function() {
    if(this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
      this.state.start('MainMenu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};