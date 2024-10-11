export default class Player {
    constructor(scene, x, y, animations) {
        this.scene = scene;
        this.createAnimations(animations);
        this.sprite = this.scene.physics.add.sprite(x, y, animations.idleKey);
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setScale(2);
        this.sprite.anims.play(animations.idleKey);
        this.health = 30;
        this.sprite.body.setSize(this.sprite.width * 0.2, this.sprite.height);
    }

    createAnimations(animations) {
        this.scene.anims.create({
            key: animations.idleKey,
            frames: this.scene.anims.generateFrameNumbers(animations.idleKey, { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: animations.runKey,
            frames: this.scene.anims.generateFrameNumbers(animations.runKey, { start: 0, end: 15 }),
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
            key: animations.jumpKey,
            frames: this.scene.anims.generateFrameNumbers(animations.jumpKey, { start: 0, end: 14 }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({
            key: animations.attackKey,
            frames: this.scene.anims.generateFrameNumbers(animations.attackKey, { start: 0, end: 9 }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({
            key: animations.spellKey,
            frames: this.scene.anims.generateFrameNumbers(animations.spellKey, { start: 0, end: 5 }),
            frameRate: 5,
            repeat: 0
        });

        this.scene.anims.create({
            key: animations.deathKey,
            frames: this.scene.anims.generateFrameNumbers(animations.deathKey, { start: 0, end: 9 }),
            frameRate: 5,
            repeat: 0
        });
    }

    idle() {
        this.sprite.anims.play('idleWitch');
    }

    run() {
        this.sprite.anims.play('run');
    }
 
    jump() {
        if (this.sprite.body.touching.down) {
            this.sprite.setVelocityY(-400);
            this.sprite.anims.play('witchJump');
            this.sprite.on('animationcomplete', () => {
                this.sprite.anims.play('run');
            });
        }
    }

    attack() {
        this.sprite.anims.play('witchAttack');
        const spell = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'magicSpell');
        
        spell.anims.play('magicSpell');
    
        this.scene.spellsGroup.add(spell);
        spell.body.setAllowGravity(false);
        spell.setVelocityX(200);

        this.sprite.on('animationcomplete', () => {
            this.sprite.anims.play('run');
        }); 
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.sprite.anims.play('witchDeath');
        this.sprite.on('animationcomplete', () => {
            this.sprite.setVisible(false);
            this.scene.physics.pause();
        });
    }
}