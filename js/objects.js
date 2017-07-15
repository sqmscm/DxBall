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
        speed: canvas.width / 20,
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
            if (o.y >= canvas.height - o.radius && !window.win)
                window.score -= 5 * window.fps;
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
        speed: canvas.width / 20,
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
