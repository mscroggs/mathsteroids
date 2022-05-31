/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/

// inputs
var quitPressed  = false;
var upPressed    = false;
var firePressed  = false;
var leftPressed  = false;
var rightPressed = false;
var selectPressed = false;
var selectDone = false;

// titlescreen
var leftTimer=0
var rightTimer=0
var game_n = 0
var game_title = ""

// high score
var entered_name = ""
var entered_available_letters = "abcdefghijklmnopqrstuvwxyz !$"
var entered_letter = 0

// Global variables
var nscores = 5
var games = [
             ["sphere (mercator projection)","sphere","Mercator"],
             ["sphere (isometric)","sphere","isometric"],
             ["sphere (stereographic projection)","sphere","stereographic"],
             ["sphere (gall-peters projection)","sphere","Gall"],
             ["sphere (craig retroazimuthal projection)","sphere","Craig"],
             ["sphere (azimuthal projection)","sphere","azim"],
             ["sphere (robinson projection)","sphere","Robinson"],
             ["sphere (sinusoidal projection)","sphere","sinusoidal"],
             ["sphere (mollweide projection)","sphere","Mollweide"],
             ["sphere (goode homolosine projection)","sphere","Goode"],
             ["(flat) cylinder","flatcylinder","flat"],
             ["(flat) möbius strip","flatmobius","flat"],
             ["(flat) torus","flattorus","flat"],
             ["(flat) klein bottle","flatKlein","flat"],
             ["(flat) real projective plane","flatreal-pp","flat"],
             ["torus (top view)","torus","top_v"],
             ["torus (projected)","torus","projected"],
             ["loop (elliptical pool table)","pool","loop"]
            ]
var projections = []
for(var i=0;i<games.length;i++){
    if(games[i][1]=="sphere"){
        projections[projections.length] = [games[i][2], i, games[i][0]]
    }
}
var options = {"surface":"sphere","projection":"Mercator"}
var mouse = "";
var WIDTH=800
var HEIGHT=450

var RADIUS = 2
var TRADIUS = [2,1]
var LOOPSIZE = [380,200]
var LOOPFOCUS = Math.sqrt(Math.pow(LOOPSIZE[0],2)-Math.pow(LOOPSIZE[1],2))
var MOBIUSY = 50
var Craig_zeroang = -0.3

var score = 0
var lives = 3
var asterN = 1

var fired = 0;
var fires = Array()
var spaceship = {"hangle":0,"vangle":0,"rotation":0,"speed":0,"direction":0}

var asteroids = Array()
var explode = Array()

var front_points = Array()
var back_points = Array()


function pass(){}
var interval = setInterval(pass, 10000)

// Game functions
function start_game(){
    reset()
    tick()
    clearInterval(interval)
    interval = setInterval(tick,1000/60);
}

function reset(){
    spaceship = {"hangle":0,"vangle":0,"rotation":0,"speed":0,"direction":0}
    if(options["surface"].substring(0,4)=="flat"){
        spaceship["hangle"] = WIDTH/2
        spaceship["vangle"] = HEIGHT/2
    } else if(options["surface"]=="sphere"){
        if(options["projection"]=="Mercator" || options["projection"]=="Gall"
        || options["projection"]=="Craig" || options["projection"]=="Robinson"
        || options["projection"] == "sinusoidal" || options["projection"]=="Mollweide"
        || options["projection"] == "Goode"){
            spaceship["hangle"] = Math.PI
        }
        if(options["projection"]=="stereographic"){
            spaceship["vangle"] = Math.PI/2
        }
        if(options["projection"]=="azim"){
            spaceship["vangle"] = Math.PI/2
        }
    } else if(options["surface"]=="torus"){
        if(options["projection"] == "projected"){
            spaceship["hangle"] = Math.PI
            spaceship["vangle"] = Math.PI
        } else {
            spaceship["hangle"] = 3*Math.PI/2
            spaceship["vangle"] = Math.PI/2
        }
    } else if(options["projection"]=="loop"){
        spaceship["hangle"] = WIDTH/2 - LOOPFOCUS
        spaceship["vangle"] = HEIGHT/2
    }
    score = 0
    lives = 1 ////3
    fired = 0
    fires = Array()
    explode = Array()
    asterN = 2
    asteroids = make_new_asteroids(asterN)
}

function make_new_asteroids(n){
    var out = Array()

    for(var i=0;i<n;i++){
        new_a = {"hangle":spaceship["hangle"],"vangle":spaceship["vangle"],
                 "rotation":Math.random()*Math.PI*2,"direction":Math.random()*Math.PI*2,
                 "size":4,"sides":2,
                 "radius":1,"speed":1}
        if(options["surface"].substring(0,4) == "flat"){
            new_a["speed"] = 0.5+Math.random()*0.5
            new_a["radius"] = 0.1
        } else if(options["surface"]=="sphere"){
            new_a["speed"] = 0.005+Math.random()*0.005
            new_a["radius"] = 0.01
        } else if(options["surface"]=="torus"){
            new_a["speed"] = 0.005+Math.random()*0.005
            new_a["radius"] = 0.01
        }
        if(options["surface"] == "pool"){
            new_a["speed"] = 0.5+Math.random()*0.5
            new_a["radius"] = 0.1
        }
        while(too_close(new_a,spaceship)){
            if(options["surface"].substring(0,4) == "flat"){
                new_a["hangle"] = Math.random()*WIDTH
                if(options["surface"]=="flatmobius" || options["surface"]=="flatcylinder"){
                    new_a["vangle"] = Math.random()*(HEIGHT-2*MOBIUSY) + MOBIUSY
                } else {
                    new_a["vangle"] = Math.random()*HEIGHT
                }
            } else if(options["surface"]=="sphere"){
                new_a["hangle"] = Math.random()*Math.PI*2
                new_a["vangle"] = Math.random()*Math.PI-Math.PI/2
            } else if(options["surface"]=="torus"){
                new_a["hangle"] = Math.random()*Math.PI*2
                new_a["vangle"] = Math.random()*Math.PI*2
            } else if(options["projection"] == "loop"){
                var angle = Math.random()*Math.PI*2
                var rad = Math.random()
                new_a["hangle"] = WIDTH/2+rad*LOOPSIZE[0]*Math.cos(angle)
                new_a["vangle"] = HEIGHT/2+rad*LOOPSIZE[1]*Math.sin(angle)
            }
        }
        var as = get_a_s(new_a)
        new_a["radius"] = as["radius"]
        new_a["sides"] = as["sides"]

        out[i] = new_a
    }
    return out
}

