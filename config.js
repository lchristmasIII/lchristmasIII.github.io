import TitleScene from './Scenes/TitleScene.js';
import MainScene from './Scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }
        }
    },
    scene: [TitleScene, MainScene]
};

export default config;