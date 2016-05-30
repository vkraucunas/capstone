ZenvaRunner.Game = function() {
  this.playerMinAngle = -20;
  this.playerMaxAngle = 20;

  this.coinRate = 1500;
  this.coinTimer = 0;

  this.starfishRate = 3500;
  this.starfishTimer = 5;

  this.diamondRate = 5050;
  this.diamondTimer = 6;

  this.rainbowRate = 9500;
  this.rainbowTimer = 6;

  this.previousstarfishType = null;

  this.coinSpawnX = null;
  this.coinSpacingX = 10;
  this.coinSpacingY = 10;

  this.diamondSpawnX = null;
  this.diamondSpacingX = 10;
  this.diamondSpacingY = 10;

  this.starfishSpawnX = null;
  this.starfishSpacingX = 30;
  this.starfishSpacingY = 30;

  this.rainbowSpawnX = null;
  this.rainbowSpacingX = 10;
  this.rainbowSpacingY = 10;

};

ZenvaRunner.Game.prototype = {
  create: function() {

    this.game.world.bound = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-90, 0);

    this.foreground = this.game.add.tileSprite(0, this.game.height-250, this.game.width, this.game.height - 160, 'foreground');
    this.foreground.autoScroll(-100,0);

    this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
    this.ground.autoScroll(-120, 0);

    this.player = this.add.sprite(this.game.width/5, this.game.height/2, 'player');
    this.player.anchor.setTo(0.5);


    this.player.animations.add('swim', [0,1,2,1]);
    this.player.animations.play('swim', 4, true);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 100;

    this.game.physics.arcade.enableBody(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    this.game.physics.arcade.enableBody(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.bounce.set(0.25);

    this.coins = this.game.add.group();
    this.starfishes = this.game.add.group();
    this.diamonds = this.game.add.group();
    this.rainbows = this.game.add.group();

    this.jetSound = this.game.add.audio('rocket');
    this.coinSound = this.game.add.audio('coin');
    this.coinSound.volume = 0.1;
    this.gameMusic = this.game.add.audio('gameMusic');
    this.gameMusic.play('', 0, true);

    this.coinSpawnX = this.game.width + 64;
    this.starfishSpawnX = this.game.width + 80;
    this.diamondSpawnX = this.game.width + 120;
    this.rainbowSpawnX = this.game.width + 72;
  },
  update: function() {
    if(this.game.input.activePointer.isDown) {
      this.player.body.velocity.y -= 10 ;
    }

    if( this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
      if(this.player.angle > 0) {
        this.player.angle = 0;
      }
      if(this.player.angle > this.playerMinAngle) {
        this.player.angle -= 0.06;
      }
    } else if(this.player.body.velocity.y >=0 && !this.game.input.activePointer.idDown) {
      if(this.player.angle < this.playerMaxAngle) {
        this.player.angle += 0.1;
      }
    }
    if(this.coinTimer < this.game.time.now) {
      this.generateCoins();
      this.coinTimer = this.game.time.now + this.coinRate;
    }
    if(this.starfishTimer < this.game.time.now) {
      this.generateStarfishes();
      this.starfishTimer = this.game.time.now + this.starfishRate;
    }
    if(this.diamondTimer < this.game.time.now) {
      this.generateDiamonds();
      this.diamondTimer = this.game.time.now + this.diamondRate;
    }
    if(this.rainbowTimer < this.game.time.now) {
      this.generateRainbows();
      this.rainbowTimer = this.game.time.now + this.rainbowRate;
    }
    this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.starfishes, this.starHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.diamonds, this.diamondHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.rainbows, this.rainbowHit, null, this);

  },
  createCoin: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 162);

    var coin = this.coins.getFirstExists(false);
    if(!coin) {
      coin = new Coin(this.game, 0, 0);
      this.coins.add(coin);
    }

    coin.reset(x, y);
    coin.revive();
    return coin;
  },
  generateCoins: function() {
    if(!this.previousCoinType || this.previousCoinType < 3) {
      var coinType = this.game.rnd.integer() % 5;
      switch(coinType) {
        case 0:
          //do nothing. No coins generated
          break;
        case 1:
        case 2:
          // if the cointype is 1 or 2, create a single coin
          //this.createCoin();
          this.createCoin();

          break;
        case 3:
          // create a small group of coins
          this.createCoinGroup(2, 2);
          break;
        case 4:
          //create a large coin group
          this.createCoinGroup(3, 3);
          break;
        default:
          // if somehow we error on the cointype, set the previouscointype to zero and do nothing
          this.previousCoinType = 0;
          break;
      }

      this.previousCoinType = coinType;
    } else {
      if(this.previousCoinType === 4) {
        // the previous coin generated was a large group,
        // skip the next generation as well
        this.previousCoinType = 3;
      } else {
        this.previousCoinType = 0;
      }

    }
  },
  createCoinGroup: function(columns, rows) {
    //create 4 coins in a group
    var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var coinRowCounter = 0;
    var coinColumnCounter = 0;
    var coin;
    for(var i = 0; i < columns * rows; i++) {
      coin = this.createCoin(this.spawnX, coinSpawnY);
      coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
      coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
      coinColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        coinRowCounter++;
        coinColumnCounter = 0;
      }
    }
  },
