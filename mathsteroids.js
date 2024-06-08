/**********************************************/
/*                                            */
/*                Mathsteroids                */
/*                                            */
/*         Created by Matthew Scroggs         */
/*         mscroggs.co.uk/mathsteroids        */
/*      github.com/mscroggs/mathsteroids      */
/*                                            */
/* This code is licensed under an MIT license */
/**********************************************/

// inputs
var quitPressed  = false;
var upPressed    = false;
var firePressed  = false;
var leftPressed  = false;
var rightPressed = false;
var selectPressed = false;
var selectDone = false;
var mutePressed = false
var mute = false
var titlescreen = true

if(game_config("sound")){
    var sound_fire = new Audio(game_config("sound-dir") + '/fire.wav');
    var sound_thrust = new Audio(game_config("sound-dir") + '/thrust.wav');
    sound_thrust.loop = true
    var sound_bang_large = new Audio(game_config("sound-dir") + '/bangLarge.wav');
    var sound_bang_medium = new Audio(game_config("sound-dir") + '/bangMedium.wav');
    var sound_bang_small = new Audio(game_config("sound-dir") + '/bangSmall.wav');
    var sound_level_up = new Audio(game_config("sound-dir") + '/levelUp.wav');
    var sound_next = new Audio(game_config("sound-dir") + '/next.wav');
    var sound_start = new Audio(game_config("sound-dir") + '/start.wav');

    var sounds = [sound_fire, sound_thrust, sound_bang_large, sound_bang_medium,
                  sound_bang_small, sound_level_up, sound_next, sound_start]
    // force load
    for(var i = 0; i < sounds.length; i++){
        var a = sounds[i].cloneNode()
        a.volume = 0
        a.play()
    }
}

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
    // Sphere levels
    ["sphere (mercator projection)","sphere","Mercator","the mercator projection is most widely used map projection and is used to make most maps of the world. paths on the globe with a constant bearing from north appear as straight lines on the map."],
    ["sphere (isometric)","sphere","isometric","in this level the sphere is represented isometrically with the back half of the sphere shown in grey."],
    ["sphere (stereographic projection)","sphere","stereographic","a stereographic projection is the result of putting a transparent sphere with a light source at its top point on a flat surface. this level is split into two parts: the images of the southern hemisphere with a light at the north pole and the northern hemisphere with a light at the south pole."],
    ["sphere (gall-peters projection)","sphere","Gall","the gall-peters projection is an area preserving projection: two shapes on the map will have the same relative sizes as they do on the globe."],
    ["sphere (craig retroazimuthal projection)","sphere","Craig","the craig projection preserves angles from every point to the point marked with a cross. if it is centred on mecca then it can be used as a prayer map as the angle from north to mecca on the map will be the same as the angle from north you should face."],
    ["sphere (azimuthal projection)","sphere","azim","the azimuthal projection preserves angles from the centre point to every other point. an azimulthal map of the world appears in the un logo."],
    ["sphere (robinson projection)","sphere","Robinson","the robinson projection is a comprimise projection: it preserves neither angles nor sizes but it doesn't change either by too much."],
    ["sphere (sinusoidal projection)","sphere","sinusoidal","the sinusoidal projection is an area preserving projection: two shapes on the map will have the same relative sizes as they do on the globe."],
    ["sphere (mollweide projection)","sphere","Mollweide","the mollweide projection is an area preserving projection: two shapes on the map will have the same relative sizes as they do on the globe."],
    ["sphere (goode homolosine projection)","sphere","Goode","the goode homolosine projection is an area preserving projection: two shapes on the map will have the same relative sizes as they do on the globe. the map has gaps where it jumps from one place to another: these are usually placed in the middle on an ocean so that landmasses are uninterrupted on this map."],
    ["sphere (van der grinten projection)","sphere","van der Grinten","the van der grinten projection is a comprimise projection: it preserves neither angles nor sizes but it doesn't change either by too much."],
    ["sphere (plate carEe projection)","sphere","plate caree","the plate carEe projection is the result of mapping the longitute and latitude directly to x and y coordinates."],
    ["sphere (dymaxion map)","sphere","dymaxion","the dymaxion map is the result of approximating the sphere as an icosahedron then flattening out a net of this icosahedron."],
    ["sphere (tetrahedron net)","sphere","tetrahedron","this level is the result of approximating the sphere as an tetrahedron then flattening out a net of this tetrahedron."],
    ["sphere (cube net)","sphere","cube","this level is the result of approximating the sphere as an cube then flattening out a net of this cube."],
    ["sphere (octahedron net)","sphere","octahedron","this level is the result of approximating the sphere as an octahedron then flattening out a net of this octahedron."],
    ["sphere (dodecahedron net)","sphere","dodecahedron","this level is the result of approximating the sphere as an dodecahedron then flattening out a net of this dodecahedron."],
    ["sphere (icosahedron net)","sphere","icosahedron","this level is the result of approximating the sphere as an icosahedron then flattening out a net of this icosahedron."],

    // Flat levels
    ["(flat) cylinder","flatcylinder","flat","this level takes place on a cylinder. if you go off the left side then you come back on the right side."],
    ["(flat) mObius strip","flatmobius","flat","this level takes place on a mObius strip: a loop of paper with a twist in it. if you go odd the left side then you come back on the right side but upside down."],
    ["(flat) torus","flattorus","flat","this level takes place on a (flat) torus or doughnut. if you go off the left side then you come back on the right side and if you go off the top then you come back on the bottom. this is the level that appears in the standard asteroids game."],
    ["(flat) klein bottle","flatKlein","flat","this level takes place on a klein bottle: a 4 dimensional shape. if you go off the left side then you come back on the right side but upside down and if you go off the top then you come back on the bottom."],
    ["(flat) real projective plane","flatreal-pp","flat","this level takes place on the real projective plane: a 4 dimensional shape that's even harder to visualise than the klein bottle. if you go off the left side then you come back on the right side but upside down and if you go off the top then you come back on the bottom but leftside right."],
    ["unbounded 2d space","flatunbounded", "unbounded","this level takes place in unbounded 2d space: if you go near the edges then the level will scroll sideways."],
    ["loop (elliptical pool table)","pool","loop","this level takes place inside an ellipse with bouncy sides. the two crosses shown in the level are the two foci of the ellipse. if you fly through one focus then bounce off the side (without firing your engines) you will end up going through the other focus."],

    // Torus levels
    ["torus (top view)","torus","top_v","this level takes place on a (non-flat) torus viewed from above."],
    ["torus (projected)","torus","projected","this level takes place on a (non-flat) torus. the connectivity is the same as the standard level but you don't always travel in a straight line due to the curvature of the torus."],

    // Hyperbolic levels
    ["hyperbolic circle (poincarE disk)","hyperbolic","Poincare","this level takes place in hyperbolic space. straight lines in the poincarE disk are represented by circles that meet the edge of the disk at right angles. this level is bounded: if you go too far from the centre you will bounce off the edge."],
    ["hyperbolic circle (beltrami-klein)","hyperbolic","Beltrami-Klein","this level takes place in hyperbolic space. straight lines in the beltrami-klein disk are represented by straight lines. this level is bounded: if you go too far from the centre you will bounce off the edge."],
    ["hyperbolic circle (poincarE half-plane)","hyperbolic","Poincare HP","this level takes place in hyperbolic space. straight lines in the poincarE half-plane are represented by circles that meet the edge of the half-plane at right angles. this level is bounded: if you go too far from the centre you will bounce off the edge."],
    ["hyperbolic circle (hyperboloid)","hyperbolic","hyperboloid","this level takes place in hyperbolic space represented on a hyperboloid. this level is bounded: if you go too far from the centre you will bounce off the edge."],
    ["hyperbolic circle (gans)","hyperbolic","gans","this level takes place in hyperbolic space represented using the gans model. this level is bounded: if you go too far from the centre you will bounce off the edge."],
    ["hyperbolic circle (band)","hyperbolic","band","this level takes place in hyperbolic space represented using the band model. this level is bounded: if you go too far from the centre you will bounce off the edge."],
    ["unbounded hyperbolic (poincarE disk)","hyperbolicunbounded","Poincare","this level takes place in hyperbolic space. straight lines in the poincarE disk are represented by circle that meet the edge of the disk at right angles. this level is unbounded: if you go too far from the centre then the level will scroll."],
    ["unbounded hyperbolic (beltrami-klein)","hyperbolicunbounded","Beltrami-Klein","this level takes place in hyperbolic space. straight lines in the beltrami-klein disk are represented by straight lines. this level is unbounded: if you go too far from the centre then the level will scroll."],

    // Credits
    ["credits","flattorus","flat","play this level to find out who made this game"],
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
var HYPER_RADIUS = 2

var score = 0
var lives = 3
var timestarted = 0
var timeleft = 60000
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
        || options["projection"] == "Goode" || options["projection"] == "van der Grinten"
        || options["projection"] == "plate caree"){
            spaceship["hangle"] = Math.PI
        }
        if(options["projection"]=="stereographic"){
            spaceship["vangle"] = Math.PI/2
        }
        if(options["projection"]=="azim"){
            spaceship["vangle"] = Math.PI/2
        }
        if(options["projection"]=="octahedron"){
            spaceship["hangle"] = Math.PI/4
        }
        if(options["projection"]=="dodecahedron"){
            spaceship["hangle"] = 1.35*Math.PI
        }
        if(options["projection"]=="dymaxion"){
            spaceship["hangle"] = 1.8*Math.PI
            spaceship["vangle"] = 0.3*Math.PI
            spaceship["rotation"] = 7*Math.PI/6
        }
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        spaceship["hangle"] = 0
        spaceship["vangle"] = 0
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
    lives = 3
    var d = new Date()
    timestarted = d.getTime()
    fired = 0
    fires = Array()
    explode = Array()
    asterN = 2
    asteroids = make_new_asteroids(asterN)
    titlescreen = false
}

