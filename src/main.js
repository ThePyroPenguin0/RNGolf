// Code Practice: God save you from this abomination, for nobody else can
// Name: Gabriel Lipow
// Date: 29/1/2025

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: [ Play ],
    physics: {
        default: 'arcade',
        arcade:{
            debug: false // This is intentional! The game is cancerous enough as is.
        }
    }
}

let game = new Phaser.Game(config)

let { width, height } = game.config