function too_close(p,q){
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        var d = 80
        var x1 = p["hangle"]
        var x2 = q["hangle"]
        var y1 = p["vangle"]
        var y2 = q["vangle"]
        var z1 = 0
        var z2 = 0
    } else if(options["surface"]=="sphere"){
        var d = 0.15
        var x1 = Math.cos(p["hangle"])*Math.cos(p["vangle"])
        var x2 = Math.cos(q["hangle"])*Math.cos(q["vangle"])
        var y1 = Math.cos(p["hangle"])*Math.sin(p["vangle"])
        var y2 = Math.cos(q["hangle"])*Math.sin(q["vangle"])
        var z1 = Math.sin(p["vangle"])
        var z2 = Math.sin(q["vangle"])
    } else if(options["surface"]=="torus"){
        var d = 0.2
        var x1 = Math.cos(p["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(p["vangle"]))
        var x2 = Math.cos(q["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(q["vangle"]))
        var y1 = Math.sin(p["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(p["vangle"]))
        var y2 = Math.sin(q["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(q["vangle"]))
        var z1 = TRADIUS[1]*Math.sin(p["vangle"])
        var z2 = TRADIUS[1]*Math.sin(q["vangle"])
    }
    if(Math.abs(x1-x2)<d && Math.abs(y1-y2)<d && Math.abs(z1-z2)<d){
        return true
    }
    return false
}

function tick(){
    if(quitPressed){
        show_menu()
        return
    }
    if(upPressed){
        increase_speed()
    } else {
        decrease_speed()
    }
    if(leftPressed){
        rotate_left()
    }
    if(rightPressed){
        rotate_right()
    }
    if(selectPressed && options["surface"] == "sphere" && !selectDone){
        selectDone = true
        console.log(projections)
        var pre_proj = options["projection"]
        while(pre_proj == options["projection"]){
            new_p = projections[Math.floor(Math.random() * projections.length)]
            options["projection"] = new_p[0]
            game_n = new_p[1]
            game_title = new_p[2]
        }
    }
    move_ship()
    move_fire()
    move_explodes()
    move_asteroids()

    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_scaled_text(ctx,""+score,20,38,0.6)
    draw_lives(ctx)
    ctx.stroke();

    front_points = Array()
    back_points = Array()

    draw_shape()
    draw_fire()
    draw_asteroids()
    draw_explodes()
    draw_ship()

    ctx.beginPath()
    ctx.strokeStyle = "#444444"
    for(var i=0;i<back_points.length;i++){
        draw_line(ctx,back_points[i][0],back_points[i][1],back_points[i][2],back_points[i][3])
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "#FFFFFF"
    for(var i=0;i<front_points.length;i++){
        draw_line(ctx,front_points[i][0],front_points[i][1],front_points[i][2],front_points[i][3])
    }
    ctx.stroke()

    if(lives<=0){highscore()}
}

function load_scores() {
    var score_file = "scores-" + options["surface"] + "-" + options["projection"]
    if (options["surface"] == "sphere"){
        score_file = "scores-sphere"
    }
    var data = localStorage.getItem(score_file)
    var scores = []
    if (data != null){
        scores = JSON.parse(data)
    }
    return scores
}

function save_scores(scores) {
    var score_file = "scores-" + options["surface"] + "-" + options["projection"]
    if (options["surface"] == "sphere"){
        score_file = "scores-sphere"
    }
    localStorage.setItem(score_file, JSON.stringify(scores))
}

function highscore() {
    clearInterval(interval)
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect((WIDTH-270)/2,(HEIGHT-50)/2,270,50);

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_text(ctx, "game over", (WIDTH-270)/2+10, (HEIGHT-50)/2+40)
    ctx.stroke();

    clearInterval(interval)
    var scores = load_scores()
    if (score > 0 && (scores.length < nscores || score > scores[2][0]))
    {
        setTimeout(enter_name,1000)
    } else {
        setTimeout(gameoveron,1000)
    }
}

function enter_name()
{
    entered_name = ""
    entered_letter = 0

    name_tick()
    clearInterval(interval)
    interval = setInterval(name_tick,1000/60);
}

function show_enter_name()
{
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_text(ctx, "high score", (WIDTH-300)/2+10, (HEIGHT-50)/2-100)
    add_text(ctx, "enter your name", (WIDTH-440)/2+10, (HEIGHT-50)/2-50)
    add_text(ctx, entered_name, (WIDTH-100)/2+10, (HEIGHT-50)/2 + 20)
    add_text(ctx, "<< " + entered_available_letters[entered_letter] + " >>", (WIDTH-150)/2+15, (HEIGHT-50)/2 + 70)
    ctx.stroke();
}

function name_tick(){
    if(leftPressed){
        if(leftTimer==0){
            entered_letter--
            if (entered_letter < 0)
            {
                entered_letter += entered_available_letters.length
            }
        }
        leftTimer++
        leftTimer%=15
    } else {
        leftTimer = 0
    }
    if(rightPressed){
        if(rightTimer==0){
            entered_letter++
            if (entered_letter >= entered_available_letters.length)
            {
                entered_letter -= entered_available_letters.length
            }
        }
        rightTimer++
        rightTimer%=15
    } else {
        rightTimer = 0
    }
    if(firePressed){
        if (entered_letter == entered_available_letters.indexOf("!"))
        {
            // END
            scores = load_scores()
            var i = 0
            while (i < scores.length && scores[i][0] >= score){i++}
            new_scores = []
            for (var j = 0; j < i; j++)
            {
                new_scores[new_scores.length] = scores[j]
            }
            new_scores[new_scores.length] = [score, entered_name]
            for (var j = i; j < scores.length && new_scores.length < nscores; j++)
            {
                new_scores[new_scores.length] = scores[j]
            }
            save_scores(new_scores)
            firePressed = false
            gameoveron()
            return;
        } else if (entered_letter == entered_available_letters.indexOf("$")) {
            entered_name = entered_name.substr(0, entered_name.length - 1)
        } else {
            if (entered_name.length >= 3){
            }
            entered_name += entered_available_letters[entered_letter]
            if (entered_name.length == 3){
                entered_letter = entered_available_letters.indexOf("!")
            }
        }
        firePressed = false
    }
    show_enter_name()
}

function gameoveron(){
    clearInterval(interval)
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(40,40,WIDTH-80,WIDTH-40);
    //ctx.fillRect((WIDTH-430)/2,(HEIGHT-50)/2+60,430,40);

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_scaled_text(ctx, "high scores", (WIDTH-200)/2+10, 80, 0.6)

    scores = load_scores()
    for (var i = 0; i < scores.length; i++)
    {
      add_scaled_text(ctx, scores[i][1], WIDTH/2 - 70, 140 + 40*i, 0.6)
      add_scaled_text(ctx, scores[i][0]+"", WIDTH/2 + 10, 140 + 40*i, 0.6)
    }
    add_scaled_text(ctx, "press button to continue", (WIDTH-430)/2+10, HEIGHT-40, 0.6)
    ctx.stroke();

    interval = setInterval(overtick,1000/60);
}
function overtick(){
    if(upPressed || firePressed || leftPressed || rightPressed || quitPressed){
        show_menu()
    }
}

function move_fire(){
    var new_fires = Array()
    for(var i=0;i<fires.length;i++){
        fires[i]["age"]++
        if(fires[i]["age"]<40){
            new_pos = move_on_surface(fires[i]["hangle"],fires[i]["vangle"],fires[i]["rotation"],fires[i]["speed"],1)
            fires[i]["hangle"] = new_pos["hangle"]
            fires[i]["vangle"] = new_pos["vangle"]
            fires[i]["rotation"] = new_pos["rotation"]
            new_fires[new_fires.length] = fires[i]
        }
    }
    fires = new_fires
    if(firePressed){
        if(fired==0){
            if(options["surface"].substring(0,4) == "flat" || options["surface"]=="pool"){
                var leng = 10
                var speed = 5
            } else if(options["surface"] == "sphere"){
                var leng = 0.1
                var speed = 0.05
            } else if(options["surface"] == "torus"){
                var leng = 0.1
                var speed = 0.05
            }
            new_pos = move_on_surface(spaceship["hangle"],spaceship["vangle"],spaceship["rotation"],leng,1)
            new_pos["speed"] = speed + spaceship["speed"]*(Math.cos(spaceship["rotation"]-spaceship["direction"]))
            new_pos["rotation"] = new_pos["rotation"]
            new_pos["age"] = 0
            fires[fires.length] = new_pos
        }
        fired++
        fired%=15
    }
    if(!firePressed){
        fired=0
    }
}

function move_explodes(){
    var new_explode = Array()
    for(var i=0;i<explode.length;i++){
        explode[i]["age"]++
        if(explode[i]["age"]<20){
            new_explode[new_explode.length] = explode[i]
        }
    }
    explode = new_explode
}

function increase_speed(){
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        var speed_add = 0.2
        var speed_max = 5
    } else if(options["surface"]=="sphere"){
        var speed_add = 0.002
        var speed_max = 0.05
    } else if(options["surface"]=="torus"){
        var speed_add = 0.002
        var speed_max = 0.05
    }

    var new_speed_x = spaceship["speed"]*Math.cos(spaceship["direction"]) + speed_add*Math.cos(spaceship["rotation"])
    var new_speed_y = spaceship["speed"]*Math.sin(spaceship["direction"]) + speed_add*Math.sin(spaceship["rotation"])
    var new_speed = Math.sqrt(new_speed_x*new_speed_x+new_speed_y*new_speed_y)
    spaceship["speed"] = Math.min(speed_max,new_speed)
    spaceship["direction"] = Math.atan2(new_speed_y,new_speed_x)
}

function decrease_speed(){
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        var slow=0.01
    } else if(options["surface"]=="sphere"){
        var slow=0.0001
    } else if(options["surface"]=="torus"){
        var slow=0.0001
    }

    spaceship["speed"] = Math.max(0,spaceship["speed"]-slow)
}

function rotate_left(){
    spaceship["rotation"] -= 0.07
}

function rotate_right(){
    spaceship["rotation"] += 0.07
}

function draw_lives(ctx){
    for(var i=0;i<lives;i++){
        ctx.moveTo(WIDTH-i*25-30,20)
        ctx.lineTo(WIDTH-i*25-20,40)
        ctx.lineTo(WIDTH-i*25-30,35)
        ctx.lineTo(WIDTH-i*25-40,40)
        ctx.lineTo(WIDTH-i*25-30,20)
    }
}

function draw_shape(){
    if(options["surface"]=="flatmobius" || options["surface"]=="flatcylinder"){
        for(var i=0;i<10;i++){
            add_line_to_draw(Array(i*WIDTH/10,MOBIUSY,(i+1)*WIDTH/10,MOBIUSY))
            add_line_to_draw(Array(i*WIDTH/10,HEIGHT-MOBIUSY,(i+1)*WIDTH/10,HEIGHT-MOBIUSY))
        }
    }
    if(options["projection"]=="loop"){
        N = 100
        var angle = 0
        var r = 0
        var prex=0
        var prey=0
        for(var i=0;i<=N;i++){
            var x = WIDTH/2+LOOPSIZE[0]*Math.cos(angle)
            var y = HEIGHT/2+LOOPSIZE[1]*Math.sin(angle)
            if(i>0){
                add_line_to_draw(Array(prex,prey,x,y))
            }
            prex = x
            prey = y
            angle += Math.PI*2/N
        }
        add_line_to_draw(Array(WIDTH/2+LOOPFOCUS-3,HEIGHT/2-3,WIDTH/2+LOOPFOCUS+3,HEIGHT/2+3))
        add_line_to_draw(Array(WIDTH/2+LOOPFOCUS-3,HEIGHT/2+3,WIDTH/2+LOOPFOCUS+3,HEIGHT/2-3))
        add_line_to_draw(Array(WIDTH/2-LOOPFOCUS-3,HEIGHT/2-3,WIDTH/2-LOOPFOCUS+3,HEIGHT/2+3))
        add_line_to_draw(Array(WIDTH/2-LOOPFOCUS-3,HEIGHT/2+3,WIDTH/2-LOOPFOCUS+3,HEIGHT/2-3))
    }
    if(options["surface"]=="sphere"){
        if(options["projection"]=="isometric"){
            for(var circle=0;circle<2;circle++){
                var vangle = 0
                var hangle = 0
                var N = 100
                if(circle==1){hangle=3*Math.PI/4}
                var prev = vangle
                var preh = hangle
                for(var i=0;i<N;i++){
                    if(circle==0){hangle += Math.PI*2/N}
                    else{vangle += Math.PI*2/N}
                    add_line_to_draw(Array(preh,prev,hangle,vangle))
                    prev = vangle
                    preh = hangle
                }
            }
        }
        if(options["projection"]=="stereographic"){
            var hangle = 0
            var N = 100
            var preh = 0
            for(var i=0;i<N;i++){
                hangle += Math.PI*2/N
                add_line_to_draw(Array(preh,0.01,hangle,0.01))
                add_line_to_draw(Array(preh,-0.01,hangle,-0.01))
                preh = hangle
            }
        }
        if(options["projection"]=="azim"){
            var hangle = 0
            var N = 100
            var preh = 0
            for(var i=0;i<N;i++){
                hangle += Math.PI*2/N
                add_line_to_draw(Array(preh,-Math.PI/2,hangle,-Math.PI/2))
                preh = hangle
            }
        }
        if(options["projection"]=="Craig"){
            var leng = 0.02
            add_line_to_draw(Array(Math.PI+leng,Craig_zeroang+leng,Math.PI-leng,Craig_zeroang-leng))
            add_line_to_draw(Array(Math.PI+leng,Craig_zeroang-leng,Math.PI-leng,Craig_zeroang+leng))

            var hangle = 0
            var N = 100
            var preh = 0
            var prev = 0
            for(var i=0;i<=N;i++){
                vangle = Math.atan(-Math.cos(hangle-Math.PI)/Math.tan(Craig_zeroang))-0.01
                if(i>0){
                    add_line_to_draw(Array(preh,Math.PI/2,hangle,Math.PI/2))
                    add_line_to_draw(Array(preh,-Math.PI/2,hangle,-Math.PI/2))
                    add_line_to_draw(Array(preh,prev,hangle,vangle))
                }
                preh = hangle
                prev = vangle
                hangle += Math.PI*2/N
            }
        }
        if(options["projection"]=="Robinson"){
            var N = 100

            var vangle = -Math.PI / 2
            var prev = 0
            for(var i=0;i<=N;i++){
                if(i>0){
                    add_line_to_draw(Array(0,prev,0,vangle))
                    add_line_to_draw(Array(2*Math.PI,prev,2*Math.PI,vangle))
                }
                prev = vangle
                vangle += Math.PI/N
            }
            var hangle = 0
            var preh = 0
            for(var i=0;i<=N;i++){
                if(i>0){
                    add_line_to_draw(Array(preh,Math.PI/2,hangle,Math.PI/2))
                    add_line_to_draw(Array(preh,-Math.PI/2,hangle,-Math.PI/2))
                }
                preh = hangle
                hangle += 2 * Math.PI/N
            }
        }
        if(options["projection"]=="sinusoidal" || options["projection"] == "Mollweide"){
            var N = 100

            var vangle = -Math.PI / 2
            var prev = 0
            for(var i=0;i<=N;i++){
                if(i>0){
                    add_line_to_draw(Array(0,prev,0,vangle))
                    add_line_to_draw(Array(2*Math.PI,prev,2*Math.PI,vangle))
                }
                prev = vangle
                vangle += Math.PI/N
            }
        }
        if(options["projection"]=="Goode"){
            var N = 100
            var eps = 0.0001

            var vangle = -Math.PI / 2
            var prev = 0
            for(var i=0;i<=N;i++){
                if(i>0){
                    add_line_to_draw(Array(0,prev,0,vangle))
                    add_line_to_draw(Array(2*Math.PI,prev,2*Math.PI,vangle))
                }
                prev = vangle
                vangle += Math.PI/N
            }
            vangle = 0
            prev = 0
            for(var i=0;i<=N;i++){
                if(i>0){
                    add_line_to_draw(Array(7*Math.PI/9-eps,-prev,7*Math.PI/9-eps,-vangle))
                    add_line_to_draw(Array(7*Math.PI/9+eps,-prev,7*Math.PI/9+eps,-vangle))
                    add_line_to_draw(Array(4*Math.PI/9-eps,prev,4*Math.PI/9-eps,vangle))
                    add_line_to_draw(Array(4*Math.PI/9+eps,prev,4*Math.PI/9+eps,vangle))
                    add_line_to_draw(Array(8*Math.PI/9-eps,prev,8*Math.PI/9-eps,vangle))
                    add_line_to_draw(Array(8*Math.PI/9+eps,prev,8*Math.PI/9+eps,vangle))
                    add_line_to_draw(Array(14*Math.PI/9-eps,prev,14*Math.PI/9-eps,vangle))
                    add_line_to_draw(Array(14*Math.PI/9+eps,prev,14*Math.PI/9+eps,vangle))
                }
                prev = vangle
                vangle += Math.PI * 0.5/N
            }
        }
    }
    if(options["surface"]=="torus"){
        if(options["projection"]=="top_v"){
            var hangle = 0
            var N = 100
            var preh = 0
            for(var i=0;i<N;i++){
                hangle += Math.PI*2/N
                add_line_to_draw(Array(preh,0,hangle,0))
                add_line_to_draw(Array(preh,Math.PI,hangle,Math.PI))
                preh = hangle
            }
        }
    }
}

function draw_ship(){
    if(lives>0){
        draw_sprite(ship_sprite(15))
    }
}

function draw_asteroids(){
    for(var i=0;i<asteroids.length;i++){
        draw_sprite(asteroid_sprite(asteroids[i]))
    }
}

function draw_fire(){
    for(var i=0;i<fires.length;i++){
        draw_sprite(fire_sprite(fires[i]))
    }
}

function draw_explodes(){
    for(var i=0;i<explode.length;i++){
        draw_sprite(explode_sprite(explode[i]))
    }
}

function draw_sprite(points_list){
    points_list.push(points_list[0])
    var preh = 0
    var prev = 0
    for(var j=0;j<points_list.length;j++){
        points = points_list[j]
        for(var i=0;i<points.length;i++){
            var hangle = points[i][0]
            var vangle = points[i][1]
            if(i>0){
                add_line_to_draw(Array(preh,prev,hangle,vangle))
            }
            preh = hangle
            prev = vangle
        }
    }
}

function move_ship(){
    spaceship = move_sprite(spaceship)
}

function move_sprite(sprite){
    var new_pos = move_on_surface(sprite["hangle"],sprite["vangle"],sprite["direction"],sprite["speed"],1)
    var rot = sprite["rotation"]
    sprite["rotation"] *= new_pos["flip"]
    sprite["rotation"] -= sprite["direction"]
    sprite["direction"] = new_pos["rotation"]
    sprite["rotation"] += new_pos["flip"]*sprite["direction"]
    sprite["hangle"] = new_pos["hangle"]
    sprite["vangle"] = new_pos["vangle"]
    if(options["surface"]=="pool"){sprite["rotation"]=rot}
    if(options["surface"]=="flatmobius" && new_pos["flip"]==1){sprite["rotation"]=rot}
    if(options["surface"]=="flatcylinder"){sprite["rotation"]=rot}
    return sprite
}

function get_a_s(a){
    var mult = 1
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        mult = 100
    }
    var out = {}
    if(a["size"]==4){
        out["radius"] = 0.1*mult
        out["sides"] = 6
    }
    if(a["size"]==3){
         out["radius"] = 0.085*mult
         out["sides"] = 5
    }
    if(a["size"]==2){
         out["radius"] = 0.07*mult
         out["sides"] = 4
    }
    if(a["size"]==1){
         out["radius"] = 0.06*mult
         out["sides"] = 3
    }
    return out
}

function close_to_asteroid(){
    for(var i=0;i<asteroids.length;i++){
        var a = asteroids[i]
        if(too_close(a,spaceship)){
            return true
        }
    }
    return false
}

function in_contact(points, a){
    if(options["surface"]=="torus"){
        var r = TRADIUS[1]
        var R = TRADIUS[0] + TRADIUS[1] * Math.cos(a["vangle"])
        for(var j=0;j<points.length;j++){
            if(Math.abs(a["hangle"]-points[j][0])<1.5*a["radius"]/R && Math.abs(a["vangle"]-points[j][1])<1.5*a["radius"]/r){
                return true;
            }
        }
        return false;
    }
    for(var j=0;j<points.length;j++){
        if(Math.abs(a["hangle"]-points[j][0])<0.9*a["radius"] && Math.abs(a["vangle"]-points[j][1])<0.9*a["radius"]){
            return true;
        }
    }
    return false;
}

function move_asteroids(){
    if(asteroids.length==0){
        asterN++
        score += 1000
        asteroids = make_new_asteroids(asterN)
    }
    var new_asteroids = Array()
    for(var i=0;i<asteroids.length;i++){
        var a = asteroids[i]
        move_sprite(a)

        var fireRemove = Array()

        var points = ship_sprite(1)[0]
        if(in_contact(ship_sprite(1)[0], a)){
            explode[explode.length] = {"hangle":spaceship["hangle"],"vangle":spaceship["vangle"],"age":0,"rotation":Math.random()*Math.PI,"speed":3}
            spaceship["rotation"] = Math.random()*2*Math.PI
            spaceship["direction"] = spaceship["rotation"]
            spaceship["speed"] = 0
            var counter = 0
            while(close_to_asteroid() && counter<50){
                counter ++
                if(options["surface"].substring(0,4)=="flat"){
                    spaceship["hangle"] = Math.random()*WIDTH
                    spaceship["vangle"] = Math.random()*HEIGHT
                } else if(options["surface"]=="sphere"){
                    spaceship["hangle"] = Math.random()*2*Math.PI
                    spaceship["vangle"] = Math.random()*Math.PI-Math.PI/2
                } else if(options["surface"]=="torus"){
                    spaceship["hangle"] = Math.random()*2*Math.PI
                    spaceship["vangle"] = Math.random()*Math.PI-Math.PI/2
                }
                if(options["projection"] == "loop"){
                    var angle = Math.random()*Math.PI*2
                    var rad = Math.random()
                    spaceship["hangle"] = WIDTH/2+rad*LOOPSIZE[0]*Math.cos(angle)
                    spaceship["vangle"] = HEIGHT/2+rad*LOOPSIZE[1]*Math.sin(angle)
                }
            }
            lives--
        }

        for(var j=0;j<fires.length;j++){
            if(in_contact([[fires[j]["hangle"],fires[j]["vangle"]]], a)){
                fireRemove[fireRemove.length]=j
                explode[explode.length] = {"hangle":a["hangle"],"vangle":a["vangle"],"age":0,"rotation":Math.random()*Math.PI,"speed":1}
            }
        }
        if(fireRemove.length==0){
            new_asteroids[new_asteroids.length] = a
        } else {
            if(a["size"]==4){score+=10}
            if(a["size"]==3){score+=15}
            if(a["size"]==2){score+=20}
            if(a["size"]==1){score+=30}
            var new_fires = Array()
            for(var j=0;j<fires.length;j++){
                if(!(j in fireRemove)){
                    new_fires[new_fires.length] = fires[j]
                }
            }
            fires = new_fires
            if(a["size"]>1){
                if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
                    var speed_start = 0.5
                } else if(options["surface"]=="sphere"){
                    var speed_start = 0.005
                } else if(options["surface"]=="torus"){
                    var speed_start = 0.005
                }

                var new_a = {"hangle":a["hangle"],"vangle":a["vangle"],
                             "rotation":a["rotation"]-Math.PI/4+Math.random()*Math.PI/2,"speed":speed_start+Math.random()*1.1*a["speed"],
                             "direction":a["direction"]-Math.PI/4+Math.random()*Math.PI/2,
                             "size":a["size"]-1,"radius":0.01,"sides":2}
                var as = get_a_s(new_a)
                new_a["radius"] = as["radius"]
                new_a["sides"] = as["sides"]
                new_asteroids[new_asteroids.length] = new_a

                var new_b = {"hangle":a["hangle"],"vangle":a["vangle"],
                             "rotation":a["rotation"]+Math.PI/4+Math.random()*Math.PI/2,"speed":speed_start+Math.random()*1.1*a["speed"],
                             "direction":a["direction"]+Math.PI/4+Math.random()*Math.PI/2,
                             "size":a["size"]-1,"radius":0.01,"sides":2}
                var as = get_a_s(new_b)
                new_b["radius"] = as["radius"]
                new_b["sides"] = as["sides"]
                new_asteroids[new_asteroids.length] = new_b
            }
        }
    }
    asteroids = new_asteroids
}

// sprites
function ship_sprite(N){
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        var size1 = 10
        var size2 = 15
        var leng = size1
        var leng2 = Math.sqrt(size1*size1+size2*size2+Math.sqrt(2)*size1*size2)
        var angle = Math.asin(size2/(Math.sqrt(2)*leng2))
        var bngle = Math.asin(size1/(Math.sqrt(2)*leng2))
        var cngle = Math.PI/4
    } else if(options["surface"]=="sphere"){
        var size1 = 0.05
        var size2 = 0.15
        var leng = Math.acos(Math.cos(size1)*Math.cos(size1))
        var leng2 = Math.acos(Math.cos(size1)*Math.cos(size2))
        var angle = Math.atan2(Math.sin(0.15),Math.sin(0.05)*Math.cos(0.15))-Math.atan2(1,Math.cos(0.05))
        var bngle = Math.atan2(Math.sin(0.05),Math.sin(0.15)*Math.cos(0.05))
        var cngle = Math.atan2(1,Math.cos(0.05))
    } else if(options["surface"]=="torus"){
        return torus_ship_sprite(N)
    }
    var out = Array()
    var p = {"hangle":spaceship["hangle"],"vangle":spaceship["vangle"],"rotation":spaceship["rotation"],"flip":1}
    out[out.length] = Array(p["hangle"],p["vangle"])

    p = add_to_surface(p["hangle"],p["vangle"],p["rotation"]+p["flip"]*(Math.PI-cngle),0,p["flip"])
    for(var i=1;i<=N;i++){
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],leng/N,p["flip"])
        out[out.length] = Array(p["hangle"],p["vangle"])
    }
    p = add_to_surface(p["hangle"],p["vangle"],p["rotation"]+p["flip"]*(Math.PI+angle),0,p["flip"])
    for(var i=1;i<=N;i++){
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],leng2/N,p["flip"])
        out[out.length] = Array(p["hangle"],p["vangle"])
    }


    p = add_to_surface(p["hangle"],p["vangle"],p["rotation"]+p["flip"]*(Math.PI+2*bngle),0,p["flip"])
    for(var i=1;i<=N;i++){
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],leng2/N,p["flip"])
        out[out.length] = Array(p["hangle"],p["vangle"])
    }

    p = add_to_surface(p["hangle"],p["vangle"],p["rotation"]+p["flip"]*(Math.PI+angle),0,p["flip"])
    for(var i=1;i<=N;i++){
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],leng/N,p["flip"])
        out[out.length] = Array(p["hangle"],p["vangle"])
    }
    return Array(out)
}