// ============= ****************** ============= \\
  createStarfish: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 162);

    var starfish = this.starfishes.getFirstExists(false);
    if(!starfish) {
      starfish = new Starfish(this.game, 0, 0);
      this.starfishes.add(starfish);
    }

    starfish.reset(x, y);
    starfish.revive();
    return starfish;
  },
  generateStarfishes: function() {
          this.createStarfish();
  },
  createStarfishGroup: function(columns, rows) {

    var starfishSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var starfishRowCounter = 0;
    var starfishColumnCounter = 0;
    var starfish;
    for(var i = 0; i < columns * rows; i++) {
      starfish = this.createStarfish(this.spawnX, starfishSpawnY);
      starfish.x = starfish.x + (starfishColumnCounter * starfish.width) + (starfishColumnCounter * this.coinSpacingX);
      starfish.y = starfishSpawnY + (starfishRowCounter * starfish.height) + (starfishRowCounter * this.coinSpacingY);
      starfishColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        starfishRowCounter++;
        starfishColumnCounter = 0;
      }
    }
  },

  // ********######*********######*******#### \\
  createDiamond: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(80, this.game.world.height - 162);

    var diamond = this.diamonds.getFirstExists(false);
    if(!diamond) {
      diamond = new Diamond(this.game, 0, 0);
      this.diamonds.add(diamond);
    }

    diamond.reset(x, y);
    diamond.revive();
    return diamond;
  },
  generateDiamonds: function() {
    if(!this.previousDiamondType || this.previousDiamondType < 3) {
      var diamondType = this.game.rnd.integer() % 5;
      switch(diamondType) {
        case 0:
          //do nothing. No coins generated
          break;
        case 1:
        case 2:
          // if the cointype is 1 or 2, create a single diamond
          //this.createDiamond();
          this.createDiamond();

          break;
        default:
          // if somehow we error on the cointype, set the previouscointype to zero and do nothing
          this.previousDiamondType = 0;
          break;
      }

      this.previousDiamondType = diamondType;
    } else {
      if(this.previousDiamondType === 4) {
        // the previous diamond generated was a large group,
        // skip the next generation as well
        this.previousDiamondType = 3;
      } else {
        this.previousDiamondType = 0;
      }

    }
  },
  createDiamondGroup: function(columns, rows) {
    //create 4 coins in a group
    var diamondSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var diamondRowCounter = 0;
    var diamondColumnCounter = 0;
    var diamond;
    for(var i = 0; i < columns * rows; i++) {
      diamond = this.createDiamond(this.spawnX, diamondSpawnY);
      diamond.x = diamond.x + (diamondColumnCounter * diamond.width) + (diamondColumnCounter * this.coinSpacingX);
      diamond.y = diamondSpawnY + (diamondRowCounter * diamond.height) + (diamondRowCounter * this.coinSpacingY);
      diamondColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        diamondRowCounter++;
        diamondColumnCounter = 0;
      }
    }
  },

  // ^^^^^^^^^^^^^^^^^^^^^^^^^ \\
  createRainbow: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(80, this.game.world.height - 162);

    var rainbow = this.rainbows.getFirstExists(false);
    if(!rainbow) {
      rainbow = new Rainbow(this.game, 0, 0);
      this.rainbows.add(rainbow);
    }

    rainbow.reset(x, y);
    rainbow.revive();
    return rainbow;
  },
  generateRainbows: function() {
    this.createRainbow();
  },
  createRainbowGroup: function(columns, rows) {
    //create 4 coins in a group
    var rainbowSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var rainbowRowCounter = 0;
    var rainbowColumnCounter = 0;
    var rainbow;
    for(var i = 0; i < columns * rows; i++) {
      rainbow = this.createRainbow(this.spawnX, rainbowSpawnY);
      rainbow.x = rainbow.x + (rainbowColumnCounter * rainbow.width) + (rainbowColumnCounter * this.coinSpacingX);
      rainbow.y = rainbowSpawnY + (rainbowRowCounter * rainbow.height) + (rainbowRowCounter * this.coinSpacingY);
      rainbowColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        rainbowRowCounter++;
        rainbowColumnCounter = 0;
      }
    }
  },



  groundHit: function(player, ground) {
    player.body.velocity.y = -20;
    this.player.loadTexture('player');
    this.player.animations.add('swim', [0,1,2,1]);
    this.player.animations.play('swim', 4, true);
  },
  coinHit: function(player, coin) {

    this.player.loadTexture('playerYellow');
    // this.player.anchor.setTo(0.5);
    this.player.animations.add('swim', [0,1,2,1]);
    this.player.animations.play('swim', 4, true);



    this.coinSound.play();
    coin.kill();

    var dummyCoin = new Coin(this.game, coin.x, coin.y);
    this.game.add.existing(dummyCoin);

    dummyCoin.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyCoin).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyCoin.destroy();
    }, this);

  },
  starHit: function(player, starfish) {


    this.player.loadTexture('playerOrange');
    // this.player.anchor.setTo(0.5);
    this.player.animations.add('swim', [0,1,2,1]);
    this.player.animations.play('swim', 4, true);

    var dummyStar = new Starfish(this.game, starfish.x, starfish.y);
    this.game.add.existing(dummyStar);

    starfish.kill();
    dummyStar.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyStar).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyStar.destroy();
    }, this);

  },
  diamondHit: function(player, diamond) {
    diamond.kill();

    this.player.loadTexture('playerSparkle');
    // this.player.anchor.setTo(0.5);
    this.player.animations.add('swim', [0,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2]);
    this.player.animations.play('swim', 8, true);

    var dummyDiamond = new Diamond(this.game, diamond.x, diamond.y);
    this.game.add.existing(dummyDiamond);

    dummyDiamond.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyDiamond).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyDiamond.destroy();
    }, this);

  },
  rainbowHit: function(player, rainbow) {
    rainbow.kill();

    this.player.loadTexture('playerRainbow');
    // this.player.anchor.setTo(0.5);
    this.player.animations.add('swim', [0,1,2,3,4,5,6,7,6,5,4,3,2]);
    this.player.animations.play('swim', 8, true);

    var dummyRainbow = new Rainbow(this.game, rainbow.x, rainbow.y);
    this.game.add.existing(dummyRainbow);

    dummyRainbow.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyRainbow).to({x: 50, y: 50}, 200, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyRainbow.destroy();
    }, this);

  },

};