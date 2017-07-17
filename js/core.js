/*
JavaScript DxBall
Code: https://github.com/sqmscm/dxball
Demo: https://sqmscm.github.io/dxball
*/
//Core functions
var log = console.log.bind(console); //used to debug
var Game = function() {
    var o = {
        keys: {},
        callbacks: {},
        fps: 0,
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
    //Detect collision
    o.detCol = function(ball, brick) {
        if (ball.isFired) {
            if (o.isInside(ball, brick.x, brick.y) ||
                o.isInside(ball, brick.x, brick.y + brick.height) ||
                o.isInside(ball, brick.x + brick.width, brick.y) ||
                o.isInside(ball, brick.x + brick.width, brick.y + brick.height)) {
                if (!(Math.abs(ball.y - brick.y - brick.height) <= ball.radius && ball.speedY > 0) &&
                    !(Math.abs(brick.y - ball.y) <= ball.radius && ball.speedY < 0) &&
                    !(Math.abs(ball.x - brick.x - brick.width) <= ball.radius && ball.speedX > 0) &&
                    !(Math.abs(brick.x - ball.x) <= ball.radius && ball.speedX < 0)) {
                    //log("[collide corner]")
                    ball.speedX *= -1;
                    ball.speedY *= -1;
                }
                return true;
            }
            if (ball.x < brick.x + brick.width && ball.x > brick.x) {
                if (Math.abs(brick.y - ball.y) <= ball.radius && ball.speedY > 0) {
                    //log("[collide upper side]")
                    ball.speedY *= -1;
                    return true;
                }
                if (Math.abs(ball.y - brick.y - brick.height) <= ball.radius && ball.speedY < 0) {
                    //log("[collide lower side]")
                    ball.speedY *= -1;
                    return true;
                }
                return false;
            }
            if (ball.y < brick.y + brick.height && ball.y > brick.y) {
                if (Math.abs(ball.x - brick.x - brick.width) <= ball.radius && ball.speedX < 0) {
                    //log("[collide right side]")
                    ball.speedX *= -1;
                    return true;
                }
                if (Math.abs(brick.x - ball.x) <= ball.radius && ball.speedX > 0) {
                    //log("[collide left side]")
                    ball.speedX *= -1;
                    return true;
                }
                return false;
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
    //Enable drug
    o.enableDrag = function(element, mode) {
        var ofx, ofy;
        canvas.addEventListener('mousedown', function(event) {
            if (o.isInside(element, event.offsetX, event.offsetY)) {
                ofx = event.offsetX - element.x;
                ofy = event.offsetY - element.y;
                element.selected = true;
            } else element.selected = false;
        });
        canvas.addEventListener('mousemove', function(event) {
            if (element.style == "circle") {
                element.width = element.radius;
                element.height = element.radius;
            }
            if (element.selected) {
                if ((mode == "horizon" || mode == "plane") &&
                    event.offsetX - ofx <= canvas.width - element.width &&
                    event.offsetX - ofx >= 0)
                    element.x = event.offsetX - ofx;
                if ((mode == "vertical" || mode == "plane") &&
                    event.offsetY - ofy <= canvas.height - element.height &&
                    event.offsetY - ofy >= 0)
                    element.y = event.offsetY - ofy;
                if (o.fps < 1) {
                    canvas.height = canvas.height;
                    o.render();
                }
            }
        });
        canvas.addEventListener('mouseup', function(event) {
            element.selected = false;
        });
    }
    //Enable click
    o.enableClick = function(element, movement) {
        canvas.addEventListener('click', function(event) {
            if (o.isInside(element, event.offsetX, event.offsetY))
                movement();
        });
    }
    //Check if a point is inside an element
    o.isInside = function(element, offsetX, offsetY) {
        if (element.style == "rect" && offsetX >= element.x && offsetX <= element.x + element.width && offsetY >= element.y && offsetY <= element.y + element.height)
            return true;
        if (element.style == "circle") {
            var tempX = offsetX - element.x;
            var tempY = offsetY - element.y;
            if (Math.sqrt(tempX * tempX + tempY * tempY) <= element.radius)
                return true;
        }
        return false;
    }
    //Control fps
    o.updateFPS = function(fps) {
        var data;
        if (fps) {
            data = fps;
            document.getElementById('fpscont').value = data / 4;
        } else {
            data = Number(document.getElementById('fpscont').value) * 4;
        }
        o.fps = data;
        document.getElementById('fpsval').innerHTML = data > 0 ? data + " FPS" : "PAUSED";
    }
    //Running loop
    o.running = function() {
        if (o.fps >= 1) {
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
        }, 1000 / o.fps)
    }

    return o;
}
