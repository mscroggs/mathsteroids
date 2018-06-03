/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/


// Global variables
var options = {"surface":"sphere","projection":"Mercator"}
var RADIUS = 2
var upPressed    = false;
var firePressed  = false;
var leftPressed  = false;
var rightPressed = false;
var mouse = "";
var WIDTH=800
var HEIGHT=450

var fired = 0;
var fires = Array()
var position = {"x":0,"y":0,"z":0,"hangle":0,"vangle":0,"rotation":0}
var speed = {"speed":0,"rotation":0}

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
    position = {"x":0,"y":0,"z":0,"hangle":Math.PI,"vangle":0,"rotation":0}
    speed = {"speed":0,"rotation":0}
    fired = 0
    fires = Array()
}

function tick(){
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
    move_ship()
    fire()
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    draw_ship(ctx)
    draw_fire(ctx)
    ctx.stroke();
}

function fire(){
    var remove = Array()
    var new_fires = Array()
    for(var i=0;i<fires.length;i++){
        fires[i]["age"]++
        if(fires[i]["age"]<40){
            new_pos = add_to_sphere(fires[i]["hangle"],fires[i]["vangle"],fires[i]["rotation"],fires[i]["speed"])
            fires[i]["hangle"] = new_pos["hangle"]
            fires[i]["vangle"] = new_pos["vangle"]
            fires[i]["rotation"] = new_pos["rotation"]
            new_fires[new_fires.length] = fires[i]
        }
    }
    fires = new_fires
    if(firePressed){
        if(fired==0){
            new_pos = add_to_sphere(position["hangle"],position["vangle"],position["rotation"],0.1)
            new_pos["speed"] = 0.05 + speed["speed"]*(Math.cos(position["rotation"]-speed["rotation"]))
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

function increase_speed(){
    if(options["surface"]=="sphere"){
        var new_speed_x = speed["speed"]*Math.cos(speed["rotation"]) + 0.01*Math.cos(position["rotation"])
        var new_speed_y = speed["speed"]*Math.sin(speed["rotation"]) + 0.01*Math.sin(position["rotation"])
        var new_speed = Math.sqrt(new_speed_x*new_speed_x+new_speed_y*new_speed_y)
        speed["speed"] = Math.min(0.07,new_speed)
        speed["rotation"] = Math.atan2(new_speed_y,new_speed_x)
    }
}

function decrease_speed(){
    if(options["surface"]=="sphere"){
        speed["speed"] = Math.max(0,speed["speed"]-0.0001)
    }
}

function rotate_left(){
    position["rotation"] -= 0.07
}

function rotate_right(){
    position["rotation"] += 0.07
}

function draw_fire(ctx){
    if(options["surface"] == "sphere"){
        for(var i=0;i<fires.length;i++){
            starth = fires[i]["hangle"]
            startv = fires[i]["vangle"]
            var N = 10
            var rot = fires[i]["rotation"]
            for(var j=0;j<N;j++){
                var new_pos = add_to_sphere(starth,startv,rot,0.1/N)
                endh = new_pos["hangle"]
                endv = new_pos["vangle"]
                rot = new_pos["rotation"]
                if(options["projection"] == "Mercator"){
                    Mercator_draw_line(ctx,starth,startv,endh,endv)
                }
                if(options["projection"] == "isometric"){
                    isometric_draw_line(ctx,starth,startv,endh,endv)
                }
                starth = new_pos["hangle"]
                startv = new_pos["vangle"]
            }
        }
    }
}

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

function isometric_move(ctx,h,v){
    var xy = isometric_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    ctx.moveTo(x,y)
}
function isometric_draw_line(ctx,preh,prev,h,v){
    var xy = isometric_xy(preh,prev)
    var prex = xy["x"]
    var prey = xy["y"]
    xy = isometric_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
/*    if(Math.abs(x-prex)>WIDTH/2){
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(WIDTH,ymid)
        ctx.moveTo(0,ymid)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
    } else {*/
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
    //}
}

function Mercator_move(ctx,h,v){
    var xy = Mercator_xy(h,v)
    var x = xy["x"]
    var y = xy["y"]
    ctx.moveTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(WIDTH,ymid)
        ctx.moveTo(0,ymid)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
    } else {
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
    }
}

function draw_ship(ctx){
    if(options["surface"]=="sphere"){
        points = ship_sprite()
        var preh = 0
        var prev = 0
        for(var i=0;i<points.length;i++){
            var hangle = points[i][0]
            var vangle = points[i][1]
            if(options["projection"]=="Mercator"){
                if(i==0){
                    Mercator_move(ctx,hangle,vangle)
                } else {
                    Mercator_draw_line(ctx,preh,prev,hangle,vangle)
                }
            }
            if(options["projection"]=="isometric"){
                if(i==0){
                    isometric_move(ctx,hangle,vangle)
                } else {
                    isometric_draw_line(ctx,preh,prev,hangle,vangle)
                }
            }
            preh = hangle
            prev = vangle
        }
    }
}

function add_to_sphere(hangle, vangle, rot, badd){
    alpha = Math.acos(Math.cos(rot)*Math.cos(vangle))
    a = hangle - Math.atan2(Math.cos(rot) * Math.sin(vangle),Math.sin(rot))
    b = Math.atan2(Math.sin(vangle), Math.sin(rot)*Math.cos(vangle))

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
    return {"hangle":hangle,"vangle":vangle,"rotation":rot}
}

function move_ship(){
    if(options["surface"]=="sphere"){
        var new_pos = add_to_sphere(position["hangle"],position["vangle"],speed["rotation"],speed["speed"])
        position["rotation"] -= speed["rotation"]
        speed["rotation"] = new_pos["rotation"]
        position["rotation"] += speed["rotation"]
        position["hangle"] = new_pos["hangle"]
        position["vangle"] = new_pos["vangle"]
    }
}

function ship_sprite(){
    if(options["surface"]=="sphere"){
        var out = Array()
        var N = 15

        var p = {"hangle":position["hangle"],"vangle":position["vangle"],"rotation":position["rotation"]}
        out[out.length] = Array(p["hangle"],p["vangle"])

        p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"]+Math.PI/2+Math.atan2(1,Math.cos(0.05)),0)
        var leng = Math.acos(Math.cos(0.05)*Math.cos(0.05))
        for(var i=1;i<=N;i++){
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],leng/N)
            out[out.length] = Array(p["hangle"],p["vangle"])
        }

        p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"]+Math.PI+Math.atan2(Math.sin(0.15),Math.sin(0.05)*Math.cos(0.15))-Math.atan2(1,Math.cos(0.05)),0)
        leng = Math.acos(Math.cos(0.05)*Math.cos(0.15))
        for(var i=1;i<=N;i++){
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],leng/N)
            out[out.length] = Array(p["hangle"],p["vangle"])
        }

        p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"]+Math.PI+2*Math.atan2(Math.sin(0.05),Math.sin(0.15)*Math.cos(0.05)),0)
        for(var i=1;i<=N;i++){
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],leng/N)
            out[out.length] = Array(p["hangle"],p["vangle"])
        }

        p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"]+Math.PI+Math.atan2(Math.sin(0.15),Math.sin(0.05)*Math.cos(0.15))-Math.atan2(1,Math.cos(0.05)),0)
        var leng = Math.acos(Math.cos(0.05)*Math.cos(0.05))
        for(var i=1;i<=N;i++){
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],leng/N)
            out[out.length] = Array(p["hangle"],p["vangle"])
        }

        return out
    }
}

