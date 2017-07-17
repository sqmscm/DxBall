/*
JavaScript DxBall
Code: https://github.com/sqmscm/dxball
Demo: https://sqmscm.github.io/dxball
*/
//main
var main = function() {
    var game = Game();
    var paddle = Paddle();
    var ball = Ball();
    var bricks = game.addBricks();
    var canvas = document.getElementById('viewer');
    window.score = 0;
    window.win = false;
    window.lose = false;
    //Restart level
    main.restLevel = function() {
        if (game.fps < 1)
            game.updateFPS(120);
        game.running = function() {};
        main();
    }
    //Previous level
    main.prevLevel = function() {
        canvas.width -= 100;
        canvas.height -= 75;
        document.getElementById('next').disabled = false;
        if (canvas.width <= 300) {
            document.getElementById('prev').disabled = true;
        }
        main.restLevel();
    }
    //Next level
    main.nextLevel = function() {
        canvas.width += 100;
        canvas.height += 75;
        document.getElementById('prev').disabled = false;
        if (canvas.width >= 1000) {
            document.getElementById('next').disabled = true;
        }
        main.restLevel();
    }
    //reg callbacks
    game.registerCallback('a', paddle.moveLeft);
    game.registerCallback('d', paddle.moveRight);
    game.registerCallback('f', ball.fire);
    //render
    game.render = function() {
        ball.move();
        if (!ball.isFired)
            ball.x = paddle.x + paddle.width / 2;
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
                    window.score += game.fps;
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
        game.updateFPS();
    });
    //Enable mouse movements
    //game.enableDrag(ball, "plane"); //used to debug
    game.enableDrag(paddle, "horizon");
    game.enableClick(ball, ball.fire);
    //Start running
    game.updateFPS();
    game.running();
}
main();