function torus_ship_sprite(N){
    ship2d = Array(Array(0,0))
    var size1 = 0.1
    var size2 = 0.15
    var leng = size1
    var leng2 = Math.sqrt(size1*size1 + size2*size2 + Math.sqrt(2)*size1*size2)
    var angle = Math.asin(size2/(Math.sqrt(2)*leng2))
    var cngle = Math.PI/4

    var px = 0
    var py = 0
    for(var i=1;i<=N;i++){
        px -= leng/N * Math.sin(cngle)
        py -= leng/N * Math.cos(cngle)
        ship2d[ship2d.length] = Array(px,py)
    }
    for(var i=1;i<=N;i++){
        px += leng2/N * Math.sin(cngle + angle)
        py += leng2/N * Math.cos(cngle + angle)
        ship2d[ship2d.length] = Array(px,py)
    }
    for(var i=1;i<=N;i++){
        px -= leng2/N * Math.sin(cngle + angle)
        py += leng2/N * Math.cos(cngle + angle)
        ship2d[ship2d.length] = Array(px,py)
    }
    for(var i=1;i<=N;i++){
        px += leng/N * Math.cos(cngle)
        py -= leng/N * Math.sin(cngle)
        ship2d[ship2d.length] = Array(px,py)
    }
    return Array(sprite_to_torus(ship2d, spaceship["hangle"], spaceship["vangle"], spaceship["rotation"]))
}