function make_new_asteroids(n){
    var out = Array()

    for(var i=0;i<n;i++){
        new_a = {"hangle":spaceship["hangle"],"vangle":spaceship["vangle"],
                 "rotation":Math.random()*Math.PI*2,"direction":Math.random()*Math.PI*2,
                 "size":4,"sides":2,"type":"standard",
                 "radius":1,"speed":1}
        if(options["surface"].substring(0,4) == "flat"){
            new_a["speed"] = 0.5+Math.random()*0.5
            new_a["radius"] = 0.1
        } else if(options["surface"]=="sphere"){
            new_a["speed"] = 0.005+Math.random()*0.005
            new_a["radius"] = 0.01
        } else if(options["surface"].substr(0,10)=="hyperbolic"){
            new_a["speed"] = 0.001+Math.random()*0.001
            new_a["radius"] = 0.004
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
            } else if(options["surface"].substr(0,10)=="hyperbolic"){
                var ang = Math.random() * 2 * Math.PI
                var dist = Math.random() * HYPER_RADIUS
                var pt = hyper_add(0, 0, Math.random() * 2 * Math.PI, Math.random() * HYPER_RADIUS)
                new_a["hangle"] = pt[0]
                new_a["vangle"] = pt[1]
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
    if(games[game_n][0] == "credits"){
        var lines = Array(
            Array("mathsteroids v" + VERSION, 100),
            Array("created by matthew scroggs", 130),
            Array("mscroggs.co.uk/mathsteroids", 160),
            Array("source code available at", 350),
            Array("github.com/mscroggs/mathsteroids", 380),
        )
        for(var i=0;i<lines.length;i++){
            var text = lines[i][0]
            var y = lines[i][1]
            var x = 100
            for (var j=0;j<text.length;j++){
                var letter = text.charAt(j)
                if(letter!=" "){
                    out[out.length] = {"hangle": x,"vangle":y,"rotation":0,"direction":0,"size":2,"sides":4,"type":letter,"radius":12,"speed":0}
                }
                x = add_letter_x(letter, x, 0.5)
            }
        }
    }
    return out
}

function too_close(p,q){
    var d = 0
    var x1 = 0
    var x2 = 0
    var y1 = 0
    var y2 = 0
    var z1 = 0
    var z2 = 0
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        d = 80
        x1 = p["hangle"]
        x2 = q["hangle"]
        y1 = p["vangle"]
        y2 = q["vangle"]
        z1 = 0
        z2 = 0
    } else if(options["surface"]=="sphere"){
        d = 0.15
        x1 = Math.cos(p["hangle"])*Math.cos(p["vangle"])
        x2 = Math.cos(q["hangle"])*Math.cos(q["vangle"])
        y1 = Math.cos(p["hangle"])*Math.sin(p["vangle"])
        y2 = Math.cos(q["hangle"])*Math.sin(q["vangle"])
        z1 = Math.sin(p["vangle"])
        z2 = Math.sin(q["vangle"])
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        d = 0.15
        z1 = hyper_compute_distance(p["hangle"], p["vangle"], q["hangle"], q["vangle"])
    } else if(options["surface"]=="torus"){
        d = 0.2
        x1 = Math.cos(p["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(p["vangle"]))
        x2 = Math.cos(q["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(q["vangle"]))
        y1 = Math.sin(p["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(p["vangle"]))
        y2 = Math.sin(q["hangle"])*(TRADIUS[0]+TRADIUS[1]*Math.cos(q["vangle"]))
        z1 = TRADIUS[1]*Math.sin(p["vangle"])
        z2 = TRADIUS[1]*Math.sin(q["vangle"])
    }
    if(Math.abs(x1-x2)<d && Math.abs(y1-y2)<d && Math.abs(z1-z2)<d){
        return true
    }
    return false
}

function toggle_mute(){
    if(game_config("sound")){
        if (mute) {
            mute = false
            sound_start.cloneNode().play()
        } else {
            mute = true
        }
    }
    if(titlescreen){
        redraw_menu()
    }
}
function tick(){
    if(quitPressed){
        show_menu()
        return
    }
    if(upPressed){
        if(game_config("sound") && !mute){ sound_thrust.play() }
        increase_speed()
    } else {
        if(game_config("sound") && !mute){ sound_thrust.pause() }
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

    if(game_config("game-mode") == "time") {
        var d = new Date()
        timeleft = timestarted + 60000 - d.getTime()
    }


    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_scaled_text(ctx,""+score,20,38,0.6)
    draw_lives(ctx)
    draw_mute(ctx)
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
    if(timeleft <= 0){highscore()}
}

function load_scores() {
    if(!game_config("high-scores")){ return }
    var score_file = "scores-" + options["surface"]
    var data = localStorage.getItem(score_file)
    var scores = []
    if (data != null){
        scores = JSON.parse(data)
    }
    return scores
}

function save_scores(scores) {
    if(!game_config("high-scores")){ return }
    var score_file = "scores-" + options["surface"]
    localStorage.setItem(score_file, JSON.stringify(scores))
}

function highscore() {
    clearInterval(interval)
    if(game_config("sound") && !mute){ sound_thrust.pause() }

    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect((WIDTH-270)/2,(HEIGHT-50)/2,270,50);

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_text(ctx, "game over", (WIDTH-270)/2+10, (HEIGHT-50)/2+40)
    ctx.stroke();

    if(game_config("high-scores")){
        var scores = load_scores()
        if (score > 0 && (scores.length < nscores || score > scores[nscores-1][0])){
            setTimeout(enter_name,1000)
        } else {
            setTimeout(gameoveron,1000)
        }
    } else {
        setTimeout(gameoveron,1000)
    }
}

function enter_name()
{
    if(!game_config("high-scores")){ return }
    entered_name = ""
    entered_letter = 0

    name_tick()
    clearInterval(interval)
    interval = setInterval(name_tick,1000/60);
}

function show_enter_name()
{
    if(!game_config("high-scores")){ return }
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
    if(!game_config("high-scores")){ return }
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
    if(game_config("high-scores")){
        ctx.fillRect(40,40,WIDTH-80,WIDTH-40);
    } else {
        ctx.fillRect((WIDTH-430)/2,(HEIGHT-50)/2+60,430,40);
    }

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    if(game_config("high-scores")){
        add_scaled_text(ctx, "high scores", (WIDTH-200)/2, 80, 0.6)

        scores = load_scores()
        for (var i = 0; i < scores.length; i++)
        {
          add_scaled_text(ctx, scores[i][1], WIDTH/2 - 70, 140 + 40*i, 0.6)
          add_scaled_text(ctx, scores[i][0]+"", WIDTH/2 + 10, 140 + 40*i, 0.6)
        }
        add_scaled_text(ctx, "press button to continue", (WIDTH-430)/2+10, HEIGHT-40, 0.6)
    } else {
        add_scaled_text(ctx, "press button to continue", (WIDTH-430)/2+10, (HEIGHT-50)/2+90, 0.6)
    }
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
            if(game_config("sound") && !mute){ sound_fire.cloneNode().play() }
            var leng = 0
            var speed = 0
            if(options["surface"].substring(0,4) == "flat" || options["surface"]=="pool"){
                leng = 10
                speed = 5
            } else if(options["surface"] == "sphere"){
                leng = 0.1
                speed = 0.05
            } else if(options["surface"] == "torus"){
                leng = 0.1
                speed = 0.05
            } else if(options["surface"].substr(0,10) == "hyperbolic"){
                leng = 0.05
                speed = 0.03
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
    var speed_add = 0
    var speed_max = 0
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        speed_add = 0.2
        speed_max = 5
    } else if(options["surface"]=="sphere"){
        speed_add = 0.002
        speed_max = 0.05
    } else if(options["surface"]=="torus"){
        speed_add = 0.002
        speed_max = 0.05
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        speed_add = 0.0012
        speed_max = 0.03
    }

    var new_speed_x = spaceship["speed"]*Math.cos(spaceship["direction"]) + speed_add*Math.cos(spaceship["rotation"])
    var new_speed_y = spaceship["speed"]*Math.sin(spaceship["direction"]) + speed_add*Math.sin(spaceship["rotation"])
    var new_speed = Math.sqrt(new_speed_x*new_speed_x+new_speed_y*new_speed_y)
    spaceship["speed"] = Math.min(speed_max,new_speed)
    spaceship["direction"] = Math.atan2(new_speed_y,new_speed_x)
}

function decrease_speed(){
    var slow = 0
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        slow = 0.01
    } else if(options["surface"]=="sphere"){
        slow = 0.0001
    } else if(options["surface"]=="torus"){
        slow = 0.0001
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        slow = 0.00005
    }

    spaceship["speed"] = Math.max(0,spaceship["speed"]-slow)
}

function rotate_left(){
    if(options["surface"].substr(0, 10)=="hyperbolic") {
        spaceship["rotation"] = hyper_compute_bk_angle(
            spaceship["hangle"], spaceship["vangle"],
            hyper_compute_angle_with_diameter(spaceship["hangle"], spaceship["vangle"], spaceship["rotation"])-0.07)
    } else {
        spaceship["rotation"] -= 0.07
    }
}

function rotate_right(){
    if(options["surface"].substr(0, 10)=="hyperbolic") {
        spaceship["rotation"] = hyper_compute_bk_angle(
            spaceship["hangle"], spaceship["vangle"],
            hyper_compute_angle_with_diameter(spaceship["hangle"], spaceship["vangle"], spaceship["rotation"])+ 0.07)
    } else {
        spaceship["rotation"] += 0.07
    }
}

function draw_lives(ctx){
    if(game_config("game-mode") == "lives"){
        for(var i=0;i<lives;i++){
            ctx.moveTo(WIDTH-i*25-30,20)
            ctx.lineTo(WIDTH-i*25-20,40)
            ctx.lineTo(WIDTH-i*25-30,35)
            ctx.lineTo(WIDTH-i*25-40,40)
            ctx.lineTo(WIDTH-i*25-30,20)
        }
    } else if(game_config("game-mode") == "time"){
        var timeleftdisp = Math.ceil(timeleft / 1000)
        add_scaled_text(ctx,""+timeleftdisp,WIDTH-50,38,0.6)
    }
}

function draw_mute(ctx){
    if(game_config("sound")){
        if(mute) {
            ctx.moveTo(15,HEIGHT-20)
            ctx.lineTo(15,HEIGHT-20)
            ctx.lineTo(15,HEIGHT-30)
            ctx.lineTo(20,HEIGHT-30)
            ctx.lineTo(20,HEIGHT-25)
            ctx.moveTo(23+7/5,HEIGHT-20+5/5)
            ctx.lineTo(30,HEIGHT-15)
            ctx.lineTo(30,HEIGHT-25)
            ctx.moveTo(30,HEIGHT-35)
            ctx.lineTo(23,HEIGHT-30)
            ctx.lineTo(23,HEIGHT-28)

            ctx.moveTo(15,HEIGHT-15)
            ctx.lineTo(35,HEIGHT-35)
        } else {
            ctx.moveTo(20,HEIGHT-20)
            ctx.lineTo(15,HEIGHT-20)
            ctx.lineTo(15,HEIGHT-30)
            ctx.lineTo(20,HEIGHT-30)
            ctx.lineTo(20,HEIGHT-20)
            ctx.moveTo(23,HEIGHT-20)
            ctx.lineTo(30,HEIGHT-15)
            ctx.lineTo(30,HEIGHT-35)
            ctx.lineTo(23,HEIGHT-30)
            ctx.lineTo(23,HEIGHT-20)
        }
    }
}

function draw_shape(){
    if(options["surface"]=="flatmobius" || options["surface"]=="flatcylinder"){
        for(var i=0;i<10;i++){
            add_line_to_draw(Array(i*WIDTH/10,MOBIUSY,(i+1)*WIDTH/10,MOBIUSY))
            add_line_to_draw(Array(i*WIDTH/10,HEIGHT-MOBIUSY,(i+1)*WIDTH/10,HEIGHT-MOBIUSY))
        }
    } else if(options["projection"]=="loop"){
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
    } else if(options["surface"]=="sphere"){
        if(options["projection"]=="isometric"){
            for(var circle=0;circle<2;circle++){
                var vangle = 0
                var hangle = 0
                var N = 100
                if(circle==1){
                    hangle=3*Math.PI/4
                }
                var prev = vangle
                var preh = hangle
                for(var i=1;i<=N;i++){
                    hangle += Math.PI*2/N
                    if(circle==1){
                        vangle = Math.atan(Math.cos(hangle)+Math.sin(hangle))
                    }
                    add_line_to_draw(Array(preh,prev,hangle,vangle))
                    prev = vangle
                    preh = hangle
                }
            }
        } else if(options["projection"]=="stereographic"){
            var hangle = 0
            var N = 100
            var preh = 0
            for(var i=0;i<N;i++){
                hangle += Math.PI*2/N
                add_line_to_draw(Array(preh,0.01,hangle,0.01))
                add_line_to_draw(Array(preh,-0.01,hangle,-0.01))
                preh = hangle
            }
        } else if(options["projection"]=="azim"){
            var hangle = 0
            var N = 100
            var preh = 0
            for(var i=0;i<N;i++){
                hangle += Math.PI*2/N
                add_line_to_draw(Array(preh,-Math.PI/2,hangle,-Math.PI/2))
                preh = hangle
            }
        } else if(options["projection"]=="van der Grinten"){
            var vangle = -Math.PI/2
            var N = 200
            var prev = vangle
            for(var i=1;i<=N;i++){
                vangle = -Math.PI/2 * Math.cos(i/N * Math.PI)
                add_line_to_draw(Array(0, prev,0,vangle))
                prev = vangle
            }
            prev = -Math.PI/2
            for(var i=1;i<=N;i++){
                vangle = -Math.PI/2 * Math.cos(i/N * Math.PI)
                add_line_to_draw(Array(2*Math.PI, prev,2*Math.PI,vangle))
                prev = vangle
            }
        } else if(options["projection"]=="Craig"){
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
        } else if(options["projection"]=="Robinson"){
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
        } else if(options["projection"]=="sinusoidal" || options["projection"] == "Mollweide"){
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
        } else if(options["projection"]=="Goode"){
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
        } else if(options["projection"]=="cube"){
            var eps = 0.0001
            // -1, -1+/-eps, -1+eps  to  -1, -1+/-eps, 1-eps
            add_line_to_draw(Array(Math.atan2(-1-eps, -1),Math.atan2(-1+eps, Math.sqrt(2)),Math.atan2(-1-eps, -1),Math.atan2(1-eps, Math.sqrt(2))))
            add_line_to_draw(Array(Math.atan2(-1+eps, -1),Math.atan2(-1+eps, Math.sqrt(2)),Math.atan2(-1+eps, -1),Math.atan2(1-eps, Math.sqrt(2))))
            // -1, -1+eps, -1+/-eps  to  -1, 1-eps, -1+/-eps
            add_line_to_draw(Array(Math.atan2(-1+eps, -1),Math.atan2(-1-eps, Math.sqrt(1+(eps-1)*(eps-1))),Math.atan2(1-eps, -1),Math.atan2(-1-eps, Math.sqrt(1+(1-eps)*(1-eps)))))
            add_line_to_draw(Array(Math.atan2(-1+eps, -1),Math.atan2(-1+eps, Math.sqrt(1+(eps-1)*(eps-1))),Math.atan2(1-eps, -1),Math.atan2(-1+eps, Math.sqrt(1+(1-eps)*(1-eps)))))
            // -1, -1+eps, 1+/-eps  to  -1, 1-eps, 1+/-eps
            add_line_to_draw(Array(Math.atan2(-1+eps, -1),Math.atan2(1-eps, Math.sqrt(1+(eps-1)*(eps-1))),Math.atan2(1-eps, -1),Math.atan2(1-eps, Math.sqrt(1+(1-eps)*(1-eps)))))
            add_line_to_draw(Array(Math.atan2(-1+eps, -1),Math.atan2(1+eps, Math.sqrt(1+(eps-1)*(eps-1))),Math.atan2(1-eps, -1),Math.atan2(1+eps, Math.sqrt(1+(1-eps)*(1-eps)))))
            // -1+eps, -1, -1+/-eps  to  1-eps, -1, -1+/-eps
            add_line_to_draw(Array(Math.atan2(-1, -1+eps),Math.atan2(-1-eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(-1,1-eps),Math.atan2(-1-eps, Math.sqrt((1-eps)*(1-eps)+1))))
            add_line_to_draw(Array(Math.atan2(-1, -1+eps),Math.atan2(-1+eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(-1,1-eps),Math.atan2(-1+eps, Math.sqrt((1-eps)*(1-eps)+1))))
            // -1+eps, -1, 1+/-eps  to  1-eps, -1, 1+/-eps
            add_line_to_draw(Array(Math.atan2(-1, -1+eps),Math.atan2(1-eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(-1,1-eps),Math.atan2(1-eps, Math.sqrt((1-eps)*(1-eps)+1))))
            add_line_to_draw(Array(Math.atan2(-1, -1+eps),Math.atan2(1+eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(-1,1-eps),Math.atan2(1+eps, Math.sqrt((1-eps)*(1-eps)+1))))
            // 1-eps, 1, 1+/-eps  to  -1+eps, 1, 1+/-eps
            add_line_to_draw(Array(Math.atan2(1, 1-eps),Math.atan2(1+eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(1,eps-1),Math.atan2(1+eps, Math.sqrt((1-eps)*(1-eps)+1))))
            add_line_to_draw(Array(Math.atan2(1, 1-eps),Math.atan2(1-eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(1,eps-1),Math.atan2(1-eps, Math.sqrt((1-eps)*(1-eps)+1))))
            // 1-eps, 1, -1+/-eps  to  -1+eps, 1, -1+/-eps
            add_line_to_draw(Array(Math.atan2(1, 1-eps),Math.atan2(-1+eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(1,eps-1),Math.atan2(-1+eps, Math.sqrt((1-eps)*(1-eps)+1))))
            add_line_to_draw(Array(Math.atan2(1, 1-eps),Math.atan2(-1-eps, Math.sqrt((eps-1)*(eps-1)+1)),Math.atan2(1,eps-1),Math.atan2(-1-eps, Math.sqrt((1-eps)*(1-eps)+1))))
        } else if(options["projection"]=="tetrahedron"){
            var eps = 0.0001
            var top = [0, 0, -1]
            var pts = [[-Math.sqrt(8)/3, 0, 1/3], [Math.sqrt(2)/3, -Math.sqrt(2/3), 1/3], [Math.sqrt(2)/3, Math.sqrt(2/3), 1/3]]
            for (var i = 0; i < pts.length; i++){
                for (var j = 0; j < pts.length; j++){
                    if (i != j){
                        var x0 = top[0] + eps * (pts[i][0] + pts[j][0] - 2 * top[0]) / 2
                        var y0 = top[1] + eps * (pts[i][1] + pts[j][1] - 2 * top[1]) / 2
                        var z0 = top[2] + eps * (pts[i][2] + pts[j][2] - 2 * top[2]) / 2
                        var x1 = pts[i][0] + eps * (top[0] + pts[j][0] - 2 * pts[i][0]) / 2
                        var y1 = pts[i][1] + eps * (top[1] + pts[j][1] - 2 * pts[i][1]) / 2
                        var z1 = pts[i][2] + eps * (top[2] + pts[j][2] - 2 * pts[i][2]) / 2
                        add_line_to_draw(Array(Math.atan2(y0, x0),Math.atan2(z0, Math.sqrt(x0*x0+(y0)*(y0))),Math.atan2(y1, x1),Math.atan2(z1, Math.sqrt(x1*x1+(y1)*(y1)))))
                    }
                }
            }
        } else if(options["projection"]=="octahedron"){
            var eps = 0.0001
            var lines = [
                [[0,0,1], [0,1,0]],
                [[0,0,1], [0,-1,0]],
                [[0,0,-1], [1,0,0]],
                [[0,0,-1], [-1,0,0]],
                [[0,-1,0], [-1,0,0]],
            ]
            for(var i=0;i<lines.length;i++){
                var dir = [0,0,0]
                if(lines[i][0][0] == lines[i][1][0]){
                    dir[0] = 1
                } else if(lines[i][0][1] == lines[i][1][1]){
                    dir[1] = 1
                } else {
                    dir[2] = 1
                }
                for (var s=-1;s<=1;s+=2){
                    var x0 = lines[i][0][0] + eps * (lines[i][1][0] + s*dir[0] - 2 * lines[i][0][0]) / 2
                    var y0 = lines[i][0][1] + eps * (lines[i][1][1] + s*dir[1] - 2 * lines[i][0][1]) / 2
                    var z0 = lines[i][0][2] + eps * (lines[i][1][2] + s*dir[2] - 2 * lines[i][0][2]) / 2
                    var x1 = lines[i][1][0] + eps * (lines[i][0][0] + s*dir[0] - 2 * lines[i][1][0]) / 2
                    var y1 = lines[i][1][1] + eps * (lines[i][0][1] + s*dir[1] - 2 * lines[i][1][1]) / 2
                    var z1 = lines[i][1][2] + eps * (lines[i][0][2] + s*dir[2] - 2 * lines[i][1][2]) / 2
                    add_line_to_draw(Array(Math.atan2(y0, x0),Math.atan2(z0, Math.sqrt(x0*x0+(y0)*(y0))),Math.atan2(y1, x1),Math.atan2(z1, Math.sqrt(x1*x1+(y1)*(y1)))))
                }
            }
        } else if(options["projection"]=="dodecahedron"){
            var eps = 0.0001
            var lines = [[[0.9341723589627158, 0.35682208977308993, 0.0], [0.9341723589627158, -0.35682208977308993, 0.0], [0.35682208977308993, 0.0, -0.9341723589627158]], [[0.9341723589627158, -0.35682208977308993, 0.0], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258]], [[0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.35682208977308993, 0.0, -0.9341723589627158], [0.9341723589627158, 0.35682208977308993, 0.0]], [[0.35682208977308993, 0.0, -0.9341723589627158], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.9341723589627158, -0.35682208977308993, 0.0]], [[0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.35682208977308993, 0.0, -0.9341723589627158], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258]], [[0.35682208977308993, 0.0, -0.9341723589627158], [-0.35682208977308993, 0.0, -0.9341723589627158], [0.0, 0.9341723589627158, -0.35682208977308993]], [[-0.35682208977308993, 0.0, -0.9341723589627158], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258]], [[-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.0, 0.9341723589627158, -0.35682208977308993], [0.35682208977308993, 0.0, -0.9341723589627158]], [[0.9341723589627158, 0.35682208977308993, 0.0], [0.9341723589627158, -0.35682208977308993, 0.0], [0.35682208977308993, 0.0, 0.9341723589627158]], [[0.9341723589627158, -0.35682208977308993, 0.0], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.5773502691896258, 0.5773502691896258, 0.5773502691896258]], [[0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.35682208977308993, 0.0, 0.9341723589627158], [0.9341723589627158, 0.35682208977308993, 0.0]], [[0.35682208977308993, 0.0, 0.9341723589627158], [0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.9341723589627158, -0.35682208977308993, 0.0]], [[0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.35682208977308993, 0.0, 0.9341723589627158], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258]], [[0.35682208977308993, 0.0, 0.9341723589627158], [-0.35682208977308993, 0.0, 0.9341723589627158], [0.0, 0.9341723589627158, 0.35682208977308993]], [[-0.35682208977308993, 0.0, 0.9341723589627158], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.5773502691896258, 0.5773502691896258, 0.5773502691896258]], [[-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.0, 0.9341723589627158, 0.35682208977308993], [0.35682208977308993, 0.0, 0.9341723589627158]], [[0.0, 0.9341723589627158, 0.35682208977308993], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258]], [[-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [-0.9341723589627158, 0.35682208977308993, 0.0], [0.0, 0.9341723589627158, -0.35682208977308993]], [[-0.9341723589627158, 0.35682208977308993, 0.0], [-0.9341723589627158, -0.35682208977308993, 0.0], [-0.35682208977308993, 0.0, -0.9341723589627158]], [[0.0, 0.9341723589627158, -0.35682208977308993], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258]], [[-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [-0.35682208977308993, 0.0, -0.9341723589627158], [-0.9341723589627158, -0.35682208977308993, 0.0]], [[-0.35682208977308993, 0.0, -0.9341723589627158], [-0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [-0.9341723589627158, 0.35682208977308993, 0.0]], [[-0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [-0.35682208977308993, 0.0, -0.9341723589627158], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258]], [[-0.35682208977308993, 0.0, -0.9341723589627158], [0.35682208977308993, 0.0, -0.9341723589627158], [0.0, -0.9341723589627158, -0.35682208977308993]], [[0.35682208977308993, 0.0, -0.9341723589627158], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, -0.5773502691896258, -0.5773502691896258]], [[0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.0, -0.9341723589627158, -0.35682208977308993], [-0.35682208977308993, 0.0, -0.9341723589627158]], [[0.0, -0.9341723589627158, -0.35682208977308993], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258]], [[0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.9341723589627158, -0.35682208977308993, 0.0], [0.0, -0.9341723589627158, 0.35682208977308993]], [[0.9341723589627158, -0.35682208977308993, 0.0], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.0, -0.9341723589627158, -0.35682208977308993]], [[0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.0, -0.9341723589627158, 0.35682208977308993], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258]], [[0.0, -0.9341723589627158, 0.35682208977308993], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [-0.35682208977308993, 0.0, 0.9341723589627158]], [[0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.35682208977308993, 0.0, 0.9341723589627158], [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258]], [[0.35682208977308993, 0.0, 0.9341723589627158], [-0.35682208977308993, 0.0, 0.9341723589627158], [0.0, -0.9341723589627158, 0.35682208977308993]], [[-0.35682208977308993, 0.0, 0.9341723589627158], [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258]], [[-0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [-0.35682208977308993, 0.0, 0.9341723589627158], [-0.9341723589627158, 0.35682208977308993, 0.0]], [[-0.35682208977308993, 0.0, 0.9341723589627158], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [-0.9341723589627158, -0.35682208977308993, 0.0]], [[-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [-0.9341723589627158, 0.35682208977308993, 0.0], [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258]], [[-0.9341723589627158, 0.35682208977308993, 0.0], [-0.9341723589627158, -0.35682208977308993, 0.0], [-0.35682208977308993, 0.0, 0.9341723589627158]]]
            for(var i=0;i<lines.length;i++){
                var x0 = lines[i][0][0] + eps * (lines[i][1][0] + lines[i][2][0] - 2 * lines[i][0][0]) / 2
                var y0 = lines[i][0][1] + eps * (lines[i][1][1] + lines[i][2][1] - 2 * lines[i][0][1]) / 2
                var z0 = lines[i][0][2] + eps * (lines[i][1][2] + lines[i][2][2] - 2 * lines[i][0][2]) / 2
                var x1 = lines[i][1][0] + eps * (lines[i][0][0] + lines[i][2][0] - 2 * lines[i][1][0]) / 2
                var y1 = lines[i][1][1] + eps * (lines[i][0][1] + lines[i][2][1] - 2 * lines[i][1][1]) / 2
                var z1 = lines[i][1][2] + eps * (lines[i][0][2] + lines[i][2][2] - 2 * lines[i][1][2]) / 2
                add_line_to_draw(Array(Math.atan2(y0, x0),Math.atan2(z0, Math.sqrt(x0*x0+(y0)*(y0))),Math.atan2(y1, x1),Math.atan2(z1, Math.sqrt(x1*x1+(y1)*(y1)))))
            }
        } else if(options["projection"]=="icosahedron"){
            var eps = 0.0001
            var lines = [[[-0.85065080835204, 0.0, -0.5257311121191336], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, 0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, 0.85065080835204, 0.0], [-0.85065080835204, 0.0, -0.5257311121191336]], [[-0.5257311121191336, 0.85065080835204, 0.0], [-0.85065080835204, 0.0, 0.5257311121191336], [0.0, 0.5257311121191336, 0.85065080835204]], [[-0.85065080835204, 0.0, 0.5257311121191336], [0.0, 0.5257311121191336, 0.85065080835204], [-0.5257311121191336, 0.85065080835204, 0.0]], [[0.0, 0.5257311121191336, 0.85065080835204], [-0.85065080835204, 0.0, 0.5257311121191336], [0.0, -0.5257311121191336, 0.85065080835204]], [[-0.85065080835204, 0.0, 0.5257311121191336], [0.0, -0.5257311121191336, 0.85065080835204], [0.0, 0.5257311121191336, 0.85065080835204]], [[0.0, -0.5257311121191336, 0.85065080835204], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0], [0.0, -0.5257311121191336, 0.85065080835204]], [[-0.5257311121191336, -0.85065080835204, 0.0], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.85065080835204, 0.0, -0.5257311121191336]], [[-0.85065080835204, 0.0, 0.5257311121191336], [-0.85065080835204, 0.0, -0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, -0.85065080835204], [-0.5257311121191336, -0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, -0.85065080835204], [0.0, 0.5257311121191336, -0.85065080835204]], [[0.0, -0.5257311121191336, -0.85065080835204], [0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204], [0.0, -0.5257311121191336, -0.85065080835204]], [[0.0, 0.5257311121191336, -0.85065080835204], [0.85065080835204, 0.0, -0.5257311121191336], [0.5257311121191336, 0.85065080835204, 0.0]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.5257311121191336, 0.85065080835204, 0.0], [0.0, 0.5257311121191336, -0.85065080835204]], [[0.5257311121191336, 0.85065080835204, 0.0], [0.85065080835204, 0.0, -0.5257311121191336], [0.85065080835204, 0.0, 0.5257311121191336]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.85065080835204, 0.0, 0.5257311121191336], [0.5257311121191336, 0.85065080835204, 0.0]], [[0.85065080835204, 0.0, 0.5257311121191336], [0.85065080835204, 0.0, -0.5257311121191336], [0.5257311121191336, -0.85065080835204, 0.0]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.5257311121191336, -0.85065080835204, 0.0], [0.85065080835204, 0.0, 0.5257311121191336]], [[0.5257311121191336, -0.85065080835204, 0.0], [0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, -0.85065080835204]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, -0.85065080835204], [0.5257311121191336, -0.85065080835204, 0.0]]]
            for(var i=0;i<lines.length;i++){
                var x0 = lines[i][0][0] + eps * (lines[i][1][0] + lines[i][2][0] - 2 * lines[i][0][0]) / 2
                var y0 = lines[i][0][1] + eps * (lines[i][1][1] + lines[i][2][1] - 2 * lines[i][0][1]) / 2
                var z0 = lines[i][0][2] + eps * (lines[i][1][2] + lines[i][2][2] - 2 * lines[i][0][2]) / 2
                var x1 = lines[i][1][0] + eps * (lines[i][0][0] + lines[i][2][0] - 2 * lines[i][1][0]) / 2
                var y1 = lines[i][1][1] + eps * (lines[i][0][1] + lines[i][2][1] - 2 * lines[i][1][1]) / 2
                var z1 = lines[i][1][2] + eps * (lines[i][0][2] + lines[i][2][2] - 2 * lines[i][1][2]) / 2
                add_line_to_draw(Array(Math.atan2(y0, x0),Math.atan2(z0, Math.sqrt(x0*x0+(y0)*(y0))),Math.atan2(y1, x1),Math.atan2(z1, Math.sqrt(x1*x1+(y1)*(y1)))))
            }
        } else if(options["projection"]=="dymaxion"){
            var eps = 0.0001
            var lines = [[[-0.85065080835204, 0.0, -0.5257311121191336], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, 0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, 0.5257311121191336], [0.0, -0.5257311121191336, 0.85065080835204], [0.0, 0.5257311121191336, 0.85065080835204]], [[0.0, -0.5257311121191336, 0.85065080835204], [0.0, 0.5257311121191336, 0.85065080835204], [-0.85065080835204, 0.0, 0.5257311121191336]], [[0.0, 0.5257311121191336, 0.85065080835204], [0.0, -0.5257311121191336, 0.85065080835204], [0.85065080835204, 0.0, 0.5257311121191336]], [[0.0, -0.5257311121191336, 0.85065080835204], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, 0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0], [0.0, -0.5257311121191336, 0.85065080835204]], [[-0.5257311121191336, -0.85065080835204, 0.0], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.85065080835204, 0.0, -0.5257311121191336]], [[-0.85065080835204, 0.0, 0.5257311121191336], [-0.85065080835204, 0.0, -0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.0, -0.85065080835204], [0.0, -0.5257311121191336, -0.85065080835204]], [[0.0, 0.0, -0.85065080835204], [0.0, -0.5257311121191336, -0.85065080835204], [-0.85065080835204, 0.0, -0.5257311121191336]], [[0.0, -0.5257311121191336, -0.85065080835204], [0.5257311121191336, -0.85065080835204, 0.0], [-0.5257311121191336, -0.85065080835204, 0.0]], [[0.5257311121191336, -0.85065080835204, 0.0], [0.0, -0.5257311121191336, -0.85065080835204], [0.85065080835204, 0.0, -0.5257311121191336]], [[0.0, -0.5257311121191336, -0.85065080835204], [0.85065080835204, 0.0, -0.5257311121191336], [0.5257311121191336, -0.85065080835204, 0.0]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.85065080835204, 0.0, 0.5257311121191336], [0.5257311121191336, -0.85065080835204, 0.0]], [[0.85065080835204, 0.0, 0.5257311121191336], [0.85065080835204, 0.0, -0.5257311121191336], [0.5257311121191336, 0.85065080835204, 0.0]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.4587939734903912, 0.4587939734903912, -0.4587939734903912], [0.5257311121191336, 0.85065080835204, 0.0]], [[0.4587939734903912, 0.4587939734903912, -0.4587939734903912], [0.5257311121191336, 0.85065080835204, 0.0], [0.85065080835204, 0.0, -0.5257311121191336]], [[0.5257311121191336, 0.85065080835204, 0.0], [0.4587939734903912, 0.4587939734903912, -0.4587939734903912], [0.0, 0.5257311121191336, -0.85065080835204]], [[0.4587939734903912, 0.4587939734903912, -0.4587939734903912], [0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204]], [[0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, -0.85065080835204], [0.0, 0.5257311121191336, -0.85065080835204]], [[0.0, -0.5257311121191336, -0.85065080835204], [0.0, 0.0, -0.85065080835204], [0.85065080835204, 0.0, -0.5257311121191336]], [[0.0, 0.0, -0.85065080835204], [-0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204]], [[-0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204], [0.0, 0.0, -0.85065080835204]], [[0.0, 0.5257311121191336, -0.85065080835204], [-0.85065080835204, 0.0, -0.5257311121191336], [-0.5257311121191336, 0.85065080835204, 0.0]], [[-0.85065080835204, 0.0, -0.5257311121191336], [-0.5257311121191336, 0.85065080835204, 0.0], [0.0, 0.5257311121191336, -0.85065080835204]], [[-0.5257311121191336, 0.85065080835204, 0.0], [-0.85065080835204, 0.0, -0.5257311121191336], [-0.85065080835204, 0.0, 0.5257311121191336]]]
            for(var i=0;i<lines.length;i++){
                var x0 = lines[i][0][0] + eps * (lines[i][1][0] + lines[i][2][0] - 2 * lines[i][0][0]) / 2
                var y0 = lines[i][0][1] + eps * (lines[i][1][1] + lines[i][2][1] - 2 * lines[i][0][1]) / 2
                var z0 = lines[i][0][2] + eps * (lines[i][1][2] + lines[i][2][2] - 2 * lines[i][0][2]) / 2
                var x1 = lines[i][1][0] + eps * (lines[i][0][0] + lines[i][2][0] - 2 * lines[i][1][0]) / 2
                var y1 = lines[i][1][1] + eps * (lines[i][0][1] + lines[i][2][1] - 2 * lines[i][1][1]) / 2
                var z1 = lines[i][1][2] + eps * (lines[i][0][2] + lines[i][2][2] - 2 * lines[i][1][2]) / 2
                add_line_to_draw(Array(Math.atan2(y0, x0),Math.atan2(z0, Math.sqrt(x0*x0+(y0)*(y0))),Math.atan2(y1, x1),Math.atan2(z1, Math.sqrt(x1*x1+(y1)*(y1)))))
            }
        }
    } else if(options["surface"]=="torus"){
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
    } else if(options["surface"]=="hyperbolic"){
        if(options["projection"] == "hyperboloid"){
            var N = 100
            var prev = 0
            var preh = 0
            var a = Math.PI / 2 + 0.15
            var p1 = hyper_add(0, 0, Math.PI/4 + a, HYPER_RADIUS)
            var p2 = hyper_add(0, 0, Math.PI/4 - a, HYPER_RADIUS)

            for(var i=0;i<=N;i++){
                p = [p1[0] + (p2[0]-p1[0])*i/N,p1[1] + (p2[1]-p1[1])*i/N]
                if (i > 0) {
                    add_line_to_draw(Array(preh,prev,p[0], p[1]))
                }
                prev = p[1]
                preh = p[0]
            }

            var angle = -Math.PI / 4
            for(var i=0;i<=N;i++){
                angle += 2*Math.PI/N
                p = hyper_add(0, 0, angle, HYPER_RADIUS)
                if (i > 0) {
                    add_line_to_draw(Array(preh,prev,p[0], p[1]))
                }
                prev = p[1]
                preh = p[0]
            }
        } else {
            var N = 100
            if(options["projection"] == "Poincare HP" || options["projection"] == "band"){N=600}
            var angle = 0
            var prev = 0
            var preh = 0
            for(var i=0;i<=N;i++){
                angle += Math.PI*2/N
                var p = hyper_add(0, 0, angle, HYPER_RADIUS)
                if (i > 0) {
                    add_line_to_draw(Array(preh,prev,p[0], p[1]))
                }
                prev = p[1]
                preh = p[0]
            }
        }
    } else if(options["surface"]=="hyperbolicunbounded"){
        if(options["projection"] == "Poincare" || options["projection"] == "Beltrami-Klein"){
            var N = 100
            var angle = 0
            var prev = 0
            var preh = 0
            for(var i=0;i<=N;i++){
                angle += Math.PI*2/N
                p = [Math.cos(angle), Math.sin(angle)]
                if (i > 0) {
                    add_line_to_draw(Array(preh,prev,p[0], p[1]))
                }
                prev = p[1]
                preh = p[0]
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
    if(options["surface"] == "flatunbounded"){
        for(var i=0;i<asteroids.length;i++){
            if(asteroids[i]["hangle"] < -5 || asteroids[i]["hangle"] > WIDTH + 5 || asteroids[i]["vangle"] < -5 || asteroids[i]["vangle"] > HEIGHT + 5){
                var ang = Math.atan2(asteroids[i]["vangle"] - spaceship["vangle"], asteroids[i]["hangle"] - spaceship["hangle"])
                var x = 0
                var y = 0
                if (ang > -Math.PI / 2 && ang < Math.PI / 2){
                    x = WIDTH
                } else {
                    x = 0
                }
                // Math.tan(ang) = (y - spaceship["vangle"]) / (x - spaceship["hangle"])
                y = spaceship["vangle"] + (x - spaceship["hangle"]) * Math.tan(ang)
                if (y > HEIGHT || y < 0) {
                    if (y > HEIGHT) {
                        y = HEIGHT
                    } else {
                        y = 0
                    }
                    // Math.tan(ang) = (HEIGHT - spaceship["vangle"]) / (x - spaceship["hangle"])
                    x = spaceship["hangle"] + (y - spaceship["vangle"]) / Math.tan(ang)
                }
                var d = Math.sqrt(Math.pow(x - asteroids[i]["hangle"], 2) + Math.pow(y - asteroids[i]["vangle"], 2))
                var alen = 10 + 40/(1+d/50)

                add_line_to_draw(Array(x-(alen + 3)*Math.cos(ang), y-(alen + 3)*Math.sin(ang), x - 3*Math.cos(ang), y - 3*Math.sin(ang)))
                add_line_to_draw(Array(x-(3 + alen/2)*Math.cos(ang)+alen/3*Math.cos(ang+Math.PI/2), y-(3+alen/2)*Math.sin(ang)+alen/3*Math.sin(ang+Math.PI/2), x - 3*Math.cos(ang), y - 3*Math.sin(ang)))
                add_line_to_draw(Array(x-(3 + alen/2)*Math.cos(ang)+alen/3*Math.cos(ang-Math.PI/2), y-(3+alen/2)*Math.sin(ang)+alen/3*Math.sin(ang-Math.PI/2), x - 3*Math.cos(ang), y - 3*Math.sin(ang)))

            }
        }
    } else if(options["surface"] == "hyperbolicunbounded"){
        if(options["projection"] == "Poincare" || options["projection"] == "Beltrami-Klein"){
            var max_d = 4
            var a0 = 0.1
            var a1 = 2
            if(options["projection"] == "Beltrami-Klein"){
                max_d = 2
                a1 = 1.2
            }
            for(var i=0;i<asteroids.length;i++){
                if(hyper_compute_distance(0, 0, asteroids[i]["hangle"], asteroids[i]["vangle"]) > max_d){
                    var ang = Math.atan2(asteroids[i]["vangle"], asteroids[i]["hangle"])
                    var d = hyper_compute_distance(0, 0, asteroids[i]["hangle"], asteroids[i]["vangle"])
                    var alen = a0 + a1/(1+d/5)
                    var arrow_st = hyper_add(0,0, ang, max_d)
                    var arrow_end = hyper_add(0,0, ang, max_d-alen)
                    var p0 = [0,0]
                    var p1 = [0,0]
                    if(options["projection"] == "Poincare") {
                        p0 = hyper_add(arrow_st[0],arrow_st[1], hyper_compute_bk_angle(arrow_st[0],arrow_st[1], 5*Math.PI/6), alen/2)
                        p1 = hyper_add(arrow_st[0],arrow_st[1], hyper_compute_bk_angle(arrow_st[0],arrow_st[1], -5*Math.PI/6), alen/2)
                    } else if(options["projection"] == "Beltrami-Klein"){
                        p0 = hyper_add(arrow_st[0],arrow_st[1], ang + 5*Math.PI/6, alen/2)
                        p1 = hyper_add(arrow_st[0],arrow_st[1], ang - 5*Math.PI/6, alen/2)
                    }

                    add_line_to_draw(Array(arrow_st[0], arrow_st[1], arrow_end[0], arrow_end[1]))
                    add_line_to_draw(Array(arrow_st[0], arrow_st[1], p0[0], p0[1]))
                    add_line_to_draw(Array(arrow_st[0], arrow_st[1], p1[0], p1[1]))
                }
            }
        }
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
    if(options["surface"] == "flatunbounded"){
        var pad = 150
        if(spaceship["hangle"] < pad) {
            move = pad - spaceship["hangle"]
            spaceship["hangle"] += move
            for(var i=0;i<asteroids.length;i++){
                asteroids[i]["hangle"] += move
            }
            for(var i=0;i<fires.length;i++){
                fires[i]["hangle"] += move
            }
        }
        if(spaceship["hangle"] > WIDTH - pad) {
            move = WIDTH - pad - spaceship["hangle"]
            spaceship["hangle"] += move
            for(var i=0;i<asteroids.length;i++){
                asteroids[i]["hangle"] += move
            }
            for(var i=0;i<fires.length;i++){
                fires[i]["hangle"] += move
            }
        }
        if(spaceship["vangle"] < pad) {
            move = pad - spaceship["vangle"]
            spaceship["vangle"] += move
            for(var i=0;i<asteroids.length;i++){
                asteroids[i]["vangle"] += move
            }
            for(var i=0;i<fires.length;i++){
                fires[i]["vangle"] += move
            }
        }
        if(spaceship["vangle"] > HEIGHT - pad) {
            move = HEIGHT - pad - spaceship["vangle"]
            spaceship["vangle"] += move
            for(var i=0;i<asteroids.length;i++){
                asteroids[i]["vangle"] += move
            }
            for(var i=0;i<fires.length;i++){
                fires[i]["vangle"] += move
            }
        }
    } else if(options["surface"] == "hyperbolicunbounded"){
        if(options["projection"] == "Poincare" || options["projection"] == "Beltrami-Klein"){
            var pad = 2
            if(options["projection"] == "Beltrami-Klein"){
                pad = 0.6
            }
            if(hyper_compute_distance(0, 0, spaceship["hangle"], spaceship["vangle"]) > pad){
                var ang = Math.atan2(spaceship["vangle"], spaceship["hangle"])
                var new_spaceship = hyper_add(0, 0, ang, pad)

                for(var i=0;i<asteroids.length;i++){
                    var a = hyper_compute_angle_with_diameter(spaceship["hangle"], spaceship["vangle"], Math.atan2(asteroids[i]["vangle"] - spaceship["vangle"], asteroids[i]["hangle"] - spaceship["hangle"]))
                    var d = hyper_compute_distance(asteroids[i]["hangle"], asteroids[i]["vangle"], spaceship["hangle"], spaceship["vangle"])
                    var p = hyper_add(new_spaceship[0], new_spaceship[1], hyper_compute_bk_angle(new_spaceship[0], new_spaceship[1], a), d)
                    asteroids[i]["hangle"] = p[0]
                    asteroids[i]["vangle"] = p[1]
                }
                for(var i=0;i<fires.length;i++){
                    var a = hyper_compute_angle_with_diameter(spaceship["hangle"], spaceship["vangle"], Math.atan2(fires[i]["vangle"] - spaceship["vangle"], fires[i]["hangle"] - spaceship["hangle"]))
                    var d = hyper_compute_distance(fires[i]["hangle"], fires[i]["vangle"], spaceship["hangle"], spaceship["vangle"])
                    var p = hyper_add(new_spaceship[0], new_spaceship[1], hyper_compute_bk_angle(new_spaceship[0], new_spaceship[1], a), d)
                    fires[i]["hangle"] = p[0]
                    fires[i]["vangle"] = p[1]
                }

                spaceship["hangle"] = new_spaceship[0]
                spaceship["vangle"] = new_spaceship[1]
            }
        }
    }
}

function move_sprite(sprite){
    var a = 0
    if(options["surface"].substr(0,10)=="hyperbolic"){
        a = hyper_compute_angle_with_diameter(sprite["hangle"], sprite["vangle"], sprite["direction"]) - hyper_compute_angle_with_diameter(sprite["hangle"], sprite["vangle"], sprite["rot"])
    }
    var new_pos = move_on_surface(sprite["hangle"],sprite["vangle"],sprite["direction"],sprite["speed"],1)
    var rot = sprite["rotation"]
    sprite["rotation"] *= new_pos["flip"]
    sprite["rotation"] -= sprite["direction"]
    sprite["direction"] = new_pos["rotation"]
    sprite["rotation"] += new_pos["flip"]*sprite["direction"]
    sprite["hangle"] = new_pos["hangle"]
    sprite["vangle"] = new_pos["vangle"]
    if(options["surface"]=="pool" || options["surface"]=="flatcylinder" || options["surface"]=="hyperbolic"){sprite["rotation"]=rot}
    if(options["surface"]=="flatmobius" && new_pos["flip"]==1){sprite["rotation"]=rot}
    if(options["surface"]=="flatcylinder"){sprite["rotation"]=rot}
    if(options["surface"].substr(0,10)=="hyperbolic"){
        sprite["rot"] = hyper_compute_bk_angle(sprite["hangle"], sprite["vangle"], hyper_compute_angle_with_diameter(sprite["hangle"], sprite["vangle"], sprite["direction"]) - a)
    }
    return sprite
}

function get_a_s(a){
    var mult = 1
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        mult = 100
    }
    if (options["surface"].substr(0,10) == "hyperbolic"){
        mult = 0.5
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
    if(options["surface"].substr(0,10)=="hyperbolic"){
        for(var j=0;j<points.length;j++){
            if(hyper_compute_distance(a["hangle"], a["vangle"], points[j][0], points[j][1]) < 0.9*a["radius"]){
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
        if(game_config("sound") && !mute){ sound_level_up.cloneNode().play() }
        asteroids = make_new_asteroids(asterN)
    }
    var new_asteroids = Array()
    for(var i=0;i<asteroids.length;i++){
        var a = asteroids[i]
        move_sprite(a)

        var fireRemove = Array()

        var points = ship_sprite(1)[0]
        if(in_contact(ship_sprite(1)[0], a)){
            if(game_config("sound") && !mute){ sound_bang_large.cloneNode().play() }
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
                } else if(options["surface"].substr(0,10)=="hyperbolic"){
                    var ang = Math.random() * 2 * Math.PI
                    var dist = Math.random() * HYPER_RADIUS
                    var pt = hyper_add(0, 0, Math.random() * 2 * Math.PI, Math.random() * HYPER_RADIUS)
                    spaceship["hangle"] = pt[0]
                    spaceship["vangle"] = pt[1]
                }
                if(options["projection"] == "loop"){
                    var angle = Math.random()*Math.PI*2
                    var rad = Math.random()
                    spaceship["hangle"] = WIDTH/2+rad*LOOPSIZE[0]*Math.cos(angle)
                    spaceship["vangle"] = HEIGHT/2+rad*LOOPSIZE[1]*Math.sin(angle)
                }
            }
            if(game_config("game-mode") == "lives") {
                lives--
            }
            if(game_config("game-mode") == "time") {
                score -= 300
            }
        }

        for(var j=0;j<fires.length;j++){
            if(in_contact([[fires[j]["hangle"],fires[j]["vangle"]]], a)){
                if(game_config("sound") && !mute){
                    if(a["sides"] == 3){
                        sound_bang_small.cloneNode().play()
                    } else {
                        sound_bang_medium.cloneNode().play()
                    }
                }
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
                } else if(options["surface"].substr(0,10)=="hyperbolic"){
                    var speed_start = 0.003
                }

                var new_a = {"hangle":a["hangle"],"vangle":a["vangle"],
                             "rotation":a["rotation"]-Math.PI/4+Math.random()*Math.PI/2,"speed":speed_start+Math.random()*1.1*a["speed"],
                             "direction":a["direction"]-Math.PI/4+Math.random()*Math.PI/2,
                             "size":a["size"]-1,"radius":0.01,"sides":2,"type":"standard"}
                var as = get_a_s(new_a)
                new_a["radius"] = as["radius"]
                new_a["sides"] = as["sides"]
                new_asteroids[new_asteroids.length] = new_a

                var new_b = {"hangle":a["hangle"],"vangle":a["vangle"],
                             "rotation":a["rotation"]+Math.PI/4+Math.random()*Math.PI/2,"speed":speed_start+Math.random()*1.1*a["speed"],
                             "direction":a["direction"]+Math.PI/4+Math.random()*Math.PI/2,
                             "size":a["size"]-1,"radius":0.01,"sides":2,"type":"standard"}
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
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        return hyper_ship_sprite(N)
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

function hyper_sprite(endpoints, N){
    var points = Array(endpoints[0])
    var x = endpoints[0][0]
    var y = endpoints[0][1]
    for(var i=0;i<endpoints.length-1;i++){
        var start = endpoints[i]
        var end = endpoints[i+1]
        for (var j=1;j<=N;j++){
            x += (end[0] - start[0]) / N
            y += (end[1] - start[1]) / N
            points[points.length] = Array(x, y)
        }
    }
    return points
}

function hyper_ship_sprite(N){
    var endpoints = Array()
    var size1 = 0.05
    var size2 = 0.06
    var h = spaceship["hangle"]
    var v = spaceship["vangle"]
    var r = spaceship["rotation"]

    endpoints[endpoints.length] = hyper_add(h, v, r, size2)
    endpoints[endpoints.length] = hyper_add(h, v, r + Math.PI*3/4, size1)
    endpoints[endpoints.length] = Array(h, v)
    endpoints[endpoints.length] = hyper_add(h, v, r - Math.PI*3/4, size1)
    endpoints[endpoints.length] = hyper_add(h, v, r, size2)
    return Array(hyper_sprite(endpoints, N));
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
    var leng = 0.1
    if(options["surface"].substring(0,4)=="flat" || options["surface"]=="pool"){
        leng = 10
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
    if(a["type"] != "standard") {
        var letter = a["type"]
        if(!(letter in font_data)){
            letter = "??"
        }
        var lines = font_data[letter]
        var out = Array()
        for(var i = 0; i < lines.length;i++){
            var group = Array()
            for(var j = 0; j < lines[i].length;j++){
                group[j] = Array(a["hangle"] + lines[i][j][0] * 0.5, a["vangle"] + lines[i][j][1] * 0.5)
            }
            out[i] = group
        }
        return out
    }
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
    } else if(options["surface"].substr(0,10) == "hyperbolic"){
        return hyper_asteroid_sprite(a)
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

function hyper_asteroid_sprite(a){
    var out = Array()
    var r = a["radius"]
    var sides = a["sides"]
    var angle = 2*Math.PI/sides

    var endpoints = Array()

    for(var i=0;i<=sides;i++){
        endpoints[endpoints.length]=hyper_add(a["hangle"], a["vangle"], i * angle, r)
    }

    return Array(hyper_sprite(endpoints, 10));
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
        var z = Math.sin(vangle)
        if(x+y-z<-0.1){
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
    if(options["surface"].substr(0,10)=="hyperbolic" && options["projection"]=="hyperboloid"){
        var hangle = (thing[0]+thing[2])/2
        var vangle = (thing[1]+thing[3])/2
        if (hangle + vangle < -0.3) {
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
        } else if(options["surface"]=="flatunbounded"){
            if(options["projection"]=="unbounded"){
                flat_unbounded_draw_line(ctx,preh,prev,hangle,vangle)
            }
        }
    } else if(options["surface"]=="sphere"){
        if(options["projection"]=="Mercator"){
            Mercator_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="plate caree"){
            plate_caree_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="van der Grinten"){
            van_der_Grinten_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Robinson"){
            Robinson_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="sinusoidal"){
            sinusoidal_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Mollweide"){
            Mollweide_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Goode"){
            Goode_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="cube"){
            cube_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="tetrahedron"){
            tetrahedron_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="octahedron"){
            octahedron_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="dodecahedron"){
            dodecahedron_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="icosahedron"){
            icosahedron_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="dymaxion"){
            dymaxion_draw_line(ctx,preh,prev,hangle,vangle)
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
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        if(options["projection"]=="Beltrami-Klein"){
            hyper_bk_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Poincare"){
            hyper_poincare_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Poincare HP"){
            hyper_poincare_hp_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="hyperboloid"){
            hyper_hyperboloid_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="gans"){
            hyper_gans_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="band"){
            hyper_band_draw_line(ctx,preh,prev,hangle,vangle)
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
    } else if(options["surface"].substr(0,10)=="hyperbolic"){
        var pt = hyper_add(hangle, vangle, rot, badd)
        if(moving && options["surface"] != "hyperbolicunbounded"){
            if(hyper_compute_distance(0, 0, pt[0], pt[1]) >= HYPER_RADIUS){
                var pts = Array(Array(hangle, vangle), pt)
                for (var i = 0; i < 20; i++){
                    var half = Array((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2)
                    if(hyper_compute_distance(0,0,half[0], half[1]) > HYPER_RADIUS) {
                        pts = Array(pts[0], half)
                    } else {
                        pts = Array(half, pts[1])
                    }
                }
                var pt_on_circle = pts[0]
                var ang = Math.atan2(pt_on_circle[1], pt_on_circle[0])
                rot = Math.PI - rot + 2 * ang
                pt = hyper_add(pt_on_circle[0], pt_on_circle[1], rot, badd - hyper_compute_distance(hangle, vangle, pt_on_circle[0], pt_on_circle[1]))
            }
        }
        return {"hangle":pt[0],"vangle":pt[1],"rotation":rot,"flip":flip}
    }
}

// isometric
function isometric_xy(hangle,vangle){
    var x = RADIUS * Math.cos(vangle) * Math.cos(hangle)
    var y = RADIUS * Math.cos(vangle) * Math.sin(hangle)
    var z = RADIUS * Math.sin(vangle)
    var x2 = (y-x) * Math.cos(Math.PI/6)
    var y2 = z + (x+y) * Math.sin(Math.PI/6)
    var out = {}
    out["x"] = WIDTH/2 + x2/(2.5*RADIUS) * Math.min(HEIGHT, WIDTH)
    out["y"] = HEIGHT/2 + y2/(2.5*RADIUS) * Math.min(HEIGHT, WIDTH)
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

// plate caree
function plate_caree_xy(hangle,vangle){
    var x = WIDTH * hangle/(2*Math.PI)
    var y = HEIGHT * (vangle + Math.PI/2) / (Math.PI)
    return {"x":x,"y":y}
}

function plate_caree_draw_line(ctx,preh,prev,h,v){
    var xy = plate_caree_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = plate_caree_xy(h,v)
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

// van der Grinten
function van_der_Grinten_xy(hangle,vangle){
    var x = 0
    var y = 0

    if (vangle == 0) {
        x = hangle - Math.PI
        y = 0
    } else if (hangle == Math.PI || Math.abs(vangle) > Math.PI/2-0.0001) {
        x = 0
        y = Math.PI * Math.tan(Math.asin(Math.min(1, Math.abs(2*vangle / Math.PI)))/2)
    } else {
        var sinO = Math.abs(2*vangle / Math.PI)
        var cosO = Math.sqrt(1 - sinO * sinO)
        var a = Math.abs(Math.PI / (hangle - Math.PI) - (hangle - Math.PI) / Math.PI) / 2
        var g = cosO / (sinO + cosO - 1)
        var p = g * (2 / sinO - 1)
        var q = a * a + g

        x = Math.PI * (a * (g - p*p) + Math.sqrt(a*a*Math.pow(g - p*p, 2)-(p*p+a*a)*(g*g-p*p))) / (p*p + a*a)
        y = Math.PI * (p * q - a * Math.sqrt((a*a+1)*(p*p+a*a) - q*q)) / (p*p + a*a)
    }
    if (hangle < Math.PI) { x *= -1 }
    if (vangle < 0) { y *= -1 }

    return {"x":WIDTH/2 + HEIGHT/7 * x,"y":HEIGHT/2 + HEIGHT/7 * y}
}

function van_der_Grinten_draw_line(ctx,preh,prev,h,v){
    var xy = van_der_Grinten_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = van_der_Grinten_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    if (Math.min(h, preh) > Math.PI/4 || Math.max(h, preh) < 7*Math.PI/4) {
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

// nets
function net_xy(hangle, vangle, centres, map_centres, axes, size){
    var x = Math.cos(hangle) * Math.cos(vangle)
    var y = Math.sin(hangle) * Math.cos(vangle)
    var z = Math.sin(vangle)

    var abs = []
    var m = -2
    for (var i = 0; i < centres.length; i++){
        abs.push(centres[i][0]*x + centres[i][1] * y + centres[i][2] * z)
        m = Math.max(m, abs[i])
    }
    index = -1
    for (var i = 0; i < centres.length; i++){
        if(abs[i] == m){
            index = i
            break
        }
    }

    if(options["projection"]=="dymaxion"){
        if (index == 9 && x * axes[index][0][0] + y * axes[index][0][1] + z * axes[index][0][2] > 0){
            index = 20
        }
        if (index == 11 && x * axes[index][0][0] + y * axes[index][0][1] + z * axes[index][0][2] > 0 && x * axes[21][0][0] + y * axes[21][0][1] + z * axes[21][0][2] > 0){
            index = 21
        }
    }

    var scale = x * centres[index][0] + y * centres[index][1] + z * centres[index][2]
    x /= scale
    y /= scale
    z /= scale
    return {
        "x": WIDTH/2 + size * (map_centres[index][0] + x * axes[index][0][0] + y * axes[index][0][1] + z * axes[index][0][2]),
        "y": HEIGHT/2 + size * (map_centres[index][1] + x * axes[index][1][0] + y * axes[index][1][1] + z * axes[index][1][2]),
        "part": index
    }
}

function are_eq(a, b, c, d){
    return (a == c && b == d) || (a == d && b == c)
}

// cube
function cube_xy(hangle,vangle){
    return net_xy(hangle, vangle,
        [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 1, 0], [0, -1, 0]],
        [[-1, 2], [-1, 0], [-1, -2], [3, 0], [1, 0], [-3, 0]],
        [[[0, 1, 0], [-1, 0, 0]], [[0, 1, 0], [0, 0, 1]], [[0, 1, 0], [1, 0, 0]], [[0, -1, 0], [0, 0, 1]], [[-1, 0, 0], [0, 0, 1]], [[1, 0, 0], [0, 0, 1]]],
        HEIGHT / 7)
}

function cube_draw_line(ctx,preh,prev,h,v){
    var prexy = cube_xy(preh,prev)
    var xy = cube_xy(h,v)
    var p = prexy["part"]
    var q = xy["part"]

    if(p == q || are_eq(p, q, 0, 1) || are_eq(p, q, 1, 2) || are_eq(p, q, 3, 4) || are_eq(p, q, 1, 5) || are_eq(p, q, 1, 4)){
        draw_xy(ctx,prexy["x"],prexy["y"],xy["x"],xy["y"])
    }
}

// tetrahedron
function tetrahedron_xy(hangle,vangle){
    var h = Math.tan(Math.acos(-1/3)/2) * Math.sqrt(3)
    var v = Math.tan(Math.acos(-1/3)/2)
    return net_xy(hangle, vangle,
        [[0, 0, 1], [Math.sqrt(8)/3, 0, -1/3], [-Math.sqrt(2)/3, Math.sqrt(2/3), -1/3], [-Math.sqrt(2)/3, -Math.sqrt(2/3), -1/3]],
        [[0,2*v-1.5], [0,-1.5], [h, 3*v-1.5], [-h,3*v-1.5]],
        [[[0, 1, 0], [-1, 0, 0]], [[0, 1, 0], [1/3, 0, Math.sqrt(8)/3]], [[Math.sqrt(3)/3, 0, -Math.sqrt(6)/3],[-2/3, -Math.sqrt(3)/3, -Math.sqrt(2)/3]], [[-Math.sqrt(3)/3, 0, Math.sqrt(6)/3],[-2/3, Math.sqrt(3)/3, -Math.sqrt(2)/3]]],
        HEIGHT / 10)
}

function tetrahedron_draw_line(ctx,preh,prev,h,v){
    var prexy = tetrahedron_xy(preh,prev)
    var xy = tetrahedron_xy(h,v)
    if(prexy["part"] == xy["part"] || prexy["part"] == 0 || xy["part"] == 0 || 0 == 0){
        draw_xy(ctx,prexy["x"],prexy["y"],xy["x"],xy["y"])
    }
}

// octahedron
function octahedron_xy(hangle,vangle){
    var rt2 = Math.sqrt(2)
    var irt2 = 1/rt2
    var rt6 = Math.sqrt(6)
    return net_xy(hangle, vangle,
        [[1/3,1/3,1/3],[1/3,1/3,-1/3],[1/3,-1/3,1/3],[1/3,-1/3,-1/3],[-1/3,1/3,1/3],[-1/3,1/3,-1/3],[-1/3,-1/3,1/3],[-1/3,-1/3,-1/3]],
        [[0,1],[0,1-rt6],[-1.5*rt2,1+rt6/2],[-3*rt2,1],[3*rt2,1-rt6],[1.5*rt2,1-rt6*1.5],[4.5*rt2,1-rt6*1.5],[-4.5*rt2,1+rt6*0.5]],
        [[[-irt2, irt2, 0], [-1/rt6, -1/rt6, 2/rt6]],[[-irt2, irt2, 0], [1/rt6, 1/rt6, 2/rt6]],[[0, irt2, irt2],[-2/rt6, -1/rt6, 1/rt6]],[[irt2, 0, irt2],[-1/rt6, -2/rt6, 1/rt6]],[[0, -irt2, irt2],[2/rt6, 1/rt6, 1/rt6]],[[-irt2, 0, irt2],[1/rt6, 2/rt6, 1/rt6]],[[irt2, -irt2, 0],[1/rt6, 1/rt6, 2/rt6]],[[irt2, -irt2, 0],[-1/rt6, -1/rt6, 2/rt6]]],

        HEIGHT / 10)
}

function octahedron_draw_line(ctx,preh,prev,h,v){
    var prexy = octahedron_xy(preh,prev)
    var xy = octahedron_xy(h,v)
    var p = prexy["part"]
    var q = xy["part"]
    if(p == q || are_eq(p, q, 0, 1) || are_eq(p, q, 0, 3) || are_eq(p, q, 3, 4) || are_eq(p, q, 1, 5) || are_eq(p, q, 5, 6) || are_eq(p, q, 4, 7) || are_eq(p, q, 6, 8)){
        draw_xy(ctx,prexy["x"],prexy["y"],xy["x"],xy["y"])
    }
}

// dodecahedron
function dodecahedron_xy(hangle,vangle){
    return net_xy(hangle, vangle,
        [[0.0, 0.5257311121191336, 0.85065080835204], [0.5257311121191336, 0.85065080835204, 0.0], [0.85065080835204, 0.0, 0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204], [0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, 0.85065080835204], [0.5257311121191336, -0.85065080835204, 0.0], [0.0, -0.5257311121191336, -0.85065080835204], [-0.5257311121191336, 0.85065080835204, 0.0], [-0.85065080835204, 0.0, 0.5257311121191336], [-0.85065080835204, 0.0, -0.5257311121191336], [-0.5257311121191336, -0.85065080835204, 0.0]],
        [[-1.2909944487358058, 0.7946544722917662], [-1.2909944487358058, -0.18759247408507995], [-2.225166807698521, 0.11593852501826318], [-0.7136441795461798, -0.9822469463768463], [-1.8683447179254318, -0.9822469463768463], [2.088872897341968, 0.9105929973100294], [2.4456949871150577, -0.18759247408507995], [1.5115226281523417, -0.8663084213585831], [-0.35682208977308993, 0.11593852501826318], [0.934172358962716, 0.9105929973100294], [0.577350269189626, -0.18759247408507995], [1.5115226281523417, 0.11593852501826318]],
        [[[-0.6428889727400947, 0.39732723614588306, -0.2455617365942116], [-0.4670861794813579, -0.5468740243419741, 0.33798673460777734]], [[-0.6428889727400947, 0.39732723614588306, -0.2455617365942116], [-0.20888728973419682, 0.1290994448735806, 0.7557613140761708]], [[0.0, 0.7946544722917662, 0.0], [-0.41777457946839347, -0.0, 0.6759734692155547]], [[-0.7946544722917662, 0.0, 0.0], [-0.0, 0.6759734692155547, 0.41777457946839347]], [[-0.2455617365942116, 0.6428889727400947, -0.39732723614588306], [0.33798673460777734, 0.4670861794813579, 0.5468740243419741]], [[0.7946544722917662, 0.0, 0.0], [-0.0, 0.6759734692155547, 0.41777457946839347]], [[0.6428889727400946, 0.3973272361458832, 0.2455617365942116], [-0.2088872897341968, -0.1290994448735807, 0.7557613140761708]], [[0.6428889727400947, -0.39732723614588306, 0.2455617365942116], [-0.4670861794813579, -0.5468740243419741, 0.33798673460777734]], [[-0.6428889727400947, -0.39732723614588306, -0.2455617365942116], [-0.20888728973419682, -0.1290994448735806, 0.7557613140761708]], [[0.24556173659421152, -0.6428889727400947, 0.3973272361458831], [0.33798673460777734, 0.4670861794813579, 0.5468740243419741]], [[0.0, -0.7946544722917662, 0.0], [-0.41777457946839347, -0.0, 0.6759734692155547]], [[0.6428889727400947, -0.3973272361458831, 0.24556173659421152], [-0.2088872897341967, 0.1290994448735806, 0.7557613140761709]]],
        HEIGHT / 3.5)
}

function dodecahedron_draw_line(ctx,preh,prev,h,v){
    var prexy = dodecahedron_xy(preh,prev)
    var xy = dodecahedron_xy(h,v)
    var p = prexy["part"]
    var q = xy["part"]
    if(p == q || are_eq(p, q, 1, 0) || are_eq(p, q, 1, 2) || are_eq(p, q, 1, 4) || are_eq(p, q, 1, 3) || are_eq(p, q, 1, 8) || are_eq(p, q, 8, 10) || are_eq(p, q, 11, 10) || are_eq(p, q, 11, 9) || are_eq(p, q, 11, 5) || are_eq(p, q, 11, 6) || are_eq(p, q, 11, 7)){
        draw_xy(ctx,prexy["x"],prexy["y"],xy["x"],xy["y"])
    }
}

// icosahedron
function icosahedron_xy(hangle,vangle){
    return net_xy(hangle, vangle,
        [[0.35682208977308993, 0.0, 0.9341723589627157], [-0.35682208977308993, 0.0, 0.9341723589627157], [0.0, 0.9341723589627157, 0.35682208977308993], [0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.0, -0.9341723589627157, 0.35682208977308993], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.35682208977308993, 0.0, -0.9341723589627157], [-0.35682208977308993, 0.0, -0.9341723589627157], [0.0, 0.9341723589627157, -0.35682208977308993], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.0, -0.9341723589627157, -0.35682208977308993], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.9341723589627157, 0.35682208977308993, 0.0], [-0.9341723589627157, 0.35682208977308993, 0.0], [0.9341723589627157, -0.35682208977308993, 0.0], [-0.9341723589627157, -0.35682208977308993, 0.0]],
        [[0.2628655560595668, 0], [0.2628655560595668, -0.6070619982066863], [-0.7885966681787004, 0], [-0.2628655560595668, 0.30353099910334314], [-0.7885966681787004, -0.6070619982066863], [1.314327780297834, 0], [0.7885966681787004, 0.30353099910334314], [1.314327780297834, -0.6070619982066863], [-2.365790004536101, 0.9105929973100294], [-2.365790004536101, 0.30353099910334314], [-1.3143277802978341, 0.30353099910334314], [-1.3143277802978341, 0.9105929973100294], [-1.8400588924169676, 0], [1.8400588924169676, 0.30353099910334314], [1.8400588924169676, 0.9105929973100294], [2.3657900045361013, 0], [-0.2628655560595668, 0.9105929973100294], [-1.8400588924169676, -0.6070619982066863], [0.7885966681787004, 0.9105929973100294], [2.3657900045361013, -0.6070619982066863]],
        [[[0.0, -0.7946544722917661, 0.0], [0.7423442429410712, -0.0, -0.28355026945067996]], [[0.0, -0.7946544722917661, 0.0], [0.7423442429410712, -0.0, 0.28355026945067996]], [[0.39732723614588306, -0.24556173659421157, 0.6428889727400946], [0.6881909602355868, 0.14177513472533998, -0.3711721214705356]], [[0.24556173659421157, -0.6428889727400946, 0.39732723614588306], [0.6005691082157313, -0.08762185201985556, -0.5129472561958758]], [[0.39732723614588306, -0.24556173659421157, 0.6428889727400946], [0.5129472561958758, 0.6005691082157313, -0.08762185201985556]], [[-0.39732723614588306, -0.24556173659421157, -0.6428889727400946], [0.6881909602355868, -0.14177513472533998, -0.3711721214705356]], [[-0.24556173659421157, -0.6428889727400946, -0.39732723614588306], [0.6005691082157313, 0.08762185201985556, -0.5129472561958758]], [[-0.39732723614588306, -0.24556173659421157, -0.6428889727400946], [0.5129472561958758, -0.6005691082157313, -0.08762185201985556]], [[0.0, 0.7946544722917661, 0.0], [0.7423442429410712, -0.0, 0.28355026945067996]], [[0.0, 0.7946544722917661, 0.0], [0.7423442429410712, -0.0, -0.28355026945067996]], [[0.39732723614588306, 0.24556173659421157, 0.6428889727400946], [0.6881909602355868, -0.14177513472533998, -0.3711721214705356]], [[0.39732723614588306, 0.24556173659421157, 0.6428889727400946], [0.5129472561958758, -0.6005691082157313, -0.08762185201985556]], [[0.24556173659421157, 0.6428889727400946, 0.39732723614588306], [0.6005691082157313, 0.08762185201985556, -0.5129472561958758]], [[-0.39732723614588306, 0.24556173659421157, -0.6428889727400946], [0.6881909602355868, 0.14177513472533998, -0.3711721214705356]], [[-0.39732723614588306, 0.24556173659421157, -0.6428889727400946], [0.5129472561958758, 0.6005691082157313, -0.08762185201985556]], [[-0.24556173659421157, 0.6428889727400946, -0.39732723614588306], [0.6005691082157313, -0.08762185201985556, -0.5129472561958758]], [[0.24556173659421157, -0.6428889727400946, 0.39732723614588306], [0.14177513472533998, -0.3711721214705356, -0.6881909602355868]], [[0.24556173659421157, 0.6428889727400946, 0.39732723614588306], [0.14177513472533998, 0.3711721214705356, -0.6881909602355868]], [[-0.24556173659421157, -0.6428889727400946, -0.39732723614588306], [0.14177513472533998, 0.3711721214705356, -0.6881909602355868]], [[-0.24556173659421157, 0.6428889727400946, -0.39732723614588306], [0.14177513472533998, -0.3711721214705356, -0.6881909602355868]]],
        HEIGHT / 3.5)
}

function icosahedron_draw_line(ctx,preh,prev,h,v){
    var prexy = icosahedron_xy(preh,prev)
    var xy = icosahedron_xy(h,v)
    var p = prexy["part"]
    var q = xy["part"]
    if(p == q || are_eq(p, q, 8, 9) || are_eq(p, q, 9, 12) || are_eq(p, q, 12, 17) || are_eq(p, q, 12, 10) || are_eq(p, q, 11, 10) || are_eq(p, q, 10, 2) || are_eq(p, q, 2, 4) || are_eq(p, q, 2, 3) || are_eq(p, q, 16, 3) || are_eq(p, q, 3, 0) || are_eq(p, q, 0, 1) || are_eq(p, q, 0, 6) || are_eq(p, q, 18, 6) || are_eq(p, q, 6, 5) || are_eq(p, q, 5, 7) || are_eq(p, q, 5, 13) || are_eq(p, q, 14, 13) || are_eq(p, q, 13, 15) || are_eq(p, q, 15, 19)){
        draw_xy(ctx,prexy["x"],prexy["y"],xy["x"],xy["y"])
    }
}

// dymaxion
function dymaxion_xy(hangle,vangle){
    return net_xy(hangle, vangle,
[[0.35682208977308993, 0.0, 0.9341723589627157], [-0.35682208977308993, 0.0, 0.9341723589627157], [0.0, 0.9341723589627157, 0.35682208977308993], [0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.0, -0.9341723589627157, 0.35682208977308993], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.35682208977308993, 0.0, -0.9341723589627157], [-0.35682208977308993, 0.0, -0.9341723589627157], [0.0, 0.9341723589627157, -0.35682208977308993], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.0, -0.9341723589627157, -0.35682208977308993], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.9341723589627157, 0.35682208977308993, 0.0], [-0.9341723589627157, 0.35682208977308993, 0.0], [0.9341723589627157, -0.35682208977308993, 0.0], [-0.9341723589627157, -0.35682208977308993, 0.0], [-0.35682208977308993, 0.0, -0.9341723589627157], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258]],

[[0.2628655560595668, 0], [-0.2628655560595668, -0.9105929973100294], [-0.7885966681787004, 0], [-0.2628655560595668, 0.30353099910334314], [-0.7885966681787004, -0.6070619982066863], [1.314327780297834, 0], [0.7885966681787004, 0.30353099910334314], [1.314327780297834, -0.6070619982066863], [-1.8400588924169676, 1.2141239964133725], [2.891521116655235, 0.30353099910334314], [-1.3143277802978341, 0.30353099910334314], [-1.3143277802978341, 0.9105929973100294], [-1.8400588924169676, 0], [1.8400588924169676, 0.30353099910334314], [1.314327780297834, 1.2141239964133725], [2.3657900045361013, 0], [-0.2628655560595668, 0.9105929973100294], [-1.3143277802978341, -0.9105929973100294], [0.7885966681787004, 0.9105929973100294], [2.3657900045361013, -0.6070619982066863], [-2.365790004536101, 0.9105929973100294], [-0.7885966681787004, 1.2141239964133725]],

[[[0.0, -0.7946544722917661, 0.0], [0.7423442429410712, -0.0, -0.28355026945067996]], [[0.6428889727400946, -0.39732723614588306, 0.24556173659421157], [0.3711721214705356, 0.6881909602355868, 0.14177513472533998]], [[0.39732723614588306, -0.24556173659421157, 0.6428889727400946], [0.6881909602355868, 0.14177513472533998, -0.3711721214705356]], [[0.24556173659421157, -0.6428889727400946, 0.39732723614588306], [0.6005691082157313, -0.08762185201985556, -0.5129472561958758]], [[0.39732723614588306, -0.24556173659421157, 0.6428889727400946], [0.5129472561958758, 0.6005691082157313, -0.08762185201985556]], [[-0.39732723614588306, -0.24556173659421157, -0.6428889727400946], [0.6881909602355868, -0.14177513472533998, -0.3711721214705356]], [[-0.24556173659421157, -0.6428889727400946, -0.39732723614588306], [0.6005691082157313, 0.08762185201985556, -0.5129472561958758]], [[-0.39732723614588306, -0.24556173659421157, -0.6428889727400946], [0.5129472561958758, -0.6005691082157313, -0.08762185201985556]], [[0.6428889727400946, 0.39732723614588306, 0.24556173659421157], [0.3711721214705356, -0.6881909602355868, 0.14177513472533998]], [[0.0, 0.7946544722917661, 0.0], [0.7423442429410712, -0.0, -0.28355026945067996]], [[0.39732723614588306, 0.24556173659421157, 0.6428889727400946], [0.6881909602355868, -0.14177513472533998, -0.3711721214705356]], [[0.39732723614588306, 0.24556173659421157, 0.6428889727400946], [0.5129472561958758, -0.6005691082157313, -0.08762185201985556]], [[0.24556173659421157, 0.6428889727400946, 0.39732723614588306], [0.6005691082157313, 0.08762185201985556, -0.5129472561958758]], [[-0.39732723614588306, 0.24556173659421157, -0.6428889727400946], [0.6881909602355868, 0.14177513472533998, -0.3711721214705356]], [[-0.6428889727400946, -0.39732723614588306, -0.24556173659421157], [-0.08762185201985556, 0.5129472561958758, -0.6005691082157313]], [[-0.24556173659421157, 0.6428889727400946, -0.39732723614588306], [0.6005691082157313, -0.08762185201985556, -0.5129472561958758]], [[0.24556173659421157, -0.6428889727400946, 0.39732723614588306], [0.14177513472533998, -0.3711721214705356, -0.6881909602355868]], [[0.0, 0.0, 0.7946544722917661], [0.28355026945067996, 0.7423442429410712, -0.0]], [[-0.24556173659421157, -0.6428889727400946, -0.39732723614588306], [0.14177513472533998, 0.3711721214705356, -0.6881909602355868]], [[-0.24556173659421157, 0.6428889727400946, -0.39732723614588306], [0.14177513472533998, -0.3711721214705356, -0.6881909602355868]], [[0.6428889727400946, 0.39732723614588306, -0.24556173659421157], [0.3711721214705356, -0.6881909602355868, -0.14177513472533998]], [[0.6428889727400946, -0.39732723614588306, 0.24556173659421152], [-0.0876218520198556, -0.5129472561958756, -0.6005691082157311]]],
        HEIGHT / 3.5)
}

function dymaxion_draw_line(ctx,preh,prev,h,v){
    var prexy = dymaxion_xy(preh,prev)
    var xy = dymaxion_xy(h,v)
    var p = prexy["part"]
    var q = xy["part"]
    if(p == q || are_eq(p, q, 8, 20) || are_eq(p, q, 8, 11) || are_eq(p, q, 11, 10) || are_eq(p, q, 10, 12) || are_eq(p, q, 10, 2) || are_eq(p, q, 2, 4) || are_eq(p, q, 4, 1) || are_eq(p, q, 4, 17) || are_eq(p, q, 2, 3) || are_eq(p, q, 21, 16) || are_eq(p, q, 16, 3) || are_eq(p, q, 3, 0) || are_eq(p, q, 0, 6) || are_eq(p, q, 6, 18) || are_eq(p, q, 18, 14) || are_eq(p, q, 6, 5) || are_eq(p, q, 5, 7) || are_eq(p, q, 5, 13) || are_eq(p, q, 13, 15) || are_eq(p, q, 15, 19) || are_eq(p, q, 15, 9)){
        draw_xy(ctx,prexy["x"],prexy["y"],xy["x"],xy["y"])
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

// unbounded
function flat_unbounded_draw_line(ctx,prex,prey,x,y){
    draw_xy(ctx,prex,prey,x,y)
}

// hyperbolic surface
function hyper_compute_distance(px, py, qx, qy){
    var bk_angle = Math.atan2(py - qy, px - qx)
    var e = hyper_compute_endpoints(px, py, bk_angle)
    var x0 = e[0]
    var y0 = e[1]
    var x1 = e[2]
    var y1 = e[3]

    d0_to_point1 = Math.sqrt(Math.pow(x0-px, 2) + Math.pow(y0-py, 2))
    d0_to_point2 = Math.sqrt(Math.pow(x0-qx, 2) + Math.pow(y0-qy, 2))
    d1_to_point1 = Math.sqrt(Math.pow(x1-px, 2) + Math.pow(y1-py, 2))
    d1_to_point2 = Math.sqrt(Math.pow(x1-qx, 2) + Math.pow(y1-qy, 2))
    if (d1_to_point2 * d0_to_point1 < 0.00001){
        return 10000000000
    }

    return Math.abs(Math.log(d1_to_point1 * d0_to_point2 / d1_to_point2 / d0_to_point1) / 2)
}

function hyper_compute_angle_with_diameter(px, py, bk_angle){
    while(bk_angle < 0){bk_angle += 2*Math.PI}
    while(bk_angle >= 2*Math.PI){bk_angle -= 2*Math.PI}
    if(px==0 && py==0){
        return bk_angle
    }
    // y * px = x * py
    // y - py = tan(bk_angle) * (x - px)
    //
    // (py)x + (-px)y = 0
    // (tan(bk_angle))x + (-1)y = tan(bk_angle) * px - py
    //
    var cos = Math.abs((py*Math.sin(bk_angle)+px*Math.cos(bk_angle)) / (Math.sqrt((py*py+px*px)*(1-Math.pow(Math.sin(bk_angle)*px-Math.cos(bk_angle)*py, 2)))))
    if(cos > 1){cos = 1}
    var gamma = Math.acos(cos)
    var bk2 = bk_angle - Math.atan2(py, px)
    while(bk2>=Math.PI){bk2-=2*Math.PI}
    while(bk2<-Math.PI){bk2+=2*Math.PI}
    if(bk2 > Math.PI / 2){
        return Math.PI - gamma
    } else if(bk2 > 0){
        return gamma
    } else if(bk2 > -Math.PI/2){
        return -gamma
    } else {
        return gamma - Math.PI
    }
}

function hyper_compute_bk_angle(px, py, angle_with_d){
    if(angle_with_d >= Math.PI){angle_with_d -= 2*Math.PI}
    if(angle_with_d < -Math.PI){angle_with_d += 2*Math.PI}
    if(px==0 && py==0){
        return angle_with_d
    }
    var pang = Math.atan2(py, px)
    var e = [[0, 0], [0, 0]]
    if(angle_with_d > Math.PI/2){
        e = [[pang+Math.PI/2, Math.PI/2], [pang+Math.PI, Math.PI]]
    } else if(angle_with_d > 0){
        e = [[pang, 0], [pang+Math.PI/2, Math.PI/2]]
    } else if(angle_with_d > -Math.PI/2){
        e = [[pang-Math.PI/2, -Math.PI/2], [pang, 0]]
    } else {
        e = [[pang-Math.PI, -Math.PI], [pang-Math.PI/2, -Math.PI/2]]
    }

    for(var i=0;i<10;i++){
        var a = (e[0][0] + e[1][0]) / 2
        var a2 = hyper_compute_angle_with_diameter(px, py, a)
        if(a2 < angle_with_d) {
            e[0] = [a, a2]
        } else {
            e[1] = [a, a2]
        }
    }
    while(e[0][0] < 0){e[0][0] += 2*Math.PI}
    while(e[0][0] >= 2*Math.PI){e[0][0] -= 2*Math.PI}
    return e[0][0]
}

function hyper_compute_endpoints(px, py, bk_angle){
    k = (Math.sqrt(Math.pow(2 * px * Math.cos(bk_angle) + 2 * py * Math.sin(bk_angle), 2) - 4 * (px * px + py * py - 1))-(2 * px * Math.cos(bk_angle) + 2 * py * Math.sin(bk_angle))) / 2
    x1 = px + k * Math.cos(bk_angle)
    y1 = py + k * Math.sin(bk_angle)

    k = (-Math.sqrt(Math.pow(2 * px * Math.cos(bk_angle) + 2 * py * Math.sin(bk_angle), 2) - 4 * (px * px + py * py - 1))-(2 * px * Math.cos(bk_angle) + 2 * py * Math.sin(bk_angle))) / 2
    x0 = px + k * Math.cos(bk_angle)
    y0 = py + k * Math.sin(bk_angle)

    return [x0, y0, x1, y1]
}

function hyper_add(px, py, angle, length){
    var e = hyper_compute_endpoints(px, py, angle)
    var x0 = e[0]
    var y0 = e[1]
    var x1 = e[2]
    var y1 = e[3]

    d = [[[px, py], 0], [[x1, y1], 2*length]]
    for(var i = 0; i < 20; i++){
        var ptx = (d[0][0][0] + d[1][0][0]) / 2
        var pty = (d[0][0][1] + d[1][0][1]) / 2
        var try_l = hyper_compute_distance(px, py, ptx, pty)
        if(d[0][1] <= length && length < try_l){
            d = [d[0], [[ptx, pty], try_l]]
        } else {
            d = [[[ptx, pty], try_l], d[1]]
        }
    }
    return d[0][0]
}

function hyper_bk_draw_line(ctx,prex,prey,x,y){
    var scale = 0.45 * HEIGHT
    draw_xy(ctx,WIDTH/2 + scale * prex, HEIGHT/2 + scale * prey, WIDTH/2 + scale * x, HEIGHT/2 + scale * y)
}

function to_poincare(x, y){
    var ss = x*x + y*y
    var rt = Math.sqrt(1 - ss)
    return [x / (1 + rt), y / (1 + rt)]
}

function hyper_poincare_draw_line(ctx,prex,prey,x,y){
    var scale = 0.6 * HEIGHT
    if(options["surface"] == "hyperbolicunbounded") {
        scale = 0.48*HEIGHT
    }
    var pre = to_poincare(prex, prey)
    var pt = to_poincare(x, y)

    draw_xy(ctx,WIDTH/2 + scale * pre[0], HEIGHT/2 + scale * pre[1], WIDTH/2 + scale * pt[0], HEIGHT/2 + scale * pt[1])
}

function to_poincare_hp(x, y){
    var p = to_poincare(x, y)
    return [2*p[0] / (p[0]*p[0] + (1 + p[1])*(1 + p[1])),(p[0]*p[0] + p[1] * p[1] - 1) / (p[0]*p[0] + (1 + p[1])*(1 + p[1]))]
}

function to_poincare_hp_scaled(x, y){
    var scale = 0.12 * HEIGHT
    var p = to_poincare_hp(x, y)
    return [WIDTH / 2 + scale * p[0], 0.96*HEIGHT + scale * p[1]]
}

function hyper_poincare_hp_draw_line(ctx,prex,prey,x,y){
    var pre = to_poincare_hp_scaled(prex, prey)
    var pt = to_poincare_hp_scaled(x, y)

    draw_xy(ctx,pre[0], pre[1], pt[0], pt[1])
}

function to_hyperboloid(x, y){
    var d = Math.sqrt(1 - x*x - y*y)
    return [x / d, y/d, 1/d]
}

function hyper_hyperboloid_draw_line(ctx,prex,prey,x,y){
    var scale = 0.16 * HEIGHT
    var pre = to_hyperboloid(prex, prey)
    var pt = to_hyperboloid(x, y)
    var x0 = (pre[0]-pre[1]) * Math.sin(30)
    var y0 = pre[2] + (pre[0]+pre[1]) * Math.cos(30)
    var x1 = (pt[0]-pt[1]) * Math.sin(30)
    var y1 = pt[2] + (pt[0]+pt[1]) * Math.cos(30)

    draw_xy(ctx,WIDTH/2 - scale * x0, HEIGHT/8 + scale * y0,
                WIDTH/2 - scale * x1, HEIGHT/8 + scale * y1)
}

function hyper_gans_draw_line(ctx,prex,prey,x,y){
    var scale = 0.13 * HEIGHT
    var pre = to_hyperboloid(prex, prey)
    var pt = to_hyperboloid(x, y)

    draw_xy(ctx,WIDTH/2 + scale * pre[0], HEIGHT/2 + scale * pre[1],
                WIDTH/2 + scale * pt[0], HEIGHT/2 + scale * pt[1])
}

function to_hyperband(x, y){
    var p = to_poincare(x, y)
    var d = ((1-p[0])*(1-p[0])+p[1]*p[1])
    var real = ((1 + p[0])*(1 - p[0]) - p[1]*p[1]) / d
    var imag = 2*p[1] / d
    var r = Math.sqrt(real*real + imag*imag)
    var theta = Math.atan2(imag, real)
    return [Math.log(r), theta]
}

function hyper_band_draw_line(ctx,prex,prey,x,y){
    var scale = 0.36 * HEIGHT
    var pre = to_hyperband(prex, prey)
    var pt = to_hyperband(x, y)

    draw_xy(ctx,WIDTH/2 + scale * pre[0], HEIGHT/2 + scale * pre[1],
                WIDTH/2 + scale * pt[0], HEIGHT/2 + scale * pt[1])
}
