/*jslint bitwise: true, es5: true */
(function (window, undefined) {
    'use strict';
    var KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40,
        KEY_SOUND = 83,
        
        currentScene=0,
        scenes=[],
        gameScene_menu = new Scene(),
        gameScene_start = new Scene(),
        gameScene_mnopi = new Scene(),
        gameScene_end = new Scene(),

        canvas = null,
        ctx = null,
        scaleX = 1,
        scaleY = 1,
        mousex = 0,
        mousey = 0,
        lastPress = null,
        lastTimePressed = 0,
        pressing = [],
        touches = [],
        pause = false,
        gameover = true,
        onGround = false,
        worldWidth = 0,
        worldHeight = 0,
        elapsed = 0,
        startedTime = 0,
        cam = null,
        player = null,
        playerLogo = null,
        blockHelper = null,
        soundButton = null,
        leftButton = null,
        rightButton = null,
        upButton = null,
        downButton = null,
        enterButton = null,
        sound = true,
        playerPoints = 0,
        playerPower = 1,
        wall = [],
        blockTimer = 0,
        blockIntersected = -1,
        logosCount = 0,
        logosNext = 0,
        logosTimer = 0,
        logos = [],
        mushroom = null,
        mushroomTimer = 0,
        mushroomStarted = false,
        mushroomOnGround = false,
        enterPipeTimer = 0,
        playerOnFlagTimer = 0,
        cloud = null,
        credits = false,
        otherWorks = false,
        onMobile = false, 
        endGame = false,
        endedTime = 0,
        keyboardTimer = 0,
        keyboardHelper = false,
        background_start = new Image(),
        background_start2 = new Image(),
        background_mnopi = new Image(),
        spritesheet = new Image(),
        spritesheetLogos = new Image(),
        aStart = new Audio(),
        aLoop = new Audio(),
        aCoin = new Audio(),
        aJump = new Audio(),
        aPowerUpAppears = new Audio(),
        aPowerUp = new Audio(),
        aPipe = new Audio(),
        map0 = [30,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 2, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
           18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18
            ],
        map1 = [30,
            2, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 9, 2,
            2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 8, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
           18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18
            ],
        map2 = [40,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0,14, 3,13, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0, 5, 5, 5, 3,13, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0,14, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
            ],
        i = 0,
        l = 0;

    function Scene(){
        this.id=scenes.length;
        scenes.push(this);
    }

    Scene.prototype.load=function(){};
    Scene.prototype.act=function(deltaTime){};
    Scene.prototype.paint=function(ctx){};

    function loadScene(scene){
        currentScene=scene.id;
        scenes[currentScene].load();
    }

    function Camera() {
        this.x = 0;
        this.y = 0;
    }

    Camera.prototype = {
        focus: function (x, y) {
            this.x = x - canvas.width / 2;
            this.y = y - canvas.height / 2;

            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > worldWidth - canvas.width) {
                this.x = worldWidth - canvas.width;
            }
            if (this.y < 0) {
                this.y = 0;
            } else if (this.y > worldHeight - canvas.height) {
                this.y = worldHeight - canvas.height;
            }
        }
    };
    
    function Rectangle2D(x, y, width, height, createFromTopLeft) {
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height;
        if (createFromTopLeft) {
            this.left = (x === undefined) ? 0 : x;
            this.top = (y === undefined) ? 0 : y;
        } else {
            this.x = (x === undefined) ? 0 : x;
            this.y = (y === undefined) ? 0 : y;
        }
    }
    
    Rectangle2D.prototype = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        vx: 0,
        vy: 0,
        scaleX: 1,
        scaleY: 1,
        type: 0,
        opacity: 1,
        rotation: 1,
        
        get x() {
            return this.left + this.width / 2;
        },
        set x(value) {
            this.left = value - this.width / 2;
        },
        
        get y() {
            return this.top + this.height / 2;
        },
        set y(value) {
            this.top = value - this.height / 2;
        },
        
        get right() {
            return this.left + this.width;
        },
        set right(value) {
            this.left = value - this.width;
        },
        
        get bottom() {
            return this.top + this.height;
        },
        set bottom(value) {
            this.top = value - this.height;
        },
        
        intersects: function (rect) {
            if (rect !== undefined) {
                return (this.left < rect.right &&
                    this.right > rect.left &&
                    this.top < rect.bottom &&
                    this.bottom > rect.top);
            }
        },
        
        fill: function (ctx) {
            if (ctx !== undefined) {
                if (cam !== undefined) {
                    ctx.fillRect(this.left - cam.x, this.top - cam.y, this.width, this.height);
                } else {
                    ctx.fillRect(this.left, this.top, this.width, this.height);
                }
            }
        },
        
        drawImageArea: function (ctx, cam, img, sx, sy, sw, sh) {
            if (ctx !== undefined) {
                if (img.width) {
                    ctx.save();
                    if (cam !== undefined) {
                        ctx.translate(this.x - cam.x, this.y - cam.y);
                    } else {
                        ctx.translate(this.x, this.y);
                    }
                    ctx.scale(this.scaleX, this.scaleY);
                    if (this.rotation != 1) {
                        ctx.rotate(this.rotation * Math.PI / 180);
                    }
                    ctx.globalAlpha = this.opacity;
                    ctx.drawImage(img, sx, sy, sw, sh, -this.width / 2, -this.height / 2, this.width, this.height);
                    ctx.restore();
                } else {
                    if (cam !== undefined) {
                        ctx.strokeRect(this.left - cam.x, this.top - cam.y, this.width, this.height);
                    } else {
                        ctx.strokeRect(this.left, this.top, this.width, this.height);
                    }
                }
            }
        }
    };

    document.addEventListener('keydown', function (evt) {
        if (!pressing[evt.which]) {
            lastPress = evt.which;
        }
        pressing[evt.which] = true;

        if (evt.which >= 37 && evt.which <= 40) {
            evt.preventDefault();
            keyboardHelper = false;
            document.getElementById('keyboardImage').style.display='none';
            keyboardTimer = 0;
        }
        if (evt.which == 13){
            keyboardHelper = false;
            document.getElementById('keyboardImage').style.display='none';
            keyboardTimer = 0;
        }
    }, false);

    document.addEventListener('keyup', function (evt) {
        pressing[evt.which] = false;
    }, false);

    function setMap(map, blockSize) {
        var col = 0,
            row = 0,
            columns = map[0],
            rect = null;
        wall.length = 0;
        for (i = 1, l = map.length; i < l; i += 1) {
            if (map[i] > 0) {
                rect = new Rectangle2D(col * blockSize, row * blockSize, blockSize, blockSize, true);
                rect.type = map[i];
                wall.push(rect);
            }
            col += 1;
            if (col >= columns) {
                row += 1;
                col = 0;
            }
        }
        worldWidth = columns * blockSize;
        worldHeight = row * blockSize;
    }

    function setLogos(num, blockSize, col, row) {
        logos.length = 0;
        var rect = null;
        for (i = 0, l = num; i < l; i += 1) {
            rect = new Rectangle2D( col*blockSize, row*blockSize, blockSize, blockSize, true);
            rect.type = 1;
            logos.push(rect);
        }
    }
    gameScene_end.load = function() {
        // Set initial map
        setMap(map2, 32); 

        // Set clouds
        cloud = new Rectangle2D( 40, 48, 64, 32, true );

        // Set position player
        player.left = 40;
        player.top = 175;
        player.vx = 0;
        player.vy = 0;
        gameover = false;

        mushroom = new Rectangle2D( 1006, 226, 16, 16, true);
    }
    gameScene_end.paint = function(){
        // Clean canvas
        ctx.fillStyle = '#55f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#060';
        ctx.fillRect(0, 270, canvas.width, 50);

        //Draw clouds
        cloud.drawImageArea(ctx, cam, spritesheet, 160, 32, 64, 32);
        cloud.left += 500;
        cloud.top += 20;
        cloud.drawImageArea(ctx, cam, spritesheet, 160, 32, 64, 32);
        cloud.left -= 300;
        cloud.top -= 40;
        cloud.drawImageArea(ctx, cam, spritesheet, 160, 32, 64, 32);
        cloud.left -= 200;
        cloud.top += 20;
        cloud.left += 0.5;

        // Draw player
        if(!playerOnFlagTimer){
            ctx.strokeStyle = '#0f0';
            if (!onGround) {
                player.drawImageArea(ctx, cam, spritesheet, 64, 32, 32, 64);
            } else if (player.vx === 0) {
                if ( lastTimePressed > 50 ){
                    player.drawImageArea(ctx, cam, spritesheet, 96, 32, 32, 64);
                }else{
                    player.drawImageArea(ctx, cam, spritesheet, 0, 32, 32, 64);
                }
            } else {
                if(player.x > 820){
                    player.drawImageArea(ctx, cam, spritesheet, 0, 32, 32, 64);
                }else{
                    player.drawImageArea(ctx, cam, spritesheet, (~~(elapsed * 8) % 2) * 32, 32, 32, 64);
                }
            }
        }

        // Draw walls
        ctx.strokeStyle = '#999';
        for (i = 0, l = wall.length; i < l; i += 1) {
            if(wall[i].type > 9){
                wall[i].drawImageArea(ctx, cam, spritesheet, (wall[i].type - 5) * 32, 64, 32, 32);
            }else{
                wall[i].drawImageArea(ctx, cam, spritesheet, (wall[i].type - 1) * 32, 0, 32, 32);
            }
        }

        if (playerOnFlagTimer > 0){
            // Draw player
            ctx.strokeStyle = '#0f0';
            player.drawImageArea(ctx, cam, spritesheet, 128, 32, 32, 64);
        }

        // Draw pause
        if (pause && !endGame) {
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = "bold 16px sans-serif";
            if (gameover) {
                ctx.fillText('GAMEOVER', canvas.width / 2, canvas.height / 2);
            } else {
                ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
            }
            ctx.textAlign = 'left';
        }

        // Draw keys
        if (onMobile){
            if (!endGame){
                draw_keys();
            }else{
                // Draw Keys
                if (onMobile){
                    if (pressing[KEY_UP]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
                    ctx.fillRect( upButton.left, upButton.top, upButton.width, upButton.height);
                    ctx.strokeRect( upButton.left, upButton.top, upButton.width, upButton.height );

                    if (pressing[KEY_DOWN]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
                    ctx.fillRect( downButton.left, downButton.top, downButton.width, downButton.height);
                    ctx.strokeRect( downButton.left, downButton.top, downButton.width, downButton.height );

                    if (pressing[KEY_ENTER]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
                    ctx.fillRect( enterButton.left, enterButton.top, enterButton.width, enterButton.height);
                    ctx.strokeRect( enterButton.left, enterButton.top, enterButton.width, enterButton.height );
                    
                    // Draw arrows
                    ctx.fillStyle = "#ccc";
                    if (pressing[KEY_UP]) ctx.fillStyle = "#9f9";
                    ctx.beginPath();
                    ctx.moveTo( upButton.right - upButton.width/2, upButton.top + upButton.height/4 );
                    ctx.lineTo( upButton.left + upButton.width/4, upButton.bottom - upButton.height/3 );
                    ctx.lineTo( upButton.right - upButton.width/4, upButton.bottom - upButton.height/3 );
                    ctx.fill();

                    ctx.fillStyle = "#ccc";
                    if (pressing[KEY_DOWN]) ctx.fillStyle = "#9f9";
                    ctx.beginPath();
                    ctx.moveTo( downButton.right - downButton.width/2, downButton.bottom - downButton.height/4 );
                    ctx.lineTo( downButton.left + downButton.width/4, downButton.top + downButton.height/3 );
                    ctx.lineTo( downButton.right - downButton.width/4, downButton.top + downButton.height/3 );
                    ctx.fill();

                    ctx.font = "bold 16px sans-serif";
                    ctx.fillStyle = "#ccc";
                    ctx.fillText("GO!", enterButton.left+18, enterButton.top+22);
                }
            }
        } 

        if (!endGame){
            // Draw points
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText('00'+playerPoints+'000', 120, 20);
            ctx.fillText('', 220, 20);
            ctx.fillText('x ' + playerPoints, 250, 20);
        }else{
            ctx.fillStyle = "#000";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("OTHER WORKS", 850-player.x+canvas.width-endedTime, 40);
            ctx.fillRect(840-player.x+canvas.width-endedTime, 48, 190, 2);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("2014 - ARCOGAME", 850-player.x+canvas.width-endedTime, 80);
            ctx.fillText("2014 - TEJERAPUNTO", 850-player.x+canvas.width-endedTime, 120);
            ctx.fillText("2015 - BOGADIA", 850-player.x+canvas.width-endedTime, 160);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("BACK", 790-player.x+canvas.width-endedTime, 240);

            mushroom.drawImageArea(ctx, cam, spritesheet, 9*32, 0, 32, 32);
        }

        if (player.x > 440){
            // Draw Credits
            ctx.fillStyle = "#000";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("WEB DEVELOPER", 850-player.x+canvas.width/2-endedTime, 40);
            ctx.fillRect(840-player.x+canvas.width/2-endedTime, 48, 190, 2);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("ROBERTO AGUILAR", 850-player.x+canvas.width/2-endedTime, 70);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("WEB DESIGNER", 850-player.x+canvas.width/2-endedTime, 100);
            ctx.fillRect(840-player.x+canvas.width/2-endedTime, 108, 190, 2);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("ROBERTO AGUILAR", 850-player.x+canvas.width/2-endedTime, 130);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("SONG THEME", 850-player.x+canvas.width/2-endedTime, 160);
            ctx.fillRect(840-player.x+canvas.width/2-endedTime, 168, 190, 2);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("ERIK URANO & ZAR1 - ARCADE", 850-player.x+canvas.width/2-endedTime, 190);
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("(C) 2015", 810-player.x+canvas.width/2-endedTime, 312);
        }

        // Draw sound button
        if(soundButton) soundButton.drawImageArea(ctx, undefined, spritesheet, 288, 32, 32, 32);
        ctx.font = "8px sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText('S', 464, 24);
        if (!sound){
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.moveTo( soundButton.left, soundButton.bottom);
            ctx.lineTo( soundButton.right, soundButton.top);
            ctx.stroke();
        }
    }
    gameScene_end.act = function(deltaTime){

        // Mobile Buttons
        if (onMobile){
            for(var i=0,l=touches.length;i<l;i++){
                if(touches[i]){
                    checkButtons(touches[i].x, touches[i].y);
                }
            }
        }

        if (!pause && playerOnFlagTimer == 0 && !endGame) {
            // GameOver Reset
            if (gameover) {
                loadScene(gameScene_start);
            }
            // Last Time Pressed
            lastTimePressed++;
            if (pressing[KEY_RIGHT] || pressing[KEY_LEFT] || pressing[KEY_UP] || pressing[KEY_DOWN]){
                lastTimePressed = 0;
            }

            // Set vectors
            if (pressing[KEY_RIGHT]) {
                player.scaleX = 1;
                if (player.vx < 5*playerPower) {
                    player.vx += Math.floor(1*playerPower);/*changed math.floor revisar*/
                }
            } else if (player.vx > 0) {
                player.vx -= Math.floor(1*playerPower);
            }
            if (pressing[KEY_LEFT]) {
                player.scaleX = -1;
                if (player.vx > -5*playerPower) {
                    player.vx -= Math.floor(1*playerPower);
                }
            } else if (player.vx < 0) {
                player.vx += 1;
            }

            // Gravity
            player.vy += 1;
            if (player.vy > 10) {
                player.vy = 10;
            }

            // Jump
            if (onGround && lastPress === KEY_UP) {
                player.vy = -10*playerPower;
                if (sound) aJump.play();
            }

            // Move player in y
            onGround = false;
            player.y += player.vy;
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (player.intersects(wall[i])) {
                    if (player.vy > 0) {
                        player.bottom = wall[i].top;
                        if (player.left + player.width/3 > wall[i].right && wall[i].right != wall[i+1].left){
                            player.left = wall[i].right;
                        }
                        if (player.right - player.width/3 < wall[i].left && wall[i].left != wall[i-1].right){
                            player.right = wall[i].left;
                        }
                        onGround = true;
                    } else {
                        player.top = wall[i].bottom;
                    }
                    player.vy = 0;
                }
            }

            // Move player in x
            player.x += player.vx;
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (player.intersects(wall[i])) {
                    if (player.vx > 0) {
                        player.right = wall[i].left;
                        if (wall[i].type == 10 || wall[i].type == 12){
                            playerOnFlagTimer = 50;
                            player.x += 20; 
                            break;
                        }
                    } else {
                        player.left = wall[i].right;
                    }
                    player.vx = 0;
                }
            }

            // Out Screen
            if (player.x > worldWidth) {
                player.x = 0;
            }
            if (player.x < 0) {
                player.x = worldWidth;
            }

            // Bellow world
            if (player.y > worldHeight) {
                gameover = true;
                pause = true;
            }

            // Focus player
            cam.focus(player.x, player.y);

            // Elapsed time
            elapsed += deltaTime;
            if (elapsed > 3600) {
                elapsed -= 3600;
            }
        }
        if (!pause && !endGame){
            // Player on Flag
            if (playerOnFlagTimer > 0){
                if (player.bottom < 256 ){
                    player.bottom += 4;
                    playerOnFlagTimer = 11;
                }
                playerOnFlagTimer--;
                if (playerOnFlagTimer == 0){
                    player.x += 50;
                    player.top = 175;
                    endGame = true;
                }
            }
        }

        // Pause/Unpause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
        }
        // Sound
        if ( lastPress == KEY_SOUND ){
            if (sound) {
                aStart.pause();
                aLoop.pause();
                sound = false;
            }else{
                aLoop.loop = true;
                aLoop.play();
                sound= true;
            }
            mousex = 0;
            mousey = 0;
        }

        if(endGame){
        // Elapsed time
            elapsed += deltaTime;
            if (elapsed > 3600) {
                elapsed -= 3600;
            }
            // Gravity
            player.vy += 1;
            if (player.vy > 10) {
                player.vy = 10;
            }
            player.scaleX = 1;
            player.vx = 3;
            if (player.x > 600 && endedTime < 220){
                endedTime += 2;
            }
            if (player.x > 820){
                player.x = 820;
                cam.focus( 820 + endedTime, player.y);
            }else{
                cam.focus(player.x + endedTime, player.y);
            }
            // Move player in y
            onGround = false;
            player.y += player.vy;
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (player.intersects(wall[i])) {
                    if (player.vy > 0) {
                        player.bottom = wall[i].top;
                        if (player.left + player.width/3 > wall[i].right && wall[i].right != wall[i+1].left){
                            player.left = wall[i].right;
                        }
                        if (player.right - player.width/3 < wall[i].left && wall[i].left != wall[i-1].right){
                            player.right = wall[i].left;
                        }
                        onGround = true;
                    } else {
                        player.top = wall[i].bottom;
                    }
                    player.vy = 0;
                }
            }
            // Move player in x
            player.x += player.vx;

            if (lastPress == KEY_UP){
                if(mushroom.y == 234){
                    mushroom.y = 156;
                    mushroom.x = 1070;
                }else if(mushroom.y == 156){
                    mushroom.y = 116;
                    mushroom.x = 1070;
                }else{
                    mushroom.y = 76;
                    mushroom.x = 1070;
                }
            }
            if (lastPress == KEY_DOWN){
                if(mushroom.y == 76){
                    mushroom.y = 116;
                    mushroom.x = 1070;
                }else if(mushroom.y == 116){
                    mushroom.y = 156;
                    mushroom.x = 1070;
                }else{
                    mushroom.y = 234;
                    mushroom.x = 1006;
                }
            }
            if (lastPress === KEY_ENTER) {
                if(mushroom.y == 76){
                   document.getElementById("arcogame_link").click();
                }else if(mushroom.y == 116){
                   document.getElementById("tejerapunto_link").click();
                }else if(mushroom.y == 156){
                   document.getElementById("bogadia_link").click();
                }else{
                    /*
                    endGame = false;
                    document.getElementById('startTitle').style.display = "block";
                    aLoop.pause();
                    playerPoints = 0;
                    endedTime = 0;
                    playerPower = 1;
                    loadScene(scenes[0]);
                    */
                    location.reload();
                }
            }
        }
    }

    gameScene_mnopi.load = function() {

        // Set initial map
        setMap(map1, 32);

        // Set position player
        player.left = 40;
        player.top = 64;
        player.vx = 0;
        player.vy = 0;
        gameover = false;

        // Set Wall inverted
        for (i = 0, l = wall.length; i < l; i += 1) {
            if (wall[i].type == 6 || wall[i].type == 7 || wall[i].type == 8 || wall[i].type == 9){
                if (i < 20 ){
                    wall[i].scaleX = -1;
                    wall[i].scaleY = -1;
                }else{
                    wall[i].scaleY = 1.2;
                    wall[i].scaleX = 1.2;
                    wall[i].rotation = 270;
                }
            }
        }
        // Set logos
        setLogos( 2, 32, 14, 4);
    }

    gameScene_mnopi.paint = function(){
        // Clean canvas
        ctx.fillStyle = '#444';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (player.x > 240 && player.x < 720){
            ctx.drawImage(background_mnopi, -(player.x-240), 0, 1024, 256);
        }else if (player.x > 719){
            ctx.drawImage(background_mnopi, -480, 0, 1024, 256);
        }else{
            ctx.drawImage(background_mnopi, 0, 0, 1024, 256);
        }

        // Draw logos 
        for (i = 0, l = logos.length; i < l; i += 1) {
            logos[i].drawImageArea(ctx, cam, spritesheetLogos, (5 + i) * 64, 0, 64, 64);
        }

        // Draw player
        ctx.strokeStyle = '#0f0';
        if (!onGround) {
            player.drawImageArea(ctx, cam, spritesheet, 64, 32, 32, 64);
        } else if (player.vx === 0) {
            if ( lastTimePressed > 50 ){
                player.drawImageArea(ctx, cam, spritesheet, 96, 32, 32, 64);
            }else{
                player.drawImageArea(ctx, cam, spritesheet, 0, 32, 32, 64);
            }
        } else {
            player.drawImageArea(ctx, cam, spritesheet, (~~(elapsed * 8) % 2) * 32, 32, 32, 64);
        }

        // Draw walls
        ctx.strokeStyle = '#999';
        for (i = 0, l = wall.length; i < l; i += 1) {
            if ( wall[i].type < 10 ){
                wall[i].drawImageArea(ctx, cam, spritesheet, (wall[i].type - 1) * 32, 0, 32, 32);
            }else if ( wall[i].type < 20 ){
                wall[i].drawImageArea(ctx, cam, spritesheet, (wall[i].type - 11) * 32, 32, 32, 32);
            }else{
                wall[i].drawImageArea(ctx, cam, spritesheet, 256, 32, 32, 32);
            }
        }

        // Draw pause
        if (pause) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.font = "bold 16px sans-serif";
            if (gameover) {
                ctx.fillText('GAMEOVER', canvas.width / 2, canvas.height / 2);
            } else {
                ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
            }
            ctx.textAlign = 'left';
        }

        // Draw keys
        if (onMobile) draw_keys();

        // Draw points
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText('00'+playerPoints+'000', 120, 20);
        ctx.fillText('', 220, 20);
        ctx.fillText('x ' + playerPoints, 250, 20);

        // Draw sound button
        soundButton.drawImageArea(ctx, undefined, spritesheet, 288, 32, 32, 32);
        ctx.font = "8px sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText('S', 464, 24);
        if (!sound){
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.moveTo( soundButton.left, soundButton.bottom);
            ctx.lineTo( soundButton.right, soundButton.top);
            ctx.stroke();
        }
    }

    gameScene_mnopi.act = function(deltaTime) {

        // Mobile Buttons
        if (onMobile){
            for(var i=0,l=touches.length;i<l;i++){
                if(touches[i]){
                    checkButtons(touches[i].x, touches[i].y);
                }
            }
        }

        if (!pause && enterPipeTimer == 0) {
            // GameOver Reset
            if (gameover) {
                loadScene(gameScene_start);
            }
            // Last Time Pressed
            lastTimePressed++;
            if (pressing[KEY_RIGHT] || pressing[KEY_LEFT] || pressing[KEY_UP] || pressing[KEY_DOWN]){
                lastTimePressed = 0;
            }

            // Set vectors
            if (pressing[KEY_RIGHT]) {
                player.scaleX = 1;
                if (player.vx < 5*playerPower) {
                    player.vx +=  Math.floor(1*playerPower);
                }
            } else if (player.vx > 0) {
                player.vx -=  Math.floor(1*playerPower);
            }
            if (pressing[KEY_LEFT]) {
                player.scaleX = -1;
                if (player.vx > -5*playerPower) {
                    player.vx -=  Math.floor(1*playerPower);
                }
            } else if (player.vx < 0) {
                player.vx += 1;
            }

            // Gravity
            player.vy += 1;
            if (player.vy > 10) {
                player.vy = 10;
            }

            // Jump
            if (onGround && lastPress === KEY_UP) {
                player.vy = -10*playerPower;
                if (sound) aJump.play();
            }

            // Move player in x
            player.x += player.vx;
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (player.intersects(wall[i])) {
                    if (player.vx > 0) {
                        player.right = wall[i].left;
                        if (wall[i].type == 6 || wall[i].type == 7){
                            if (lastPress === KEY_RIGHT){
                                if (sound) aPipe.play();
                                enterPipeTimer = 20;
                            }
                        }
                    } else {
                        player.left = wall[i].right;
                    }
                    player.vx = 0;
                }
            }
            
            // Move player in y
            onGround = false;
            player.y += player.vy;
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (player.intersects(wall[i])) {
                    if (player.vy > 0) {
                        player.bottom = wall[i].top;
                        if (player.left + player.width/3 > wall[i].right && wall[i].right != wall[i+1].left){
                            player.left = wall[i].right;
                        }
                        if (player.right - player.width/3 < wall[i].left && wall[i].left != wall[i-1].right){
                            player.right = wall[i].left;
                        }
                        onGround = true;
                    } else {
                        if (player.left + player.width/2 < wall[i].right && wall[i].right == wall[i+1].left || wall[i].right != wall[i+1].left){
                            player.top = wall[i].bottom;
                            if (wall[i].type != 6 && wall[i].type != 7){
                                blockIntersected = i;
                                blockTimer = 5;
                                wall[i].bottom = wall[i].bottom-2;
                                if (wall[i].type == 4){
                                    if ( logosCount < 2){
                                        if (sound) aCoin.play();
                                        logosCount++;
                                        logosTimer = 10;
                                        playerPoints++;
                                        for (var g = 0, h = logos.length; g < h; g += 1){
                                            logos[g].bottom -= 2;
                                        }
                                    }
                                    if( logosCount == 2 ){
                                        wall[i].type = 20;
                                    }
                                }
                            }    
                        }
                    }
                    player.vy = 0;
                }
            }

            // Out Screen
            if (player.x > worldWidth) {
                player.x = 0;
            }
            if (player.x < 0) {
                player.x = worldWidth;
            }

            // Bellow world
            if (player.y > worldHeight) {
                gameover = true;
                pause = true;
            }

            // Focus player
            cam.focus(player.x, player.y);

            // Elapsed time
            elapsed += deltaTime;
            if (elapsed > 3600) {
                elapsed -= 3600;
            }

            // Block effect
            if (blockTimer > -1){
                blockTimer--;
                if (blockTimer == 0) {
                    wall[blockIntersected].bottom = wall[blockIntersected].bottom+2;
                    if (wall[blockIntersected].type == 4) {
                        for (var g = 0, h = logos.length; g < h; g += 1){
                            logos[g].bottom += 2;
                        }
                    }
                }
            }
            // Logos Effect
            if (logosNext < logosCount){
                if( logosTimer > 0 ){
                    logos[logosNext].bottom -= 10;
                    logosTimer--;
                    if ( logosTimer < 5 ){
                        logos[logosNext].opacity -= 0.2;
                    }
                }else{
                    logosNext = logosCount;
                }
            }
        }

        // Enter Pipe
        if (enterPipeTimer > 0){
            enterPipeTimer--;
            player.x += 4;
            if (enterPipeTimer == 0){
                currentScene++;
                loadScene(scenes[currentScene]);
            }
        }

        // Pause/Unpause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
        }
        // Sound
        if ( lastPress == KEY_SOUND ){
            if (sound) {
                aStart.pause();
                aLoop.pause();
                sound = false;
            }else{
                aLoop.loop = true;
                aLoop.play();
                sound= true;
            }
            mousex = 0;
            mousey = 0;
        }
    }

    gameScene_start.load = function() {

        aStart.play();
        
        // Create camera and player
        cam = new Camera();
        player = new Rectangle2D(48, 16, 32, 64, true);
        playerLogo = new Rectangle2D( 216, 136, 16, 32, true);
        blockHelper = new Rectangle2D( 45, 36, 16, 16, true);

        // Set initial map
        setMap(map0, 32);

        // Set logos
        setLogos( 5, 32, 8, 4);
        mushroom = new Rectangle2D( 8*32, 4*32, 32, 32, true);

        player.left = 36;
        player.bottom = 224;
        player.vx = 0;
        player.vy = 0;
        onGround = true;
        gameover = false;
    }

    gameScene_start.paint = function() {
        // Clean canvas
        ctx.fillStyle = '#9cf';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#444';
        ctx.fillRect(0, 270, canvas.width, 50);

        // Draw background
        if (player.x>240 && player.x<720){
            ctx.drawImage(background_start2, 60 - player.x * 0.1, 0, 448, 192);
            for (i = 0, l = 4 ; i < l; i += 1){
                var pos = 256*i;
                ctx.drawImage(background_start, pos-(player.x-240)*0.2, 148, 256, 128);
            }
        }else if (player.x>719) {
            ctx.drawImage(background_start2, -12, 0, 448, 192);
            for (i = 0, l = 4 ; i < l; i += 1){
                var pos = 256*i;
                ctx.drawImage(background_start, pos-98, 148, 256, 128);
            }
        }else{
            ctx.drawImage(background_start2, 36, 0, 448, 192);    
            for (i = 0, l = 2 ; i < l; i += 1){
                var pos = 256*i;
                ctx.drawImage(background_start, pos, 148, 256, 128);
            }
        }

        // Draw logos and mushroom
        for (i = 0, l = logos.length; i < l; i += 1) {
            logos[i].drawImageArea(ctx, cam, spritesheetLogos, i * 64, 0, 64, 64);
        }
        mushroom.drawImageArea(ctx, cam, spritesheet, 9*32, 0, 32, 32);

        // Draw player
        ctx.strokeStyle = '#0f0';
        if (!onGround) {
            player.drawImageArea(ctx, cam, spritesheet, 64, 32, 32, 64);
        } else if (player.vx === 0) {
            if ( lastTimePressed > 50 ){
                player.drawImageArea(ctx, cam, spritesheet, 96, 32, 32, 64);
            }else{
                player.drawImageArea(ctx, cam, spritesheet, 0, 32, 32, 64);
            }
        } else {
            player.drawImageArea(ctx, cam, spritesheet, (~~(elapsed * 8) % 2) * 32, 32, 32, 64);
        }

        // Draw walls
        ctx.strokeStyle = '#999';
        for (i = 0, l = wall.length; i < l; i += 1) {
            if ( wall[i].type < 10 ){
                wall[i].drawImageArea(ctx, cam, spritesheet, (wall[i].type - 1) * 32, 0, 32, 32);
            }else if ( wall[i].type < 20) {
                wall[i].drawImageArea(ctx, cam, spritesheet, (wall[i].type - 11) * 32, 32, 32, 32);
            }else{
                wall[i].drawImageArea(ctx, cam, spritesheet, 256, 32, 32, 32);
            }
        }

        // Debug last key pressed
        ctx.fillStyle = '#fff';
        //ctx.fillText('Last Press: ' + lastPress, 0, 20);
        
        // Draw pause
        if (pause) {
            ctx.textAlign = 'center';
            ctx.font = "bold 16px sans-serif";
            if (gameover) {
                ctx.fillText('GAMEOVER', canvas.width / 2, canvas.height / 2);
            } else {
                ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
            }
            ctx.textAlign = 'left';
        }

        // Draw arrows
        if (onMobile) draw_keys();

        // Draw start effect
        if ( startedTime < 50 ){
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            playerLogo.drawImageArea(ctx, undefined, spritesheet, 0, 32, 32, 64);
            ctx.fillStyle = '#fff';
            ctx.font = "bold 16px sans-serif";
            ctx.fillText('x 1', 240, 160);
        }else if (startedTime < 100){
            ctx.globalAlpha = 1-(startedTime-50)/50;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.globalAlpha = 1;

        // Draw points
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText('00'+playerPoints+'000', 120, 20);
        ctx.fillText('', 220, 20);
        ctx.fillText('x ' + playerPoints, 250, 20);

        // Draw sound button
        soundButton.drawImageArea(ctx, undefined, spritesheet, 288, 32, 32, 32);
        ctx.font = "8px sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText('S', 464, 24);
        if (!sound){
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.moveTo( soundButton.left, soundButton.bottom);
            ctx.lineTo( soundButton.right, soundButton.top);
            ctx.stroke();
        }

        if (mushroom.y == 144 && player.x > 500){
            //primer camino, en negro
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(55,65,40,Math.PI,Math.PI*0.5,false);
            ctx.closePath()
            ctx.fill();
            ctx.stroke();
            ctx.fillRect( 15, 65, 40, 40);
            ctx.beginPath();
            ctx.moveTo(15,65);
            ctx.lineTo(15,105);
            ctx.lineTo(55,105);
            ctx.stroke();
            blockHelper.drawImageArea(ctx, undefined, spritesheet, 96, 0, 32, 32);
            playerLogo.x = 51; playerLogo.y = 74 - (~~(elapsed * 12) % 8);
            if (playerLogo.y < 74){
                playerLogo.drawImageArea(ctx, undefined, spritesheet, 64, 32, 32, 64);
                if (playerLogo.y < 68){
                    blockHelper.y = 42;
                }
            }else{
                playerLogo.drawImageArea(ctx, undefined, spritesheet, 0, 32, 32, 64);
                blockHelper.y = 44;
            }
        }
    }

    gameScene_start.act = function(deltaTime) {

        // Mobile Buttons
        if (onMobile){
            for(var i=0,l=touches.length;i<l;i++){
                if(touches[i]){
                    checkButtons(touches[i].x, touches[i].y);
                }
            }
        }

        // Start Time
        if ( startedTime < 100 ){
            startedTime++;
        }
        if ( startedTime > 80 ){
            if (!pause && enterPipeTimer == 0) {
                // GameOver Reset
                if (gameover) {
                    loadScene(gameScene_start);
                }

                // Last Time Pressed
                lastTimePressed++;
                if (pressing[KEY_RIGHT] || pressing[KEY_LEFT] || pressing[KEY_UP] || pressing[KEY_DOWN]){
                    lastTimePressed = 0;
                }

                // Set vectors
                if (pressing[KEY_RIGHT]) {
                    player.scaleX = 1;
                    if (player.vx < 5*playerPower) {
                        player.vx +=  Math.floor(1*playerPower);
                    }
                } else if (player.vx > 0) {
                    player.vx -=  Math.floor(1*playerPower);
                }
                if (pressing[KEY_LEFT]) {
                    player.scaleX = -1;
                    if (player.vx > -5*playerPower) {
                        player.vx -=  Math.floor(1*playerPower);
                    }
                } else if (player.vx < 0) {
                    player.vx += 1;
                }

                // Gravity
                player.vy += 1;
                if (player.vy > 10) {
                    player.vy = 10;
                }

                // Jump
                if (onGround && lastPress === KEY_UP) {
                    player.vy = -10*playerPower;
                    if (sound) aJump.play();
                }

                // Move player in x
                player.x += player.vx;
                for (i = 0, l = wall.length; i < l; i += 1) {
                    if (player.intersects(wall[i])) {
                        if (player.vx > 0) {
                            player.right = wall[i].left;
                        } else {
                            player.left = wall[i].right;
                        }
                        player.vx = 0;
                    }
                }
                
                // Move player in y
                onGround = false;
                player.y += player.vy;
                for (i = 0, l = wall.length; i < l; i += 1) {
                    if (player.intersects(wall[i])) {
                        if (player.vy > 0) {
                            player.bottom = wall[i].top;
                            if (player.left + player.width/3 > wall[i].right && wall[i].right != wall[i+1].left){
                                player.left = wall[i].right;
                            }
                            if (player.right - player.width/3 < wall[i].left && wall[i].left != wall[i-1].right){
                                player.right = wall[i].left;
                            }
                            onGround = true;
                            if (wall[i].type == 6 || wall[i].type == 7){
                                if (lastPress === KEY_DOWN){
                                    if (sound) aPipe.play();
                                    enterPipeTimer = 20;
                                    logosCount = 0;
                                    logosNext = 0;
                                    if ( wall[i].type == 6 ){
                                        player.right = wall[i].right + wall[i].width/2;
                                    }else{
                                        player.left = wall[i].left - wall[i].width/2;
                                    }
                                }
                            }
                        } else {
                            if (player.left + player.width/2 < wall[i].right && wall[i].right == wall[i+1].left || wall[i].right != wall[i+1].left){
                                player.top = wall[i].bottom;
                                blockIntersected = i;
                                blockTimer = 5;
                                wall[i].bottom = wall[i].bottom-2;
                                if (wall[i].type == 4){
                                    if ( logosCount < 5){
                                        if (sound) aCoin.play();
                                        logosCount++;
                                        playerPoints++;
                                        logosTimer = 10;
                                        for (var g = 0, h = logos.length; g < h; g += 1){
                                            logos[g].bottom -= 2;
                                        }
                                        mushroom.bottom -= 2;
                                    }else if( logosCount == 5 ){
                                        if (sound) aPowerUpAppears.play();
                                        wall[i].type = 20;
                                        mushroomTimer = 8;
                                    }
                                } 
                            }
                        }
                        player.vy = 0;
                    }
                }

                // Out Screen
                if (player.x > worldWidth) {
                    player.x = 0;
                }
                if (player.x < 0) {
                    player.x = worldWidth;
                }

                // Bellow world
                if (player.y > worldHeight) {
                    gameover = true;
                    pause = true;
                }

                // Focus player
                cam.focus(player.x, player.y);

                // Elapsed time
                elapsed += deltaTime;
                if (elapsed > 3600) {
                    elapsed -= 3600;
                }

                // Block effect
                if (blockTimer > -1){
                    blockTimer--;
                    if (blockTimer == 0) {
                        wall[blockIntersected].bottom = wall[blockIntersected].bottom+2;
                        if (wall[blockIntersected].type == 4) {
                            for (var g = 0, h = logos.length; g < h; g += 1){
                                logos[g].bottom += 2;
                            }
                            mushroom.bottom += 2;
                        }
                    }
                }

                // Logos Effect
                if (logosNext < logosCount){
                    if( logosTimer > 0 ){
                        logos[logosNext].bottom -= 10;
                        logosTimer--;
                        if ( logosTimer < 5 ){
                            logos[logosNext].opacity -= 0.2;
                        }
                    }else{
                        logosNext = logosCount;
                    }
                }

                // Mushroom Effect
                if (mushroomTimer > 0){
                    mushroom.y -= 4;
                    mushroomTimer--;
                    if (mushroomTimer == 0){
                        mushroomStarted = true;
                        mushroom.vx = 4;
                    }
                }
                if (mushroomStarted){
                    mushroom.x += mushroom.vx;
                    for (i = 0, l = wall.length; i < l; i += 1) {
                        if (mushroom.intersects(wall[i])) {
                            if (mushroom.vx > 0) {
                                mushroom.vx = -4;
                                mushroom.x += mushroom.vx;
                            } else {
                                mushroom.vx = 4;
                                mushroom.x += mushroom.vx;
                            }
                        }
                    }
                    mushroom.vy += 1;
                    if (mushroom.vy > 10) {
                        mushroom.vy = 10;
                    }
                    mushroomOnGround = false;
                    mushroom.y += mushroom.vy;
                    for (i = 0, l = wall.length; i < l; i += 1) {
                        if (mushroom.intersects(wall[i])) {
                            if (mushroom.vy > 0) {
                                mushroom.bottom = wall[i].top;
                                mushroomOnGround = true;
                            }
                            mushroom.vy = 0;
                        }
                    }
                    if (mushroom.intersects(player)){
                        if (sound) aPowerUp.play();
                        mushroomStarted = false;
                        mushroom.x = -100;
                        playerPower = 1.5;
                    }
                }
            }

            // Enter Pipe
            if (enterPipeTimer > 0){
                enterPipeTimer--;
                player.y += 4;
                if (enterPipeTimer == 0){
                    currentScene++;
                    loadScene(scenes[currentScene]);
                }
            }
            
            // Pause/Unpause
            if (lastPress === KEY_ENTER) {
                pause = !pause;
            }
        }
        if ( lastPress == KEY_SOUND ){
            if (sound) {
                aStart.pause();
                aLoop.pause();
                sound = false;
            }else{
                aLoop.loop = true;
                aLoop.play();
                sound= true;
            }
            mousex = 0;
            mousey = 0;
        }
    }

    gameScene_menu.load = function() {
        player = new Rectangle2D(48, 206, 32, 64, true);
        mushroom = new Rectangle2D( 154, 186, 16, 16, true);
        gameover = false;
        mushroom.y = 194;
        mushroom.x = 164;

        // Set sound and keys buttons
        soundButton = new Rectangle2D( 460, 4, 16, 16, true);
        leftButton = new Rectangle2D( 20, 250, 50, 50, true);
        rightButton = new Rectangle2D( 90, 250, 50, 50, true);
        upButton = new Rectangle2D( 340, 250, 50, 50, true);
        downButton = new Rectangle2D( 410, 250, 50, 50, true);
        enterButton = new Rectangle2D( 210, 280, 64, 32, true);
    }
    gameScene_menu.paint = function() {
        // Clean canvas
        ctx.fillStyle = '#78d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#272';
        ctx.fillRect(0, 270, canvas.width, 50);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 269, canvas.width, 1);

        //Player
        player.drawImageArea(ctx, cam, spritesheet, 0, 32, 32, 64);

        //Start Layout
        //Menu
        ctx.fillStyle = '#fff';
        ctx.font = "bold 16px sans-serif";
        mushroom.drawImageArea(ctx, cam, spritesheet, 9*32, 0, 32, 32);
        if (!credits && !otherWorks){
            ctx.fillText("1 PLAYER GAME", 180, 200);
            ctx.fillText("CREDITS", 180, 230);
            ctx.fillText("MORE WORKS", 180, 260);
        }else if(!otherWorks){
            ctx.fillStyle = '#000';
            ctx.fillText("WEB DEVELOPER", 160, 40);
            ctx.fillRect(150, 48, 190, 2);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("ROBERTO AGUILAR", 160, 70);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("WEB DESIGNER", 160, 100);
            ctx.fillRect(150, 108, 190, 2);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("ROBERTO AGUILAR", 160, 130);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("SONG THEME", 160, 160);
            ctx.fillRect(150, 168, 190, 2);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("ERIK URANO & ZAR1 - ARCADE", 160, 190);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("BACK", 180, 230);
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("(C) 2015", 10, 312);
        }else{
            ctx.fillStyle = "#000";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("OTHER WORKS", 160, 40);
            ctx.fillRect( 150, 48, 190, 2);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("2014 - ARCOGAME", 170, 80);
            ctx.fillText("2014 - TEJERAPUNTO", 170, 120);
            ctx.fillText("2015 - BOGADIA", 170, 160);
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("BACK", 180, 230);
        }

        // Draw Keys
        if (onMobile){
            if (pressing[KEY_UP]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
            ctx.fillRect( upButton.left, upButton.top, upButton.width, upButton.height);
            ctx.strokeRect( upButton.left, upButton.top, upButton.width, upButton.height );

            if (pressing[KEY_DOWN]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
            ctx.fillRect( downButton.left, downButton.top, downButton.width, downButton.height);
            ctx.strokeRect( downButton.left, downButton.top, downButton.width, downButton.height );

            if (pressing[KEY_ENTER]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
            ctx.fillRect( enterButton.left, enterButton.top, enterButton.width, enterButton.height);
            ctx.strokeRect( enterButton.left, enterButton.top, enterButton.width, enterButton.height );
            
            // Draw arrows
            ctx.fillStyle = "#ccc";
            if (pressing[KEY_UP]) ctx.fillStyle = "#9f9";
            ctx.beginPath();
            ctx.moveTo( upButton.right - upButton.width/2, upButton.top + upButton.height/4 );
            ctx.lineTo( upButton.left + upButton.width/4, upButton.bottom - upButton.height/3 );
            ctx.lineTo( upButton.right - upButton.width/4, upButton.bottom - upButton.height/3 );
            ctx.fill();

            ctx.fillStyle = "#ccc";
            if (pressing[KEY_DOWN]) ctx.fillStyle = "#9f9";
            ctx.beginPath();
            ctx.moveTo( downButton.right - downButton.width/2, downButton.bottom - downButton.height/4 );
            ctx.lineTo( downButton.left + downButton.width/4, downButton.top + downButton.height/3 );
            ctx.lineTo( downButton.right - downButton.width/4, downButton.top + downButton.height/3 );
            ctx.fill();

            ctx.font = "bold 16px sans-serif";
            ctx.fillStyle = "#ccc";
            ctx.fillText("GO!", enterButton.left+18, enterButton.top+22);
        }
    }
    gameScene_menu.act = function() {

        // Mobile Buttons
        if (onMobile){
            for(var i=0,l=touches.length;i<l;i++){
                if(touches[i]){
                    checkButtons(touches[i].x, touches[i].y);
                }
            }
        }

        player.x = 48;
        player.y = 238;

        if (!keyboardHelper && !onMobile){
            keyboardTimer++;
        }
        if (keyboardTimer > 150){
            keyboardHelper = true;
        }
        if (keyboardHelper && !onMobile){
            document.getElementById('keyboardImage').style.display='block';
            keyboardHelper = false;
            keyboardTimer = 0;
        }

        // Last Time Pressed
        lastTimePressed++;
        if (pressing[KEY_RIGHT] || pressing[KEY_LEFT] || pressing[KEY_UP] || pressing[KEY_DOWN]){
            lastTimePressed = 0;
        }
        if (!credits && !otherWorks){
            if (lastPress === KEY_ENTER){
                if (mushroom.top == 186){
                    document.getElementById('startTitle').style.display = "none";
                    loadScene(gameScene_start);
                }else if (mushroom.top == 216){
                    document.getElementById('startTitle').style.display = "none";
                    credits = true;
                }else{
                    document.getElementById('startTitle').style.display = "none";
                    mushroom.y = 224;
                    otherWorks = true;
                }
            }
            if (lastPress === KEY_UP){
                if(mushroom.y == 254){
                    mushroom.y = 224;
                }else{
                    mushroom.y = 194;
                }
            }
            if (lastPress === KEY_DOWN){
                if(mushroom.y == 194){
                    mushroom.y = 224;
                }else{
                    mushroom.y = 254;
                }
            }
        }else if(!otherWorks){
            if (lastPress === KEY_ENTER){
                document.getElementById('startTitle').style.display = "block";
                credits = false;
                mushroom.y = 194;
            }
        }else{

            if (lastPress == KEY_UP){
                if(mushroom.y == 224){
                    mushroom.y = 156;
                    mushroom.x = 150;
                }else if(mushroom.y == 156){
                    mushroom.y = 116;
                    mushroom.x = 150;
                }else{
                    mushroom.y = 76;
                    mushroom.x = 150;
                }
            }
            if (lastPress == KEY_DOWN){
                if(mushroom.y == 76){
                    mushroom.y = 116;
                    mushroom.x = 150;
                }else if(mushroom.y == 116){
                    mushroom.y = 156;
                    mushroom.x = 150;
                }else{
                    mushroom.y = 224;
                    mushroom.x = 160;
                }
            }

            if (lastPress === KEY_ENTER){
                if(mushroom.y == 76){
                   document.getElementById("arcogame_link").click();
                }else if(mushroom.y == 116){
                   document.getElementById("tejerapunto_link").click();
                }else if(mushroom.y == 156){
                   document.getElementById("bogadia_link").click();
                }else{
                    document.getElementById('startTitle').style.display = "block";
                    credits = false;
                    otherWorks = false;
                    mushroom.y = 194;
                }
            }
        }
    }

    // Draw keys with arrows
    function draw_keys(){
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#ccc";

        if (pressing[KEY_LEFT]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
        ctx.fillRect( leftButton.left, leftButton.top, leftButton.width, leftButton.height);
        ctx.strokeRect( leftButton.left, leftButton.top, leftButton.width, leftButton.height );

        if (pressing[KEY_RIGHT]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
        ctx.fillRect( rightButton.left, rightButton.top, rightButton.width, rightButton.height);
        ctx.strokeRect( rightButton.left, rightButton.top, rightButton.width, rightButton.height );

        if (pressing[KEY_UP]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
        ctx.fillRect( upButton.left, upButton.top, upButton.width, upButton.height);
        ctx.strokeRect( upButton.left, upButton.top, upButton.width, upButton.height );

        if (pressing[KEY_DOWN]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
        ctx.fillRect( downButton.left, downButton.top, downButton.width, downButton.height);
        ctx.strokeRect( downButton.left, downButton.top, downButton.width, downButton.height );

        if (pressing[KEY_ENTER]) { ctx.fillStyle = "#555"; ctx.strokeStyle = "#9f9"; }else{ ctx.fillStyle = "#000"; ctx.strokeStyle = "#ccc"; };
        ctx.fillRect( enterButton.left, enterButton.top, enterButton.width, enterButton.height);
        ctx.strokeRect( enterButton.left, enterButton.top, enterButton.width, enterButton.height );

        // Draw arrows
        ctx.fillStyle = "#ccc";
        if (pressing[KEY_LEFT]) ctx.fillStyle = "#9f9";
        ctx.beginPath();
        ctx.moveTo( leftButton.left + leftButton.width/4, leftButton.bottom - leftButton.height/2 );
        ctx.lineTo( leftButton.right - leftButton.width/3, leftButton.bottom - leftButton.height/4 );
        ctx.lineTo( leftButton.right - leftButton.width/3, leftButton.top + leftButton.height/4 );
        ctx.fill();

        ctx.fillStyle = "#ccc";
        if (pressing[KEY_RIGHT]) ctx.fillStyle = "#9f9";
        ctx.beginPath();
        ctx.moveTo( rightButton.right - rightButton.width/4, rightButton.bottom - rightButton.height/2 );
        ctx.lineTo( rightButton.left + rightButton.width/3, rightButton.bottom - rightButton.height/4 );
        ctx.lineTo( rightButton.left + rightButton.width/3, rightButton.top + rightButton.height/4 );
        ctx.fill();
        
        ctx.fillStyle = "#ccc";
        if (pressing[KEY_UP]) ctx.fillStyle = "#9f9";
        ctx.beginPath();
        ctx.moveTo( upButton.right - upButton.width/2, upButton.top + upButton.height/4 );
        ctx.lineTo( upButton.left + upButton.width/4, upButton.bottom - upButton.height/3 );
        ctx.lineTo( upButton.right - upButton.width/4, upButton.bottom - upButton.height/3 );
        ctx.fill();

        ctx.fillStyle = "#ccc";
        if (pressing[KEY_DOWN]) ctx.fillStyle = "#9f9";
        ctx.beginPath();
        ctx.moveTo( downButton.right - downButton.width/2, downButton.bottom - downButton.height/4 );
        ctx.lineTo( downButton.left + downButton.width/4, downButton.top + downButton.height/3 );
        ctx.lineTo( downButton.right - downButton.width/4, downButton.top + downButton.height/3 );
        ctx.fill();
        if(pause){
            ctx.font = "bold 14px sans-serif";
            ctx.fillStyle = "#ccc";
            ctx.fillText("PLAY", enterButton.left+14, enterButton.top+20);
        }else{
            ctx.font = "bold 14px sans-serif";
            ctx.fillStyle = "#ccc";
            ctx.fillText("PAUSE", enterButton.left+9, enterButton.top+20);
        }
    }

    //Detect mobile
    function detectmob() { 
         if( navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
         ){
            return true;
          }
         else {
            return false;
          }
    }

    function repaint() {
        window.requestAnimationFrame(repaint);
        if(scenes.length){
            scenes[currentScene].paint(ctx);
        }
    }

    function run() {
        setTimeout(run, 50);
        if(scenes.length){
            scenes[currentScene].act(0.05);
        }

        lastPress = null;
    }

    function init() {
        // Get canvas and context
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 480;
        canvas.height = 320;
        worldWidth = canvas.width;
        worldHeight = canvas.height;
        scaleX = canvas.width/window.innerWidth;
        scaleY = canvas.height/window.innerHeight;

        canvas.focus();

        // Load assets
        background_start.src = 'assets/background/houses-ela8-128x64.png';
        background_start2.src = 'assets/background/mountain-224x96.png';
        background_mnopi.src = 'assets/background/oficina-512x128.png';
        spritesheet.src = 'assets/platformer-sprites4x2.png';
        spritesheetLogos.src = 'assets/logos-64x64.png';
        aStart.src = 'assets/audio/arcade-start.mp3';
        aLoop.src = 'assets/audio/arcade-loop.wav';
        aCoin.src = 'assets/audio/smw_coin.wav';
        aJump.src = 'assets/audio/smw_jump.wav';
        aPowerUpAppears.src = 'assets/audio/smw_power-up_appears.wav';
        aPowerUp.src = 'assets/audio/smw_power-up.wav';
        aPipe.src = 'assets/audio/smw_pipe.wav';
        
        aStart.addEventListener('ended',function(){ aLoop.loop = true; aLoop.play(); } );
        
        // Create camera and player
        cam = new Camera();
        player = new Rectangle2D(48, 16, 32, 64, true);
        loadScene(scenes[0]);

        // Start game
        onMobile = detectmob();
        if (!onMobile){
            enableInputs();
        }else{
            enableMobileInputs();
        }
        run();
        repaint();
    }

    function enableInputs(){
        canvas.addEventListener('mousedown', function(evt){
            mousex=(evt.pageX-canvas.offsetLeft)*scaleX;
            mousey=(evt.pageY-canvas.offsetTop)*scaleY;
            if (soundButton){
                if ( soundButton.left < mousex && soundButton.right > mousex && soundButton.top < mousey && soundButton.bottom > mousey ){
                    lastPress = KEY_SOUND;
                }
            }
            if (leftButton){
                if ( leftButton.left < mousex && leftButton.right > mousex && leftButton.top < mousey && leftButton.bottom > mousey ){
                    lastPress = KEY_LEFT;
                    pressing[KEY_LEFT] = true;
                }
            }
            if (rightButton){
                if ( rightButton.left < mousex && rightButton.right > mousex && rightButton.top < mousey && rightButton.bottom > mousey ){
                    lastPress = KEY_RIGHT;
                    pressing[KEY_RIGHT] = true;
                }
            }
            if (upButton){
                if ( upButton.left < mousex && upButton.right > mousex && upButton.top < mousey && upButton.bottom > mousey ){
                    lastPress = KEY_UP;
                    pressing[KEY_UP] = true;
                }
            }
            if (downButton){
                if ( downButton.left < mousex && downButton.right > mousex && downButton.top < mousey && downButton.bottom > mousey ){
                    lastPress = KEY_DOWN;
                    pressing[KEY_DOWN] = true;
                }
            }
            if (enterButton){
                if ( enterButton.left < mousex && enterButton.right > mousex && enterButton.top < mousey && enterButton.bottom > mousey ){
                    lastPress = KEY_ENTER;
                    pressing[KEY_ENTER] = true;
                }
            }
            if (!onMobile){
                keyboardHelper = true;
            }
        }, false);
        canvas.addEventListener('mouseup', function(evt){
            mousex = 0;
            mousey = 0;
            pressing[KEY_LEFT] = false;
            pressing[KEY_RIGHT] = false;
            pressing[KEY_UP] = false;
            pressing[KEY_DOWN] = false;
            pressing[KEY_ENTER] = false;
        }, false);
    }
    function enableMobileInputs(){
        canvas.addEventListener('touchstart', function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                mousex=(t[i].pageX-canvas.offsetLeft)*scaleX;
                mousey=(t[i].pageY-canvas.offsetTop)*scaleY;
                touches[t[i].identifier%100]=new Point(mousex, mousey);
            }

        }, false);
        canvas.addEventListener('touchend', function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                touches[t[i].identifier%100]=null;
            }
            pressing[KEY_LEFT] = false;
            pressing[KEY_RIGHT] = false;
            pressing[KEY_UP] = false;
            pressing[KEY_DOWN] = false;
            pressing[KEY_ENTER] = false;
        }, false);
        canvas.addEventListener('touchcancel', function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                touches[t[i].identifier%100]=null;
            }
            pressing[KEY_LEFT] = false;
            pressing[KEY_RIGHT] = false;
            pressing[KEY_UP] = false;
            pressing[KEY_DOWN] = false;
            pressing[KEY_ENTER] = false;
        }, false);
    }
    function checkButtons( x, y){
        mousex = x;
        mousey = y;
        if (soundButton){
            if ( soundButton.left < mousex && soundButton.right > mousex && soundButton.top < mousey && soundButton.bottom > mousey ){
                lastPress = KEY_SOUND;
            }
        }
        if (leftButton){
            if ( leftButton.left < mousex && leftButton.right > mousex && leftButton.top < mousey && leftButton.bottom > mousey ){
                lastPress = KEY_LEFT;
                pressing[KEY_LEFT] = true;
            }
        }
        if (rightButton){
            if ( rightButton.left < mousex && rightButton.right > mousex && rightButton.top < mousey && rightButton.bottom > mousey ){
                lastPress = KEY_RIGHT;
                pressing[KEY_RIGHT] = true;
            }
        }
        if (upButton){
            if ( upButton.left < mousex && upButton.right > mousex && upButton.top < mousey && upButton.bottom > mousey ){
                lastPress = KEY_UP;
                pressing[KEY_UP] = true;
            }
        }
        if (downButton){
            if ( downButton.left < mousex && downButton.right > mousex && downButton.top < mousey && downButton.bottom > mousey ){
                lastPress = KEY_DOWN;
                pressing[KEY_DOWN] = true;
            }
        }
        if (enterButton){
            if ( enterButton.left < mousex && enterButton.right > mousex && enterButton.top < mousey && enterButton.bottom > mousey ){
                lastPress = KEY_ENTER;
                pressing[KEY_ENTER] = true;
            }
        }
    }
    function Point(x, y){
        this.x=x||0;
        this.y=y||0;
    }
    function resize(){
        scaleX = canvas.width/window.innerWidth;
        scaleY = canvas.height/window.innerHeight;
    }
    function antiFrame(){
        if (self.parent.frames.length != 0)
            self.parent.location=document.location.href;
    }

    window.addEventListener('resize', resize, false);
    window.addEventListener('load', init, false);

}(window));