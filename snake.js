function transpone(arr) {
    var out = [];
    for (var i = 0; i < arr[0].length; i++) {
        out[i] = [];
        for (var j = 0; j < arr.length; j++) {
            out[i][j] = arr[j][i];
        }
    }
    return out;
}
function parseMap(map) {
    var out = map.split("\n");
    for (var i = 0; i < out.length; i++) {
        out[i] = out[i].split("");
    }
    return transpone(out);
}
function getElem(name) {
    return document.getElementById(name);
}
function getMapString(mapList) {
    var value = getElem("map").value;
    for (var i = 0; i < mapList.length; i++) { // how can i do this with forEach
        if (mapList[i][0] === value)
            return mapList[i][1];
    }
    console.log("No maps found! Using default map.");
    return mapList[0][1];
}
var Game = {
    field: [],
    scale: 20,
    sizeX: 0,
    sizeY: 0,
    blocks: 0,
    notBlocks: 0,
    snake: {
        segments: [],
        len: 3,
        direction: "",
        previousDirection: ""
    },
    apples: [],
    tickerId: 0,
    tick: 0,
    fps: 60,
    ticksToMove: 20
};
var canvas = getElem("canvas");
var ctx = canvas.getContext("2d");
function randomSpace() {
    var freeTiles = Game.sizeX * Game.sizeY;
    freeTiles -= Game.blocks;
    freeTiles -= Game.apples.length;
    freeTiles -= Game.snake.segments.length;
    var randomFreeTileNumber = Math.floor(Math.random() * freeTiles);
    var currentCount = 0;
    for (var x = 0; x < Game.sizeX; x++) {
        for (var y = 0; y < Game.sizeY; y++) {
            if (Game.field[x][y] === " ") {
                if (randomFreeTileNumber === currentCount)
                    return [x, y];
                currentCount++;
            }
        }
    }
    console.log("Couldn't find a free tile!");
    return [-1, -1];
}
var draw = {
    block: function (x, y) {
        var c = {
            x: x * Game.scale,
            y: y * Game.scale,
            w: Game.scale,
            h: Game.scale
        };
        ctx.fillStyle = "#888888";
        ctx.fillRect(c.x, c.y, c.w, c.h);
        ctx.strokeStyle = "#444444";
        ctx.strokeWidth = Game.scale / 10;
        ctx.strokeRect(c.x, c.y, c.w, c.h);
    },
    apple: function (x, y) {
        var c = {
            x: (x + 0.5) * Game.scale,
            y: (y + 0.5) * Game.scale,
            r: Game.scale / 2
        };
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = "#FFBBBB";
        ctx.fill();
        ctx.strokeStyle = "#FF8888";
        ctx.strokeWidth = Game.scale / 10;
        ctx.stroke();
    },
    snakeSegment: function (x, y) {
        var c = {
            x: (x + 0.5) * Game.scale,
            y: (y + 0.5) * Game.scale,
            r: Game.scale / 2
        };
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = "#BBFFBB";
        ctx.fill();
        ctx.strokeStyle = "#88FF88";
        ctx.strokeWidth = Game.scale / 10;
        ctx.stroke();
    },
    starter: function () {
        var c = {
            x: (Game.sizeX / 2) * Game.scale,
            y: (Game.sizeY / 2) * Game.scale,
            s1: 2 * Game.scale / 2,
            s2: 1 * Game.scale / 2
        };
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "".concat(c.s1, "px sans-serif");
        ctx.textBaseline = "bottom";
        ctx.fillText("Get ready!", c.x, c.y);
        ctx.font = "".concat(c.s2, "px sans-serif");
        ctx.textBaseline = "top";
        ctx.fillText("Press a direction key", c.x, c.y);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetical";
    },
    gameOver: function (score, time) {
        var c = {
            x: (Game.sizeX / 2) * Game.scale,
            y: (Game.sizeY / 2) * Game.scale,
            s1: 2 * Game.scale / 2,
            s2: 1 * Game.scale / 2,
            y2: 0
        };
        c.y2 = c.y + c.s2;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "".concat(c.s1, "px sans-serif");
        ctx.textBaseline = "bottom";
        ctx.fillText("Game over!", c.x, c.y);
        ctx.font = "".concat(c.s2, "px sans-serif");
        ctx.textBaseline = "top";
        ctx.fillText("Score: ".concat(score, "%"), c.x, c.y);
        ctx.fillText("Time: ".concat(time), c.x, c.y2);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetical";
    },
    smile: function (_a) {
        var x = _a[0], y = _a[1];
        var c = {
            x: (x + 0.5) * Game.scale,
            y: (y + 0.5) * Game.scale,
            r: Game.scale / 3,
            x1: 0, x2: 0, y1: 0, er: 0,
            alt: 0.707
        };
        c.x1 = c.x - c.r * c.alt;
        c.x2 = c.x + c.r * c.alt;
        c.y1 = c.y - c.r * c.alt;
        c.er = c.r / 3;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI);
        ctx.strokeWidth = Game.scale / 5;
        ctx.strokeStyle = "#004400";
        ctx.stroke();
        ctx.fillStyle = "#004400";
        ctx.beginPath();
        ctx.arc(c.x1, c.y1, c.er, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x2, c.y1, c.er, 0, Math.PI * 2);
        ctx.fill();
    }
};
var spawn = {
    snakeSegment: function () {
        var d = Game.snake.direction;
        if (!d)
            return;
        var s = Game.snake.segments[Game.snake.segments.length - 1].slice();
        /*
          -1
        -1 S +1
          +1
        */
        if (d === "down")
            s[1]++;
        else if (d === "up")
            s[1]--;
        else if (d === "left")
            s[0]--;
        else if (d === "right")
            s[0]++;
        if (s[0] < 0)
            s[0] = Game.sizeX - 1;
        if (s[0] > Game.sizeX - 1)
            s[0] = 0;
        if (s[1] < 0)
            s[1] = Game.sizeY - 1;
        if (s[1] > Game.sizeY - 1)
            s[1] = 0;
        Game.snake.segments.push(s);
    },
    apple: function () {
        var a = randomSpace();
        if (a[0] < 0 || a[1] < 0)
            return;
        Game.apples.push(a);
    }
};
var checkCollision = {
    blocks: function () {
        var s = Game.snake.segments[Game.snake.segments.length - 1];
        var x = s[0], y = s[1];
        if (Game.field[x][y] === "@")
            return true;
        return false;
    },
    apples: function () {
        var s = Game.snake.segments[Game.snake.segments.length - 1];
        for (var i = 0; i < Game.apples.length; i++) {
            if (s[0] === Game.apples[i][0] && s[1] === Game.apples[i][1])
                return i;
        }
        return -1;
    },
    segments: function () {
        var s = Game.snake.segments[Game.snake.segments.length - 1];
        for (var i = 0; i < Game.snake.segments.length - 1; i++) {
            if (s[0] === Game.snake.segments[i][0] && s[1] === Game.snake.segments[i][1])
                return true;
        }
        return false;
    }
};
function render() {
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(0, 0, w, h);
    Game.apples.forEach(function (apple) { return draw.apple(apple[0], apple[1]); });
    Game.snake.segments.forEach(function (segment) { return draw.snakeSegment(segment[0], segment[1]); });
    draw.smile(Game.snake.segments[Game.snake.segments.length - 1]);
    for (var x = 0; x < Game.sizeX; x++) {
        for (var y = 0; y < Game.sizeY; y++) {
            if (Game.field[x][y] === "@")
                draw.block(x, y);
        }
    }
}
// function controls(e):void {
//     if (snake.previousDirection !== "down" && (e.code === "ArrowUp" || e.code === "KeyW")) snake.direction = "up";
//     else if (snake.previousDirection !== "up" && (e.code === "ArrowDown" || e.code === "KeyS")) snake.direction = "down";
//     else if (snake.previousDirection !== "right" && (e.code === "ArrowLeft" || e.code === "KeyA")) snake.direction = "left";
//     else if (snake.previousDirection !== "left" && (e.code === "ArrowRight" || e.code === "KeyD")) snake.direction = "right";
// }
// document.body.addEventListener("keydown", controls);
function controller(e) {
    if (Game.snake.previousDirection !== "down" && (e.code === "ArrowUp" || e.code === "KeyW"))
        Game.snake.direction = "up";
    else if (Game.snake.previousDirection !== "up" && (e.code === "ArrowDown" || e.code === "KeyS"))
        Game.snake.direction = "down";
    else if (Game.snake.previousDirection !== "left" && (e.code === "ArrowRight" || e.code === "KeyD"))
        Game.snake.direction = "right";
    else if (Game.snake.previousDirection !== "right" && (e.code === "ArrowLeft" || e.code === "KeyA"))
        Game.snake.direction = "left";
}
document.body.addEventListener("keydown", controller);
/*function win() {
    Game.hasWon = true;
}*/
function gameOver() {
    console.log("Game over");
    if (Game.tickerId) {
        clearInterval(Game.tickerId);
        Game.tickerId = 0;
    }
    draw.gameOver(Math.floor(Game.snake.len / Game.notBlocks * 100), (Game.tick / Game.fps).toFixed(1));
}
function clocker() {
    if (!(Game.tick % Game.ticksToMove)) {
        spawn.snakeSegment();
        Game.snake.previousDirection = Game.snake.direction;
        if (Game.snake.segments.length > Game.snake.len)
            Game.snake.segments.shift();
        var appleIndex = checkCollision.apples();
        if (appleIndex != -1) {
            Game.snake.len++;
            Game.apples.splice(appleIndex, 1);
            spawn.apple();
        }
        render();
        //if (Game.snake.len >= Game.difficulty * Game.notBlocks) win();
        if (checkCollision.blocks())
            gameOver();
        if (checkCollision.segments())
            gameOver();
    }
    Game.tick++;
}
function inputWaiter(e) {
    var c = e.code;
    if (c === "ArrowDown" ||
        c === "ArrowUp" ||
        c === "ArrowLeft" ||
        c === "ArrowRight" ||
        c === "KeyS" ||
        c === "KeyW" ||
        c === "KeyA" ||
        c === "KeyD") {
        document.body.removeEventListener("keydown", inputWaiter);
        console.log("Started new game");
        Game.tickerId = +setInterval(clocker, 1000 / Game.fps);
    }
}
function init() {
    if (Game.tickerId) {
        clearInterval(Game.tickerId);
        Game.tickerId = 0;
    }
    Game.field = parseMap(getMapString(maps));
    //Game.scale = 10;
    Game.sizeX = Game.field.length;
    Game.sizeY = Game.field[0].length;
    canvas.width = Game.sizeX * Game.scale;
    canvas.height = Game.sizeY * Game.scale;
    Game.blocks = 0;
    for (var x = 0; x < Game.sizeX; x++) {
        for (var y = 0; y < Game.sizeY; y++) {
            if (Game.field[x][y] === "@")
                Game.blocks++;
        }
    }
    Game.notBlocks = Game.sizeX * Game.sizeY - Game.blocks;
    Game.snake.segments = [randomSpace()];
    Game.snake.len = 3;
    Game.snake.direction = Game.snake.previousDirection = "";
    Game.apples = [];
    spawn.apple();
    Game.tick = 0;
    //Game.hasWon = false;
    render();
    draw.starter();
    document.body.addEventListener("keydown", inputWaiter);
}