function sprite_to_torus(sprite2d, hangle, vangle, rot){
    var x = (TRADIUS[0] + TRADIUS[1]*Math.cos(vangle)) * Math.cos(hangle)
    var y = (TRADIUS[0] + TRADIUS[1]*Math.cos(vangle)) * Math.sin(hangle)
    var z = TRADIUS[1]*Math.sin(vangle)

    var dx = -Math.sin(hangle)*Math.cos(rot) - Math.cos(hangle)*Math.sin(vangle)*Math.sin(rot)
    var dy = Math.cos(hangle)*Math.cos(rot) - Math.sin(hangle)*Math.sin(vangle)*Math.sin(rot)
    var dz = Math.cos(vangle)*Math.sin(rot)

    var tx = Math.sin(hangle)*Math.sin(rot) - Math.cos(hangle)*Math.sin(vangle)*Math.cos(rot)
    var ty = -Math.cos(hangle)*Math.sin(rot) - Math.sin(hangle)*Math.sin(vangle)*Math.cos(rot)
    var tz = Math.cos(vangle)*Math.cos(rot)

    sprite_torus = Array()
    for(var i=0;i<sprite2d.length;i++){
        var px = sprite2d[i][0]
        var py = sprite2d[i][1]
        var x3 = x+dx*px+tx*py
        var y3 = y+dy*px+ty*py
        var z3 = z+dz*px+tz*py

        var hangle = Math.atan2(y3,x3)
        var vangle = Math.atan2(z3,Math.sqrt(x3*x3 + y3*y3)-TRADIUS[0])
        if(vangle > 2*Math.PI){
            vangle -= 2*Math.PI
        }
        if(vangle < 0){
            vangle += Math.PI*2
        }
        while(hangle < 0){
            hangle += 2*Math.PI
        }
        while(hangle > 2*Math.PI){
            hangle -= 2*Math.PI
        }
        sprite_torus[sprite_torus.length] = Array(hangle, vangle)
    }
    return sprite_torus
}

