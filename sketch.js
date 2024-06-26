let spaceship;
let bullets = [];
let enemies = [];
let score = 0;
let enemySpawnInterval = 60;

function setup() {
    createCanvas(windowWidth, windowHeight);
    spaceship = new Spaceship();
}

function draw() {
    background(0);

    // Atualizar e desenhar a nave espacial
    spaceship.update();
    spaceship.display();

    // Atualizar e desenhar as balas
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].display();
        if (bullets[i].offscreen()) {
            bullets.splice(i, 1);
        }
    }

    // Gerar novos inimigos
    if (frameCount % enemySpawnInterval === 0) {
        enemies.push(new Enemy());
    }

    // Atualizar e desenhar os inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].display();
        if (enemies[i].offscreen()) {
            enemies.splice(i, 1);
        } else {
            // Verificar colisão com balas
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (enemies[i].hits(bullets[j])) {
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    score++;
                    break;
                }
            }
        }
    }

    // Exibir pontuação
    fill(255);
    textSize(24);
    text('Placar: ' + score, 10, 30);
}

function keyPressed() {
    if (key === ' ') {
        let bullet = new Bullet(spaceship.x + spaceship.width / 2, spaceship.y);
        bullets.push(bullet);
    }
}

function Spaceship() {
    this.width = 50;
    this.height = 30;
    this.x = width / 2 - this.width / 2;
    this.y = height - this.height - 10;
    this.speed = 5;

    this.update = function() {
        if (keyIsDown(LEFT_ARROW) && this.x > 0) {
            this.x -= this.speed;
        } else if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width) {
            this.x += this.speed;
        }
    }

    this.display = function() {
        fill(255);
        rect(this.x, this.y, this.width, this.height);
    }
}

function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 10;

    this.update = function() {
        this.y -= this.speed;
    }

    this.display = function() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.width, this.height);
    }

    this.offscreen = function() {
        return (this.y < 0);
    }
}

function Enemy() {
    this.width = 40;
    this.height = 30;
    this.x = random(width - this.width);
    this.y = 0;
    this.speed = 3;

    this.update = function() {
        this.y += this.speed;
    }

    this.display = function() {
        fill(0, 255, 0);
        rect(this.x, this.y, this.width, this.height);
    }

    this.offscreen = function() {
        return (this.y > height);
    }

    this.hits = function(bullet) {
        return (bullet.x < this.x + this.width &&
                bullet.x + bullet.width > this.x &&
                bullet.y < this.y + this.height &&
                bullet.y + bullet.height > this.y);
    }
}
