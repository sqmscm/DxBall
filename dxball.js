/*
JavaScript DxBall
https://github.com/sqmscm/dxball
*/
//var log = console.log.bind(console);
//Brick
var Brick = function(setX, setY) {
    //Set properties
    var setWidth = 50;
    var setHeight = 20;
    //Object
    var o = {
        width: setWidth,
        height: setHeight,
        x: setX,
        y: setY,
        style: "rect",
        color: "antiqueWhite",
        stroke: "#0000ff",
        isAlive: true,
    }

    return o;
}
//Ball
var Ball = function() {
    var canvas = document.getElementById('viewer');
    //Set properties
    var setRadius = 10;
    //Object
    var o = {
        radius: setRadius,
        x: canvas.width / 2,
        y: canvas.height - setRadius - 20,
        style: "circle",
        color: "aquamarine",
        speedX: canvas.width / 40,
        speedY: -canvas.width / 40,
        speed: canvas.width / 40,
        isFired: false,
    }
    //movements
    o.moveLeft = function() {
        if (!o.isFired)
            if (o.x >= o.speed + 50)
                o.x -= o.speed;
    }
    o.moveRight = function() {
        if (!o.isFired)
            if (o.x <= canvas.width - o.speed - 50)
                o.x += o.speed;
    }
    o.move = function() {
        if (o.isFired) {
            if (o.x <= o.radius || o.x >= canvas.width - o.radius)
                o.speedX *= -1;
            if (o.y <= o.radius || o.y >= canvas.height - o.radius)
                o.speedY *= -1;
            if (o.y >= canvas.height - o.radius)
                window.score -= 2 * window.fps;
            o.x += o.speedX;
            o.y += o.speedY;
        }
    }
    o.fire = function() {
        o.isFired = true;
    }
    return o;
}
//paddle
var Paddle = function() {
    var canvas = document.getElementById('viewer');
    //Set properties
    var setWidth = 100;
    var setHeight = 20;
    //Object
    var o = {
        width: setWidth,
        height: setHeight,
        x: (canvas.width - setWidth) / 2,
        y: canvas.height - setHeight,
        style: "rect",
        color: "pink",
        speed: canvas.width / 40,
    }
    //movements
    o.moveLeft = function() {
        if (o.x >= o.speed)
            o.x -= o.speed;
    }
    o.moveRight = function() {
        if (o.x <= canvas.width - o.width - o.speed)
            o.x += o.speed;
    }

    return o;
}
//Core functions
var Game = function() {
    var o = {
        keys: {},
        callbacks: {},
    }
    //draw items
    var canvas = document.getElementById('viewer');
    var context = canvas.getContext('2d');
    o.draw = function(item) {
        context.fillStyle = item.color;
        if (item.style == "rect") {
            if (item.stroke) {
                context.strokeStyle = item.stroke;
                context.strokeRect(item.x, item.y, item.width, item.height);
            }
            context.fillRect(item.x, item.y, item.width, item.height);
        } else if (item.style == "circle") {
            context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
            context.fill();
        }
    }
    //events
    o.registerCallback = function(key, callback) {
        window.addEventListener('keydown', function(event) {
            if (event.key == key)
                o.keys[event.key] = true;
        })
        window.addEventListener('keyup', function(event) {
            if (event.key == key)
                o.keys[event.key] = false;
        })
        o.callbacks[key] = callback;
    }

    //Detect collition
    o.detCol = function(ball, brick) {
        if (ball.isFired) {
            //log("ball x:"+ball.x+" brick x: "+brick.x+" ball y:"+ball.y+" brick y:"+brick.y+" speedx:"+ball.speedX+" speedY:" + ball.speedY);
            if (ball.y + ball.radius >= brick.y && ball.y - ball.radius <= brick.y + brick.height) {
                if (ball.x + ball.radius >= brick.x && ball.x - ball.radius <= brick.x + brick.width) {
                    if (ball.y >= brick.y && ball.y <= brick.y + brick.height) {
                        if (ball.x > brick.x + brick.width / 2 && ball.speedX < 0)
                            ball.speedX *= -1;
                        else if (ball.x < brick.x + brick.width / 2 && ball.speedX > 0)
                            ball.speedX *= -1;
                        //log("[collide y]")
                    } else if (ball.x >= brick.x && ball.x <= brick.x + brick.width) {
                        if (ball.y > brick.y && ball.speedY < 0)
                            ball.speedY *= -1;
                        else if (ball.y < brick.y + brick.height && ball.speedY > 0)
                            ball.speedY *= -1;
                        //log("[collide x]")
                    } else {
                        //log("[collide xy]")
                        ball.speedX *= -1;
                        ball.speedY *= -1;
                    }
                    return true;
                }
            }
        }
        return false;
    }
    //Create bricks
    o.addBricks = function() {
        var bricks = [];
        for (var i = 0; i < (canvas.height - 200) / 20; i++)
            for (var j = 0; j < (canvas.width - 100) / 50; j++) {
                var brick = Brick(50 + 50 * j, 50 + 20 * i);
                bricks.push(brick);
            }
        return bricks;
    }
    //Update score
    o.updateScore = function() {
        context.font = "10px Courier";
        context.strokeStyle = "#0000ff";
        context.strokeText("Score: " + window.score, 5, canvas.height - 5);
    }
    //Control fps
    window.fps = Number(document.getElementById('fpscont').value);
    o.running = function() {
        if (window.fps >= 1) {
            var keys = Object.keys(o.keys);
            for (var i = 0; i < keys.length; i++) {
                if (o.keys[keys[i]])
                    o.callbacks[keys[i]]();
            }
            canvas.height = canvas.height; //clear canvas
            o.render();
        }
        setTimeout(function() {
            o.running();
        }, 1000 / window.fps)
    }

    return o;
}
//main
var main = function() {
    var game = Game();
    var paddle = Paddle();
    var ball = Ball();
    var bricks = game.addBricks();
    window.score = 0;
    //Previous level
    main.prevLevel = function() {
        var canvas = document.getElementById('viewer');
        canvas.width -= 100;
        canvas.height -= 75;
        document.getElementById('next').disabled = false;
        if (canvas.width <= 300) {
            document.getElementById('prev').disabled = true;
        }
        game.running = function() {};
        main();
    }
    //Next level
    main.nextLevel = function() {
        var canvas = document.getElementById('viewer');
        canvas.width += 100;
        canvas.height += 75;
        document.getElementById('prev').disabled = false;
        if (canvas.width >= 1000) {
            document.getElementById('next').disabled = true;
        }
        game.running = function() {};
        main();
    }
    //reg callbacks
    game.registerCallback('a', function() {
        paddle.moveLeft();
        ball.moveLeft();
    });
    game.registerCallback('d', function() {
        paddle.moveRight();
        ball.moveRight();
    });
    game.registerCallback('f', ball.fire);
    game.render = function() {
        ball.move();
        game.detCol(ball, paddle);
        game.draw(paddle);
        game.draw(ball);
        //Draw alive bricks
        for (var i = 0; i < bricks.length; i++) {
            if (bricks[i].isAlive) {
                if (game.detCol(ball, bricks[i])) {
                    bricks[i].isAlive = false;
                    window.score += window.fps;
                }
                game.draw(bricks[i]);
            }
        }
        game.updateScore();
    }
    document.getElementById('fpscont').addEventListener('input', function(event) {
        var data = Number(event.target.value);
        window.fps = data;
        document.getElementById('fpsval').innerHTML = data > 0 ? data + " FPS" : "PAUSE";
    })
    game.running();
}
main();