function fire_sprite(f){
    var out = Array()
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        var leng = 10
    } else if(options["surface"] == "sphere"){
        var leng = 0.1
    } else if(options["surface"] == "torus"){
        var leng = 0.1
    }
    var p = {"hangle":f["hangle"],"vangle":f["vangle"],"rotation":f["rotation"]}
    out[out.length] = Array(p["hangle"],p["vangle"])

    var N = 10
    for(var j=0;j<N;j++){
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],leng/N,1)
        out[out.length] = Array(p["hangle"],p["vangle"])
    }
    return Array(out)
}

function explode_sprite(f){
    var out = Array()
    var angles = Array(1,3,5)
    var mult = 1
    if(options["surface"].substring(0,4) == "flat" || options["surface"]=="pool"){
        mult = 100
    }

    if(f["speed"]>1){
        for(var i=0;i<angles.length;i++){
            var part = Array()
            var p = {"hangle":f["hangle"],"vangle":f["vangle"],"rotation":angles[i]+f["rotation"]}
            p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],f["speed"]*0.01*f["age"]*mult,1)
            part[part.length] = Array(p["hangle"],p["vangle"])
            var N = 10
            for(var j=0;j<N;j++){
                p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],0.1*mult/N,1)
                part[part.length] = Array(p["hangle"],p["vangle"])
            }
            out[out.length] = part
        }
    }
    for(var i=0;i<angles.length;i++){
        var part = Array()
        var p = {"hangle":f["hangle"],"vangle":f["vangle"],"rotation":angles[i]+3*f["rotation"]}
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],f["speed"]*0.005*mult*(f["age"]*(200-f["age"]))/60,1)
        part[part.length] = Array(p["hangle"],p["vangle"])

        var N = 10
        for(var j=0;j<N;j++){
            p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],0.05*mult/N,1)
            part[part.length] = Array(p["hangle"],p["vangle"])
        }
        out[out.length] = part
    }
    return out
}

function asteroid_sprite(a){
    var out = Array()
    var r = a["radius"]
    var sides = a["sides"]
    if(options["surface"].substring(0,4) == "flat" || options["surface"]=="pool"){
        var side_l = r*Math.sqrt(2-2*Math.cos(2*Math.PI/sides))
        var angle = (sides-2)*Math.PI/(2*sides)
    } else if(options["surface"] == "sphere"){
        var side_l = Math.acos(Math.cos(r)*Math.cos(r)+Math.sin(r)*Math.sin(r)*Math.cos(2*Math.PI/sides))
        var angle = Math.acos(Math.cos(r)*(1-Math.cos(side_l)) / (Math.sin(r)*Math.sin(side_l)))
    } else if(options["surface"] == "torus"){
        return torus_asteroid_sprite(a)
    }
    var p = {"hangle":a["hangle"],"vangle":a["vangle"],"rotation":a["rotation"],"flip":1}
    p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],r,p["flip"])
    p = add_to_surface(p["hangle"],p["vangle"],p["rotation"]+p["flip"]*angle,0,p["flip"])

    out[out.length] = Array(p["hangle"],p["vangle"])

    for(var i=0;i<sides;i++){
        p = add_to_surface(p["hangle"],p["vangle"],p["rotation"]+p["flip"]*(Math.PI-2*angle),0,p["flip"])

        var N = 10
        for(var j=0;j<N;j++){
            p = add_to_surface(p["hangle"],p["vangle"],p["rotation"],side_l/N,p["flip"])
            out[out.length] = Array(p["hangle"],p["vangle"])
        }
    }
    return Array(out)
}

function torus_asteroid_sprite(a){
    var out = Array()
    var r = a["radius"]
    var sides = a["sides"]
    var side_l = r*Math.sqrt(2-2*Math.cos(2*Math.PI/sides))
    var angle = 2*Math.PI/(sides)

    var asteroid2d = Array()
    var x=r
    var y=0
    asteroid2d[asteroid2d.length] = Array(x,y)

    for(var i=0;i<sides;i++){
        var N = 10
        for(var j=0;j<N;j++){
            x += side_l/N * Math.cos(i*angle)
            y -= side_l/N * Math.sin(i*angle)
            asteroid2d[asteroid2d.length] = Array(x,y)
        }
    }

    return Array(sprite_to_torus(asteroid2d, a["hangle"], a["vangle"], a["rotation"]))
}


// surface code
function add_line_to_draw(thing){
    if(options["surface"]=="torus" && options["projection"]=="top_v"){
        var vangle = (thing[1]+thing[3])/2
        var z = TRADIUS[1]*Math.sin(vangle)
        if(z<0){
            back_points[back_points.length] = thing
            return
        }
    }
    if(options["surface"]=="sphere" && options["projection"]=="isometric"){
        var hangle = (thing[0]+thing[2])/2
        var vangle = (thing[1]+thing[3])/2
        var x = Math.cos(vangle) * Math.cos(hangle)
        var y = Math.cos(vangle) * Math.sin(hangle)
        if(x+y<-0.1){
            back_points[back_points.length] = thing
            return
        }
    }
    if(options["surface"]=="sphere" && options["projection"]=="Craig"){
        var hangle = (thing[0]+thing[2])/2
        var vangle = (thing[1]+thing[3])/2
        if(vangle > Math.atan(-Math.cos(hangle-Math.PI)/Math.tan(Craig_zeroang))){
            back_points[back_points.length] = thing
            return
        }
    }
    front_points[front_points.length] = thing
}