// inputs

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if(keyName == "q"){
        show_menu()
    }
    process_key(keyName,true)
    button_styles()
});

function process_key(keyName, result){
    if(keyName == "ArrowUp" || keyName == "w"){
        upPressed=result;
    }
    if(keyName == "ArrowLeft" || keyName == "a"){
        leftPressed=result;
    }
    if(keyName == "ArrowRight" || keyName == "d"){
        rightPressed=result;
    }
    if(keyName == " " || keyName == "ArrowDown" || keyName == "s" || keyName == "k"){
        firePressed=result;
    }
}

document.addEventListener('mouseup', (event) => {
    if(mouse=="up"){
        upPressed=false;
    }
    if(mouse=="fire"){
        firePressed=false;
    }
    if(mouse=="right"){
        rightPressed=false;
    }
    if(mouse=="left"){
        leftPressed=false;
    }
    button_styles()
});

document.getElementById("display_up").addEventListener('touchstart', (event) => {
    upPressed=true;
    button_styles()
});
document.getElementById("display_up").addEventListener('mousedown', (event) => {
    upPressed=true;
    mouse = "up"
    button_styles()
});

document.getElementById("display_fire").addEventListener('touchstart', (event) => {
    firePressed=true;
    button_styles()
});
document.getElementById("display_fire").addEventListener('mousedown', (event) => {
    firePressed=true;
    mouse = "fire"
    button_styles()
});

document.getElementById("display_up").addEventListener('touchend', (event) => {
    upPressed=false;
    button_styles()
});

