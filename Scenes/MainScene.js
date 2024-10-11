import Player from '../Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.spritesheet('run', 'assets/player/RunAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('witchDeath', 'assets/player/deathAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('witchJump', 'assets/player/JumpAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('idleWitch', 'assets/player/IdleAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('witchAttack', 'assets/player/AttackAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('magicSpell', 'assets/player/MagicSpellSpriteSheet.png', { frameWidth: 27, frameHeight: 16 });

        this.load.image('ground', 'assets/backgrounds/spookyground4.png');
        this.load.image('candy', 'assets/collectables/candy2.png');

        this.load.image('layer1', 'assets/backgrounds/start/1.png');
        this.load.image('layer2', 'assets/backgrounds/start/2.png');
        this.load.image('layer3', 'assets/backgrounds/start/3.png');
        this.load.image('layer4', 'assets/backgrounds/start/4.png');
        this.load.image('layer5', 'assets/backgrounds/start/5.png');
        this.load.image('layer6', 'assets/backgrounds/start/6.png');

        this.load.image('graveStone', 'assets/obstacles/Gravestone.png');

        this.load.image('bat1', 'assets/enemies/Bat1.png');
        this.load.image('bat2', 'assets/enemies/Bat2.png');
        this.load.image('bat3', 'assets/enemies/Bat3.png');
        this.load.image('bat4', 'assets/enemies/Bat4.png');
    }

    create() {
        this.isGameOver = false;
        this.batEventStarted = false;

        this.setupWorld();
        this.setupPlayer();
        this.setupBats();

        this.cursors = this.input.keyboard.createCursorKeys();

        //Candy Group
        this.candyGroup = this.physics.add.group();
        this.physics.add.collider(this.candyGroup, this.ground);
        this.physics.add.overlap(this.player.sprite, this.candyGroup, this.collectCandy, null, this);

        //Grave Group
        this.graveGroup = this.physics.add.group();
        this.physics.add.collider(this.graveGroup, this.ground);

        //Spell Group
        this.spellsGroup = this.physics.add.group({
            gravityY:0
        });

        //Timed Events
        this.candyEvent = this.time.addEvent({
            delay: 2000,
            callback: this.addCandy,
            callbackScope: this,
            loop: true
        });

        this.graveEvent = this.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: this.addGravestone,
            callbackScope: this,
            loop: true
        });

        //Collission Detection
        this.physics.add.overlap(this.player.sprite, this.batGroup, (player, bat) => {
            this.takeDamage(player, bat, 10);  
        }, null, this);

        this.physics.add.overlap(this.player.sprite, this.graveGroup, (player, grave) => {
            this.takeDamage(player, grave, 30);  
        }, null, this);

        this.physics.add.overlap(this.spellsGroup, this.batGroup, (spell, bat) => {
            this.killBat(spell, bat);
        }, null, this);

        this.playMusic();
        this.addMuteControl();

        //this.physics.world.createDebugGraphic();
    }

    update() {
        if (this.cursors.up.isDown && this.player.sprite.body.touching.down) {
            this.player.jump();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.player.attack();
        }

        if(!this.isGameOver) {
            this.ground.tilePositionX += 2.0;
            this.layer1.tilePositionX += 0.5; // Slowest layer
            this.layer2.tilePositionX += 0.8;
            this.layer3.tilePositionX += 1.2;
            this.layer4.tilePositionX += 1.5;
            this.layer5.tilePositionX += 1.8;
            this.layer6.tilePositionX += 2.0; // Fastest layer
        }

        if (this.score >= 600 && !this.batEventStarted) {
            this.startBatEvent();
            this.batEventStarted = true;
        }

        if (this.batGroup) {
            this.batGroup.getChildren().forEach(bat => {
                if (bat.x < -50) { 
                    bat.destroy(); 
                }
            });
        }

        if (this.graveGroup) {
            this.graveGroup.getChildren().forEach(grave => {
                if (grave.x < -50) { 
                    grave.destroy(); 
                }
            });
        }
    }

    setupWorld() {
        //setup world bounds
        this.physics.world.bounds.width = 800;
        this.physics.world.bounds.height = 400;

        //setup parallax background
        this.layer1 = this.add.tileSprite(0, 0, 800, 400, 'layer1').setOrigin(0, 0);
        this.layer2 = this.add.tileSprite(0, 0, 800, 400, 'layer2').setOrigin(0, 0);
        this.layer3 = this.add.tileSprite(0, 0, 800, 400, 'layer3').setOrigin(0, 0);
        this.layer4 = this.add.tileSprite(0, 0, 800, 400, 'layer4').setOrigin(0, 0);
        this.layer5 = this.add.tileSprite(0, 0, 800, 400, 'layer5').setOrigin(0, 0);
        this.layer6 = this.add.tileSprite(0, 0, 800, 400, 'layer6').setOrigin(0, 0);

        //setup scoreboard
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        //setup running path
        this.ground = this.add.tileSprite(400, 380, 800, 40, 'ground');
        this.physics.add.existing(this.ground, true);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;
    }

    playMusic() {
        if (!this.sound.get('backgroundMusic')) {
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.5
        });
        this.backgroundMusic.play();

        this.game.music = this.backgroundMusic;
        } else {
            this.backgroundMusic = this.game.music;
        }
    }

    addMuteControl() {
        this.isMuted = false;
    
        this.muteText = this.add.text(760, 20, '🔊', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.muteText.setInteractive();
    
        this.muteText.on('pointerdown', () => {
            this.isMuted = !this.isMuted;
            this.updateMuteStatus();
        });
    }

    updateMuteStatus() {
        if (this.isMuted) {
            this.backgroundMusic.setMute(true);
            this.muteText.setText('🔇'); 
        } else {
            this.backgroundMusic.setMute(false);
            this.muteText.setText('🔊'); 
        }
    }

    addCandy() {
        let candy = this.candyGroup.create(800, 340, 'candy');
        candy.setVelocityX(-160);
        candy.body.setGravityY(0);
    }

    collectCandy(player, candy) {
        candy.disableBody(true, true);
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
        candy.destroy(); 
    }

    addGravestone() {
        let grave = this.graveGroup.create(800, 320, 'graveStone');
        grave.setVelocityX(-160);
        grave.body.setGravityY(0);

        grave.body.setSize(grave.width * 0.6, grave.height * 0.6);
        grave.body.setOffset(grave.width * 0.2, grave.height * 0.2);
    }

    setupPlayer() {
        this.player = new Player(this, 100, 300, {
            idleKey: 'idleWitch',
            runKey: 'run',
            jumpKey: 'witchJump',
            deathKey: 'witchDeath',
            attackKey: 'witchAttack', 
            spellKey: 'magicSpell'
        });

        this.physics.add.collider(this.player.sprite, this.ground);
        this.player.run();

        this.healthText = this.add.text(16, 50, `Health: ${this.player.health}`, {
            fontSize: '32px',
            fill: '#fff'
        });
    }

    startBatEvent() {
        if (this.batEvent) {
            this.batEvent.remove(); // Clear any previous timer
        }
        
        this.batEvent = this.time.addEvent({
            delay: 2000,  // Adjust the delay as needed
            callback: this.spawnBat,
            callbackScope: this,
            loop: true
        });
    }

    setupBats() {
        this.anims.create({
            key: 'fly',
            frames: [
                { key: 'bat1' },
                { key: 'bat2' },
                { key: 'bat3' },
                { key: 'bat4' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.batGroup = this.physics.add.group({
            gravityY:0
        });
    }

    spawnBat() {
        if (this.batGroup) {
            const spawnHigh = Phaser.Math.Between(0, 1);
            
            const highYPosition = Phaser.Math.Between(50, 150);  // High bats for player to walk under
            const lowYPosition = Phaser.Math.Between(220, 280);  // Low bats for player to jump over
            const batYPosition = spawnHigh ? highYPosition : lowYPosition;

            const bat = this.batGroup.create(800, batYPosition, 'bat1');
            bat.anims.play('fly');
            bat.setVelocityX(-200);
            bat.body.setAllowGravity(false);

            bat.body.setSize(bat.width * 0.5, bat.height * 0.5);
            bat.body.setOffset(bat.width * 0.25, bat.height * 0.25);
        } 
    }

    killBat(spell, bat) {
        spell.destroy();
        bat.destroy();
    
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
    }

    takeDamage(player, source, damageAmount) {
        // Reduce health by damage amount
        this.player.takeDamage(damageAmount);

        // Update the health text on screen
        this.healthText.setText('Health: ' + this.player.health);

        // Optionally disable the source after damage is taken
        if (source) {
            source.disableBody(true, true);
        }

        // Check for game over
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }

    removeTimedEvents() {
        if(this.batEvent) {
            this.batEvent.remove();
        }

        if(this.candyEvent) {
            this.candyEvent.remove();
        }

        if(this.graveEvent) {
            this.graveEvent.remove();
        }
    }

    gameOver() {   
        this.removeTimedEvents();

        this.batEventStarted = false;

        this.add.text(400, 200, 'Game Over', {
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        const replayButton = this.add.text(400, 250, 'Play Again?', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5);

        this.isGameOver = true;   

        replayButton.setInteractive();

        replayButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }
}