function draw_line(ctx,preh,prev,hangle,vangle){
    if(options["surface"].substring(0,4)=="flat"){
        if(options["surface"]=="flattorus"){
            if(options["projection"]=="flat"){
                flat_torus_draw_line(ctx,preh,prev,hangle,vangle)
            }
        } else if(options["surface"]=="flatKlein"){
            if(options["projection"]=="flat"){
                flat_Klein_draw_line(ctx,preh,prev,hangle,vangle)
            }
        } else if(options["surface"]=="flatreal-pp"){
            if(options["projection"]=="flat"){
                flat_real_pp_draw_line(ctx,preh,prev,hangle,vangle)
            }
        } else if(options["surface"]=="flatmobius"){
            if(options["projection"]=="flat"){
                flat_mobius_draw_line(ctx,preh,prev,hangle,vangle)
            }
        } else if(options["surface"]=="flatcylinder"){
            if(options["projection"]=="flat"){
                flat_cylinder_draw_line(ctx,preh,prev,hangle,vangle)
            }
        }
    } else if(options["surface"]=="sphere"){
        if(options["projection"]=="Mercator"){
            Mercator_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Robinson"){
            Robinson_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="sinusoidal"){
            sinusoidal_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Mollweide"){
            Mollweide_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Goode"){
            Goode_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Gall"){
            Gall_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="azim"){
            azim_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Craig"){
            Craig_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="isometric"){
            isometric_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="stereographic"){
            stereographic_draw_line(ctx,preh,prev,hangle,vangle)
        }
    } else if(options["surface"]=="torus"){
        if(options["projection"]=="top_v"){
            torus_top_v_draw_line(ctx,preh,prev,hangle,vangle)
        }
        if(options["projection"]=="projected"){
            torus_projected_draw_line(ctx,preh,prev,hangle,vangle)
        }
    } else if(options["surface"]=="pool"){
        if(options["projection"]=="loop"){
            loop_draw_line(ctx,preh,prev,hangle,vangle)
        }
    }
}

function draw_xy(ctx,prex,prey,x,y){
    if( ( ( x>0 && x<WIDTH ) || ( prex>0 && prex<WIDTH) ) && ( ( y>0 && y<HEIGHT ) || ( prey>0 && prey<HEIGHT ) ) ){
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
    }
}

function add_to_surface(hangle,vangle,rot,badd,flip){
    return _add_to_surface_internal(hangle,vangle,rot,badd,flip,false)
}

function move_on_surface(hangle,vangle,rot,badd,flip){
    return _add_to_surface_internal(hangle,vangle,rot,badd,flip,true)
}

function _add_to_surface_internal(hangle, vangle, rot, badd, flip, moving){
    if(options["surface"]=="flatmobius"){
        hangle += badd*Math.cos(rot)
        vangle += badd*Math.sin(rot)
        if(hangle>WIDTH){
            hangle-=WIDTH
            vangle = HEIGHT - vangle
            rot *= -1
            flip *= -1
        }
        if(hangle<0){
            hangle+=WIDTH
            vangle = HEIGHT - vangle
            flip *= -1
            rot *= -1
        }
        if(moving){
            if(vangle < MOBIUSY){
                vangle = MOBIUSY + (MOBIUSY-vangle)
                rot = 2*Math.PI - rot
            }
            if(vangle > HEIGHT-MOBIUSY){
                vangle = HEIGHT-MOBIUSY + (HEIGHT-MOBIUSY-vangle)
                rot = 2*Math.PI - rot
            }
        }
        return {"hangle":hangle,"vangle":vangle,"rotation":rot,"flip":flip}
    }
    if(options["surface"]=="flatcylinder"){
        hangle += badd*Math.cos(rot)
        vangle += badd*Math.sin(rot)
        if(hangle>WIDTH){
            hangle-=WIDTH
        }
        if(hangle<0){
            hangle+=WIDTH
        }
        if(moving){
            if(vangle < MOBIUSY){
                vangle = MOBIUSY + (MOBIUSY-vangle)
                rot = 2*Math.PI - rot
            }
            if(vangle > HEIGHT-MOBIUSY){
                vangle = HEIGHT-MOBIUSY + (HEIGHT-MOBIUSY-vangle)
                rot = 2*Math.PI - rot
            }
        }
        return {"hangle":hangle,"vangle":vangle,"rotation":rot,"flip":flip}
    }
    if(options["surface"]=="pool"){
        hangle += badd*Math.cos(rot)
        vangle += badd*Math.sin(rot)
        if(moving){
            var sin = (vangle - HEIGHT/2) / LOOPSIZE[1]
            var cos = (hangle - WIDTH/2) / LOOPSIZE[0]
            if(Math.pow(sin,2)+Math.pow(cos,2) > 1){
                var Aa = Math.pow(LOOPSIZE[1],2) + Math.pow(LOOPSIZE[0]*Math.tan(rot),2)
                var Bb = Math.pow(LOOPSIZE[0],2) * (2*(vangle-HEIGHT/2)*Math.tan(rot) - 2*(hangle-WIDTH/2)*Math.pow(Math.tan(rot),2))
                var Cc = Math.pow(LOOPSIZE[0],2) * (Math.pow((hangle-WIDTH/2)*Math.tan(rot),2)-2*(hangle-WIDTH/2)*(vangle-HEIGHT/2)*Math.tan(rot)+Math.pow(vangle-HEIGHT/2,2)-Math.pow(LOOPSIZE[1],2))
                var x1 = WIDTH/2+(-Bb + Math.sqrt(Bb*Bb-4*Aa*Cc))/(2*Aa)
                var x2 = WIDTH/2+(-Bb - Math.sqrt(Bb*Bb-4*Aa*Cc))/(2*Aa)
                if(Math.abs(x1-hangle)<Math.abs(x2-hangle)){
                    var Xx = x1
                } else {
                    var Xx = x2
                }
                var Yy = (Xx-hangle)*Math.tan(rot) + vangle

                var dydx = Math.atan2((Xx-WIDTH/2)*LOOPSIZE[1]*LOOPSIZE[1], (Yy-HEIGHT/2)*LOOPSIZE[0]*LOOPSIZE[0])
                rot = 2*Math.PI - 2*dydx - rot
                dist = Math.sqrt(Math.pow(hangle-Xx,2)+Math.pow(vangle-Yy,2))
                hangle = Xx + dist*Math.cos(rot)
                vangle = Yy + dist*Math.sin(rot)
            }
        }
        return {"hangle":hangle,"vangle":vangle,"rotation":rot,"flip":flip}
    }
    if(options["surface"].substring(0,4)=="flat"){
        hangle += badd*Math.cos(rot)
        vangle += badd*Math.sin(rot)
        if(options["surface"]=="flattorus"){
            if(hangle>WIDTH){hangle-=WIDTH}
            if(hangle<0){hangle+=WIDTH}
            if(vangle>HEIGHT){vangle-=HEIGHT}
            if(vangle<0){vangle+=HEIGHT}
        } else if(options["surface"]=="flatKlein"){
            if(hangle>WIDTH){
                hangle-=WIDTH
                vangle = HEIGHT - vangle
                rot *= -1
                flip *= -1
            }
            if(hangle<0){
                hangle+=WIDTH
                vangle = HEIGHT - vangle
                flip *= -1
                rot *= -1
            }
            if(vangle>HEIGHT){vangle-=HEIGHT}
            if(vangle<0){vangle+=HEIGHT}
        } else if(options["surface"]=="flatreal-pp"){
            if(hangle>WIDTH){
                hangle-=WIDTH
                vangle = HEIGHT - vangle
                rot *= -1
                flip *= -1
            }
            if(hangle<0){
                hangle+=WIDTH
                vangle = HEIGHT - vangle
                flip *= -1
                rot *= -1
            }
            if(vangle>HEIGHT){
                vangle-=HEIGHT
                hangle = WIDTH - hangle
                rot = Math.PI - rot
                flip *= -1
            }
            if(vangle<0){
                vangle+=HEIGHT
                hangle = WIDTH - hangle
                rot = Math.PI - rot
                flip *= -1
            }
        }

        return {"hangle":hangle,"vangle":vangle,"rotation":rot,"flip":flip}

    } else if(options["surface"]=="sphere"){
        var alpha = Math.acos(Math.cos(rot)*Math.cos(vangle))
        var a = hangle - Math.atan2(Math.cos(rot) * Math.sin(vangle),Math.sin(rot))
        var b = Math.atan2(Math.sin(vangle), Math.sin(rot)*Math.cos(vangle))

        b += badd/RADIUS

        hangle = a + Math.atan2(Math.cos(alpha)*Math.sin(b),Math.cos(b))
        vangle = Math.asin(Math.sin(b) * Math.sin(alpha))
        rot = Math.atan2(Math.cos(b)*Math.sin(alpha),Math.cos(alpha))

        if(vangle > Math.PI/2){
            hangle += Math.PI
            vangle = Math.PI-vangle
        }
        if(vangle < -Math.PI/2){
            hangle += Math.PI
            vangle = -Math.PI-vangle
        }
        while(hangle < 0){
            hangle += 2*Math.PI
        }
        while(hangle > 2*Math.PI){
            hangle -= 2*Math.PI
        }
        return {"hangle":hangle,"vangle":vangle,"rotation":rot,"flip":flip}
    } else if(options["surface"]=="torus"){

        var steps = 1 + Math.floor(badd * 1000)
        var stepsize = badd / steps
        for(var i=0;i<steps;i++){
            var x = (TRADIUS[0] + TRADIUS[1]*Math.cos(vangle)) * Math.cos(hangle)
            var y = (TRADIUS[0] + TRADIUS[1]*Math.cos(vangle)) * Math.sin(hangle)
            var z = TRADIUS[1]*Math.sin(vangle)

            var dx = -Math.sin(hangle)*Math.cos(rot) - Math.cos(hangle)*Math.sin(vangle)*Math.sin(rot)
            var dy = Math.cos(hangle)*Math.cos(rot) - Math.sin(hangle)*Math.sin(vangle)*Math.sin(rot)
            var dz = Math.cos(vangle)*Math.sin(rot)

            x += stepsize * dx
            y += stepsize * dy
            z += stepsize * dz

            hangle = Math.atan2(y,x)
            vangle = Math.atan2(z,Math.sqrt(x*x + y*y)-TRADIUS[0])

            v1 = -Math.sin(hangle)*dx + Math.cos(hangle)*dy
            v2 = -Math.cos(hangle)*Math.sin(vangle)*dx - Math.sin(hangle)*Math.sin(vangle)*dy + Math.cos(vangle)*dz
            rot = Math.atan2(v2, v1)

            if(vangle > 2*Math.PI){
                vangle -= 2*Math.PI
            }
            if(vangle < 0){
                vangle += Math.PI*2
            }
            while(hangle < 0){
                hangle += 2*Math.PI
            }
            while(hangle > 2*Math.PI){
                hangle -= 2*Math.PI
            }
            while(rot < 0){
                rot += 2*Math.PI
            }
            while(rot >= 2*Math.PI){
                rot -= 2*Math.PI
            }
        }

        return {"hangle":hangle,"vangle":vangle,"rotation":rot,"flip":flip}
    }
}

