class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1400;
        this.score = 0;
        this.shots = 0;
        this.shotPercent = 0;
    }

    preload() {
        this.load.path = './assets/img/';
        this.load.image('grass', 'grass.jpg');
        this.load.image('cup', 'cup.jpg');
        this.load.image('ball', 'ball.png');
        this.load.image('wall', 'wall.png');
        this.load.image('oneway', 'one_way_wall.png');
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0);

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup');
        this.cup.body.setCircle(this.cup.width / 4);
        this.cup.body.setOffset(this.cup.width / 4);
        this.cup.body.setImmovable(true);

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height * 0.9, 'ball');
        this.ball.body.setCircle(this.ball.width / 2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall');
        wallA.x = Phaser.Math.Between(wallA.width / 2, width - wallA.width / 2);
        wallA.body.setImmovable(true);
        wallA.reverse = false;
        wallA.speed = Phaser.Math.Between(50, 500);;

        let wallB = this.physics.add.sprite(0, height / 2, 'wall');
        wallB.x = Phaser.Math.Between(wallB.width / 2, width - wallB.width / 2);
        wallB.body.setImmovable(true);
        wallB.reverse = false;
        wallB.speed = Phaser.Math.Between(50, 500);
        this.walls = this.add.group([wallA, wallB]);

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway');
        this.oneWay.setX(Phaser.Math.Between(this.oneWay.width / 2, width - this.oneWay.width / 2));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1;
            let xShotDirection = pointer.x <= this.ball.x ? 1 : -1;
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X * 0.1, this.SHOT_VELOCITY_X * 2) * xShotDirection);
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);
            this.shots++;
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball) => {
            ball.x = width / 2;
            ball.y = height * 0.9;
            ball.setVelocityX(0);
            ball.setVelocityY(0);
            this.score++;
            this.shotPercent = this.score / this.shots;
        });
        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls);
        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay);

        // Add score counter
        let scoreTextBG = this.add.rectangle(width * 0.8, height * 0.1, 200, 100, 0xFF10F0, 0.95).setOrigin(0.5, 0.5);
        this.scoreText = this.add.text(width * 0.8, height * 0.1, 'Shots: 0\nScore: 0\nRatio: 0', {
            fontSize: '24px',
            fontFamily: 'Comic Sans MS, Comic Sans, cursive',
            color: '#10FF1A',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);

        let title = this.add.rectangle(width * 0.2, height * 0.1, 210, 100, 0xFF10F0, 0.95).setOrigin(0.5, 0.5);
        this.titleText = this.add.text(width * 0.2, height * 0.1, 'Hello and\nwelcome to\nmy videogame :)))', {
            fontSize: '24px',
            align: 'center',
            fontFamily: 'Comic Sans MS, Comic Sans, cursive',
            color: '#10FF1A',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
    }

    update() {

        this.walls.getChildren().forEach(wall => {
            if (wall.x >= width - wall.width / 2) {
                wall.reverse = true;
                wall.speed = Phaser.Math.Between(50, 500);
            }
            else if (wall.x <= wall.width / 2) {
                wall.reverse = false;
                wall.speed = Phaser.Math.Between(50, 500);
            }

            if (wall.reverse) {
                wall.setVelocityX(-1 * wall.speed);
            }
            else {
                wall.setVelocityX(wall.speed);
            }
        });

        this.scoreText.setText('Shots: ' + this.shots + '\nScore: ' + this.score + '\nRatio: ' + (this.shotPercent * 100 * 10 | 0) / 10 + '%');
    }
}


/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make not one, but TWO obstacle(s) move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/