import Player from '../Player.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene'); // Scene key
    }

    preload() {
        this.load.spritesheet('run', 'assets/player/RunAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('witchDeath', 'assets/player/deathAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('witchJump', 'assets/player/JumpAnimation.png', { frameWidth: 85, frameHeight: 56 });
        this.load.spritesheet('idleWitch', 'assets/player/IdleAnimation.png', { frameWidth: 85, frameHeight: 56 });

        this.load.image('titlelayer1', 'assets/backgrounds/green/1.png');
        this.load.image('titlelayer2', 'assets/backgrounds/green/2.png');
        this.load.image('titlelayer3', 'assets/backgrounds/green/3.png');
        this.load.image('titlelayer4', 'assets/backgrounds/green/4.png');
        this.load.image('titlelayer5', 'assets/backgrounds/green/5.png');
        this.load.image('titlelayer6', 'assets/backgrounds/green/6.png');
        this.load.image('titlelayer7', 'assets/backgrounds/green/7.png');
        this.load.image('ground', 'assets/backgrounds/spookyGround4.png');
    }

    create() {
        this.physics.world.bounds.width = 800;
        this.physics.world.bounds.height = 400;

        this.titlelayer1 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer1').setOrigin(0, 0);
        this.titlelayer2 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer2').setOrigin(0, 0);
        this.titlelayer3 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer3').setOrigin(0, 0);
        this.titlelayer4 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer4').setOrigin(0, 0);
        this.titlelayer5 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer5').setOrigin(0, 0);
        this.titlelayer6 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer6').setOrigin(0, 0);
        this.titlelayer7 = this.add.tileSprite(0, 0, 800, 400, 'titlelayer7').setOrigin(0, 0);
        
        this.ground = this.add.tileSprite(400, 380, 800, 40, 'ground');
        this.physics.add.existing(this.ground, true);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        this.player = new Player(this, 100, 300, {
            idleKey: 'idleWitch',
            runKey: 'run'
        });

        this.physics.add.collider(this.player.sprite, this.ground);

        this.player.idle(); 

        this.add.text(400, 150, 'Candy Collector', {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        const startButton = this.add.text(400, 200, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5);

        this.add.text(400, 300, 'Up Arrow: Jump\nSpace: Cast Spell', {
            fontSize: '22px',
            fill: '#fff',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional background styling
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5);

        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            this.startGame(); 
        });
    }

    startGame() {
        this.player.run(); 
        
        this.tweens.add({
            targets: this.player.sprite,
            x: 800, 
            duration: 2000, 
            ease: 'Power1',
            onComplete: () => {
                this.scene.start('MainScene');
            }
        });
    }

    update() {
        this.titlelayer1.tilePositionX += 0.5; 
        this.titlelayer2.tilePositionX += 0.8;
        this.titlelayer3.tilePositionX += 1.0;
        this.titlelayer4.tilePositionX += 1.2;
        this.titlelayer5.tilePositionX += 1.5;
        this.titlelayer6.tilePositionX += 1.3; 
        this.titlelayer7.tilePositionX += 2.0; 
    }
}