document.getElementById("display_left").addEventListener('touchstart', (event) => {
    leftPressed=true;
    button_styles()
});
document.getElementById("display_left").addEventListener('mousedown', (event) => {
    leftPressed=true;
    mouse = "left"
    button_styles()
});

document.getElementById("display_left").addEventListener('touchend', (event) => {
    leftPressed=false;
    button_styles()
});

document.getElementById("display_right").addEventListener('touchstart', (event) => {
    rightPressed=true;
    button_styles()
});
document.getElementById("display_right").addEventListener('mousedown', (event) => {
    rightPressed=true;
    mouse = "right"
    button_styles()
});

document.getElementById("display_right").addEventListener('touchend', (event) => {
    rightPressed=false;
    button_styles()
});

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    process_key(keyName,false)
    button_styles()
});

function button_styles(){
    if(upPressed){
        document.getElementById("display_up").style.backgroundColor="red"
    } else {
        document.getElementById("display_up").style.backgroundColor="white"
    }
    if(firePressed){
        document.getElementById("display_fire").style.backgroundColor="red"
    } else {
        document.getElementById("display_fire").style.backgroundColor="white"
    }
    if(leftPressed){
        document.getElementById("display_left").style.backgroundColor="red"
    } else {
        document.getElementById("display_left").style.backgroundColor="white"
    }
    if(rightPressed){
        document.getElementById("display_right").style.backgroundColor="red"
    } else {
        document.getElementById("display_right").style.backgroundColor="white"
    }
}

// Menu screen
function show_menu(){
    menu_tick()
    clearInterval(interval)
    interval = setInterval(menu_tick,1000/60);
//    start_game()
}

var leftTimer=0
var rightTimer=0
var games = [
             ["sphere (mercator projection)","sphere","Mercator"],
             ["sphere (isometric)","sphere","isometric"]
            ]
var game_n = 0
var game_title = ""

function changeGameN(i){
    game_n += i
    if(game_n>=games.length){game_n-=games.length}
    if(game_n<0){game_n+=games.length}
    game_title = games[game_n][0]
    options["surface"] = games[game_n][1]
    options["projection"] = games[game_n][2]
}
changeGameN(0)


function menu_tick(){
    if(leftPressed){
        if(leftTimer==0){
            changeGameN(-1)
        }
        leftTimer++
        leftTimer%=15
    } else {
        leftTimer = 0
    }
    if(rightPressed){
        if(rightTimer==0){
            changeGameN(1)
        }
        rightTimer++
        rightTimer%=15
    } else {
        rightTimer = 0
    }
    if(firePressed){
        firePressed = false
        start_game()
    }
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    draw_titles(ctx)
    add_scaled_text(ctx,"surface:",20,HEIGHT-45,0.5)
    add_scaled_text(ctx,"<< "+game_title+" >>",150,HEIGHT-45,0.5)
    add_scaled_text(ctx,"press <fire> to begin",WIDTH-295,HEIGHT-20,0.5)
    ctx.stroke();
}

function draw_titles(ctx){
    add_text(ctx, "Mathsteroids %"+VERSION, 20, 70)
}

function add_text(ctx, text, x, y){
    add_scaled_text(ctx, text, x, y, 1)
}
function add_scaled_text(ctx, text, x, y, scale){
    for (var i=0;i<text.length;i++) {
        x = add_letter(ctx, text.charAt(i), x, y, scale);
    }
}

show_menu()

function add_letter(ctx,letter,x,y,scale){
    if(letter==" "){
        return x+20*scale
    }
    if(!(letter in font_data)){
        letter = "??"
    }
    var lines = font_data[letter]
    xout = x
    for(var j=0;j<lines.length;j++){
        for(var i=0;i<lines[j].length;i+=lines[j].length-1){
            ctx.moveTo(x+lines[j][i][0]*scale-1,y+lines[j][i][1]*scale)
            ctx.lineTo(x+lines[j][i][0]*scale+1,y+lines[j][i][1]*scale)
            ctx.moveTo(x+lines[j][i][0]*scale,y+lines[j][i][1]*scale-1)
            ctx.lineTo(x+lines[j][i][0]*scale,y+lines[j][i][1]*scale+1)
        }
        for(var i=0;i<lines[j].length;i++){
            if(i==0){
                ctx.moveTo(x+lines[j][i][0]*scale,y+lines[j][i][1]*scale)
            } else {
                ctx.lineTo(x+lines[j][i][0]*scale,y+lines[j][i][1]*scale)
            }
            xout = Math.max(xout,x+lines[j][i][0]*scale)
        }
    }
    return xout+10*scale
}
