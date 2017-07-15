/*
JavaScript DxBall
https://github.com/sqmscm/dxball
*/
//var log = console.log.bind(console);
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
            context.beginPath();
            context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
            context.closePath();
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
        if (window.win) {
            context.font = "30px Courier";
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = "#0000ff";
            context.fillText("You Win!", canvas.width / 2, canvas.height / 2 - 15);
            context.fillText("Score: " + window.score, canvas.width / 2, canvas.height / 2 + 15);
            return;
        }
        if (window.lose) {
            context.font = "30px Courier";
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = "#0000ff";
            context.fillText("You Lose!", canvas.width / 2, canvas.height / 2 - 15);
            context.fillText("Score < 0.", canvas.width / 2, canvas.height / 2 + 15);
            return;
        }
        context.strokeStyle = "#0000ff";
        context.font = "10px Courier";
        context.strokeText("Score: " + window.score, 5, canvas.height - 5);
    }
    //Control fps
    var data = Number(document.getElementById('fpscont').value);
    window.fps = data;
    document.getElementById('fpsval').innerHTML = data > 0 ? data + " FPS" : "PAUSE";
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