// isometric
function isometric_xy(hangle,vangle){
    var x = RADIUS * Math.cos(vangle) * Math.cos(hangle)
    var y = RADIUS * Math.cos(vangle) * Math.sin(hangle)
    var z = RADIUS * Math.sin(vangle)
    var x2 = (x-y) * Math.sin(30)
    var y2 = z + (x+y) * Math.cos(30)
    var out = {}
    out["x"] = WIDTH/2 + x2/(2.2*RADIUS) * Math.min(HEIGHT, WIDTH)
    out["y"] = HEIGHT/2 + y2/(2.2*RADIUS) * Math.min(HEIGHT, WIDTH)
    return out
}

function isometric_draw_line(ctx,preh,prev,h,v){
    var xy = isometric_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = isometric_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    draw_xy(ctx,prex,prey,x,y)
}

// stereographic
function stereographic_xy(hangle,vangle){
    var x = Math.cos(vangle) * Math.cos(hangle)
    var y = Math.cos(vangle) * Math.sin(hangle)
    var z = Math.sin(vangle)
    var out = {}
    var R = WIDTH/5
    if(z>0){
        out["x"] = WIDTH/4+R*x/(1+z)
        out["y"] = HEIGHT/2+R*y/(1+z)
    } else {
        out["x"] = 3*WIDTH/4-R*x/(1-z)
        out["y"] = HEIGHT/2+R*y/(1-z)
    }
    return out
}

