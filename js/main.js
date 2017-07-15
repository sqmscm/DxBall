/*
JavaScript DxBall
https://github.com/sqmscm/dxball
*/
//var log = console.log.bind(console);
//main
var main = function() {
    var game = Game();
    var paddle = Paddle();
    var ball = Ball();
    var bricks = game.addBricks();
    window.score = 0;
    window.win = false;
    window.lose = false;
    //Restart level
    main.restLevel = function() {
        game.running = function() {};
        main();
    }
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
    //render
    game.render = function() {
        ball.move();
        game.detCol(ball, paddle);
        game.draw(paddle);
        game.draw(ball);
        //Draw alive bricks
        var aliveCounter = 0;
        for (var i = 0; i < bricks.length; i++) {
            if (bricks[i].isAlive) {
                aliveCounter++;
                if (game.detCol(ball, bricks[i])) {
                    bricks[i].isAlive = false;
                    window.score += window.fps;
                }
                game.draw(bricks[i]);
            }
        }
        if (aliveCounter == 0) {
            window.win = true;
        }
        if (window.score < 0) {
            window.lose = true;
            game.render = function() {
                game.updateScore();
            };
        }
        game.updateScore();
    }
    //update fps
    document.getElementById('fpscont').addEventListener('input', function(event) {
        var data = Number(event.target.value);
        window.fps = data;
        document.getElementById('fpsval').innerHTML = data > 0 ? data + " FPS" : "PAUSE";
    })
    game.running();
}
main();