function stereographic_draw_line(ctx,preh,prev,h,v){
    var xy = stereographic_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = stereographic_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]

    if(Math.max(x,prex)>WIDTH/2 && Math.min(x,prex)<WIDTH/2){
        hmid = preh+Math.tan(preh-h)*Math.sin(prev)/Math.sin(prev-v)
        var mid1 = stereographic_xy(hmid,0.01)
        var mid2 = stereographic_xy(hmid,-0.01)
        ctx.moveTo(mid1["x"],mid1["y"])
        if(x<prex){
            draw_xy(ctx,mid1["x"],mid1["y"],x,y)
        } else {
            draw_xy(ctx,mid1["x"],mid1["y"],prex,prey)
        }
        if(x>prex){
            draw_xy(ctx,mid2["x"],mid2["y"],x,y)
        } else {
            draw_xy(ctx,mid2["x"],mid2["y"],prex,prey)
        }
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Craig
function Craig_xy(hangle,vangle){
    hangle -= Math.PI
    var x = WIDTH/2 + hangle * WIDTH/(2*Math.PI)
    if(Math.abs(hangle)<0.01){
        var k = 1
    } else {
        var k = hangle/Math.sin(hangle)
    }
    var y = HEIGHT/2 + WIDTH/(2*Math.PI)*k*(Math.sin(vangle)*Math.cos(hangle) - Math.tan(Craig_zeroang)*Math.cos(vangle))
    return {"x":x,"y":y}
}

function Craig_draw_line(ctx,preh,prev,h,v){
    if(Math.abs(prev) < Math.PI/2-0.02 || Math.abs(h-preh)<0.1){
        var xy = Craig_xy(preh,prev)
        var prex = xy["x"]
        var prey = xy["y"]
        xy = Craig_xy(h,v)
        var x = xy["x"]
        var y = xy["y"]
        if(Math.abs(y-prey) < HEIGHT/2 && Math.abs(x-prex) < WIDTH/2){
            draw_xy(ctx,prex,prey,x,y)
        }
    }
}

// azim
function azim_xy(hangle,vangle){
    var p = HEIGHT/7 * (Math.PI/2 - vangle)
    y = HEIGHT/2 -p*Math.cos(hangle)
    x = WIDTH/2 + p*Math.sin(hangle)
    return {"x":x,"y":y}
}

function azim_draw_line(ctx,preh,prev,h,v){
    var xy = azim_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = azim_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if(Math.abs(x-prex) + Math.abs(y-prey) < 50){
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Mercator
function Mercator_xy(hangle,vangle){
    var x = WIDTH * hangle/(2*Math.PI)
    var y = 0
    var maxa = 87.05 * Math.PI/180
    if(-maxa <= vangle <= maxa){
        y = HEIGHT/2 + HEIGHT/2 * Math.log(Math.tan(Math.PI/4+vangle/2))/Math.log(Math.tan(Math.PI/4+maxa/2))
    } else if(vangle > maxa){
        y = -5
    } else {
        y = HEIGHT+5
    }
    return {"x":x,"y":y}
}

function Mercator_draw_line(ctx,preh,prev,h,v){
    var xy = Mercator_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = Mercator_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Robinson
function Robinson_compute(vangle){
    var Robinson_interpolation = {
       0: [1.0000, 0.0000],
       5: [0.9986, 0.0620],
      10: [0.9954, 0.1240],
      15: [0.9900, 0.1860],
      20: [0.9822, 0.2480],
      25: [0.9730, 0.3100],
      30: [0.9600, 0.3720],
      35: [0.9427, 0.4340],
      40: [0.9216, 0.4958],
      45: [0.8962, 0.5571],
      50: [0.8679, 0.6176],
      55: [0.8350, 0.6769],
      60: [0.7986, 0.7346],
      65: [0.7597, 0.7903],
      70: [0.7186, 0.8435],
      75: [0.6732, 0.8936],
      80: [0.6213, 0.9394],
      85: [0.5722, 0.9761],
      90: [0.5322, 1.0000]
    }
    var post = 5
    var vangle_deg = Math.abs(vangle * 180 / Math.PI)
    while (vangle_deg > post){
        post += 5
    }
    if (post > 90){ post = 90 }
    var pre_v = Robinson_interpolation[post - 5]
    var post_v = Robinson_interpolation[post]
    var X = pre_v[0] + (post_v[0] - pre_v[0]) * (vangle_deg - post + 5) / 5
    var Y = pre_v[1] + (post_v[1] - pre_v[1]) * (vangle_deg - post + 5) / 5
    return [X, Y]
}

function Robinson_xy(hangle,vangle){
    var XY = Robinson_compute(vangle)
    var R = 140
    var x = WIDTH/2 + 0.8487 * R * XY[0] * (hangle - Math.PI)
    var y = HEIGHT/2
    if (vangle < 0){
        y -= 1.3523 * R * XY[1]
    } else {
        y += 1.3523 * R * XY[1]
    }
    return {"x":x,"y":y}
}

function Robinson_draw_line(ctx,preh,prev,h,v){
    var xy = Robinson_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = Robinson_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if(Math.abs(h-preh) < Math.PI / 5){
        draw_xy(ctx,prex,prey,x,y)
    }
}

// sinusoidal
function sinusoidal_xy(hangle,vangle){
    var R = 120
    var x = WIDTH/2 + R * (hangle - Math.PI) * Math.cos(vangle)
    var y = HEIGHT/2 + R * vangle
    return {"x":x,"y":y}
}

function sinusoidal_draw_line(ctx,preh,prev,h,v){
    var xy = sinusoidal_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = sinusoidal_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if(Math.abs(h-preh) < Math.PI / 5){
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Mollweide
function compute_theta(vangle){
    var theta = vangle
    if (theta > -Math.PI/2 + 0.02 && theta < Math.PI/2 - 0.02){
        for (var i = 0; i < 10; i++){
            theta = theta - (2 * theta + Math.sin(2 * theta) - Math.PI * Math.sin(vangle)) / (2 + 2 * Math.cos(2 * theta))
        }
    }
    return theta
}

function Mollweide_xy(hangle,vangle){
    var R = 120
    var theta = compute_theta(vangle)
    var x = WIDTH/2 + R * 2 * Math.sqrt(2) / Math.PI * (hangle - Math.PI) * Math.cos(theta)
    var y = HEIGHT/2 + R * Math.sqrt(2) * Math.sin(theta)
    return {"x":x,"y":y}
}

function Mollweide_draw_line(ctx,preh,prev,h,v){
    var xy = Mollweide_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = Mollweide_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if(Math.abs(h-preh) < Math.PI / 5){
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Goode
function Goode_xy(hangle,vangle){
    var R = 120
    var start = 0
    var mid = Math.PI
    if (vangle < 0){
        if (hangle < 7*Math.PI/9){
            mid = 4*Math.PI/9
        } else {
            start = 7*Math.PI/9
            mid = 21*Math.PI/18
        }
    } else {
        if (hangle < 4*Math.PI/9){
            mid = Math.PI/9
        } else if (hangle < 8*Math.PI/9){
            start = 4*Math.PI/9
            mid = 6*Math.PI/9
        } else if (hangle < 14*Math.PI/9){
            start = 8*Math.PI/9
            mid = 10*Math.PI/9
        } else {
            start = 14*Math.PI/9
            mid = 16*Math.PI/9
        }
    }

    var A = 40.7 * Math.PI/180

    var x = 0
    var y = 0
    if (vangle < -A || vangle > A){
        if (vangle < -A){
            A = -A
        }
        var theta = compute_theta(vangle)
        var theta_A = compute_theta(A)
        x = WIDTH/2
        y = HEIGHT/2

        x += R * (mid - Math.PI) + R * (start - mid) * Math.cos(A)
        y += R * A
        x -= R * 2 * Math.sqrt(2) / Math.PI * (start - mid) * Math.cos(theta_A)
        y -= R * Math.sqrt(2) * Math.sin(theta_A)

        x += R * 2 * Math.sqrt(2) / Math.PI * (hangle - mid) * Math.cos(theta)
        y += R * Math.sqrt(2) * Math.sin(theta)

    } else {
        var R = 120
        x = WIDTH/2 + R * (mid - Math.PI) + R * (hangle - mid) * Math.cos(vangle)
        y = HEIGHT/2 + R * vangle
    }
    return {"x":x,"y":y}
}

function Goode_draw_line(ctx,preh,prev,h,v){
    var xy = Goode_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = Goode_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if (v < 0){
        if(h > 7*Math.PI/9 && preh < 7*Math.PI/9){ return }
        if(preh > 7*Math.PI/9 && h < 7*Math.PI/9){ return }
    } else {
        if(h > 4*Math.PI/9 && preh < 4*Math.PI/9){ return }
        if(preh > 4*Math.PI/9 && h < 4*Math.PI/9){ return }
        if(h > 8*Math.PI/9 && preh < 8*Math.PI/9){ return }
        if(preh > 8*Math.PI/9 && h < 8*Math.PI/9){ return }
        if(h > 14*Math.PI/9 && preh < 14*Math.PI/9){ return }
        if(preh > 14*Math.PI/9 && h < 14*Math.PI/9){ return }
    }

    if(Math.abs(h-preh) < Math.PI / 5){
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Gall
function Gall_xy(hangle,vangle){
    var x = WIDTH * hangle/(2*Math.PI)
    var y = HEIGHT/2+HEIGHT/2*Math.sin(vangle)
    return {"x":x,"y":y}
}

function Gall_draw_line(ctx,preh,prev,h,v){
    var xy = Gall_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = Gall_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

// flat_torus
function flat_torus_draw_line(ctx,prex,prey,x,y){
    if(Math.abs(x-prex)>WIDTH/2 && Math.abs(y-prey)>HEIGHT/2){
        // currently hide these lines
    } else if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else if(Math.abs(y-prey)>HEIGHT/2){
        if(y < prey){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        xmid = yb*(xb-xa)/(ya-yb-HEIGHT) + xb
        draw_xy(ctx,xa,ya,xmid,HEIGHT)
        draw_xy(ctx,xmid,0,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

// flat_Klein
function flat_Klein_draw_line(ctx,prex,prey,x,y){
    if(Math.abs(x-prex)>WIDTH/2 && Math.abs(y-prey)>HEIGHT/2){
        // currently hide these lines
    } else if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-HEIGHT+ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,HEIGHT-ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else if(Math.abs(y-prey)>HEIGHT/2){
        if(y < prey){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        xmid = yb*(xb-xa)/(ya-yb-HEIGHT) + xb
        draw_xy(ctx,xa,ya,xmid,HEIGHT)
        draw_xy(ctx,xmid,0,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

// flat_real_pp
function flat_real_pp_draw_line(ctx,prex,prey,x,y){
    if(Math.abs(x-prex)>WIDTH/2 && Math.abs(y-prey)>HEIGHT/2){
        // currently hide these lines
    } else if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-HEIGHT+ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,HEIGHT-ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else if(Math.abs(y-prey)>HEIGHT/2){
        if(y < prey){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        xmid = yb*(xb-WIDTH+xa)/(ya-yb-HEIGHT) + xb
        draw_xy(ctx,xa,ya,WIDTH-xmid,HEIGHT)
        draw_xy(ctx,xmid,0,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

// Torus top_v
function torus_top_v_xy(hangle,vangle){
    var x = Math.cos(hangle)*(TRADIUS[0]+TRADIUS[1]*Math.cos(vangle))
    var y = Math.sin(hangle)*(TRADIUS[0]+TRADIUS[1]*Math.cos(vangle))
    var z = TRADIUS[1]*Math.sin(vangle)
    //var x2 = (x-y) * Math.sin(30)
    //var y2 = z + (x+y) * Math.cos(30)
    var x2 = x
    var y2 = y
    var out = {}
    out["x"] = WIDTH/2 + x2/(3.2*RADIUS) * Math.min(HEIGHT, WIDTH)
    out["y"] = HEIGHT/2 + y2/(3.2*RADIUS) * Math.min(HEIGHT, WIDTH)
    return out
}

function torus_top_v_draw_line(ctx,preh,prev,h,v){
    var xy = torus_top_v_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = torus_top_v_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    draw_xy(ctx,prex,prey,x,y)
}


// Torus projected
function torus_projected_xy(hangle,vangle){
    var out = {}
    out["x"] = WIDTH*hangle/(2*Math.PI)
    out["y"] = HEIGHT*vangle/(2*Math.PI)
    return out
}

function torus_projected_draw_line(ctx,preh,prev,h,v){
    var xy = torus_projected_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = torus_projected_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    flat_torus_draw_line(ctx,prex,prey,x,y)
}

// loop
function loop_draw_line(ctx,prex,prey,x,y){
    draw_xy(ctx,prex,prey,x,y)
}
// mobius
function flat_mobius_draw_line(ctx,prex,prey,x,y){
    if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-HEIGHT+ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,HEIGHT-ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}


// cylinder
function flat_cylinder_draw_line(ctx,prex,prey,x,y){
    if(Math.abs(x-prex)>WIDTH/2){
        if(x < prex){
            xa = prex
            xb = x
            ya = prey
            yb = y
        } else {
            xa = x
            xb = prex
            ya = y
            yb = prey
        }
        ymid = xb*(yb-ya)/(xa-xb-WIDTH) + yb
        draw_xy(ctx,xa,ya,WIDTH,ymid)
        draw_xy(ctx,0,ymid,xb,yb)
    } else {
        draw_xy(ctx,prex,prey,x,y)
    }
}

