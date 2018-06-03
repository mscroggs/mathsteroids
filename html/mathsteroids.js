/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/


var options = {"surface":"sphere","projection":"Mercator"}
var upPressed    = false;
var firePressed  = false;
var leftPressed  = false;
var rightPressed = false;
var mouse = "";
var WIDTH=800
var HEIGHT=450

var fired = false;
var fires = Array()
var position = {"x":0,"y":0,"z":0,"hangle":0,"vangle":0}
var rotation = 0
var speed = 0

function reset(){
    position = {"x":0,"y":0,"z":0,"hangle":Math.PI,"vangle":0}
    rotation = 0
    speed = 0
    fired = false
    fires = Array()
}
reset()

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
tick()

function fire(){
    var remove = Array()
    var new_fires = Array()
    for(var i=0;i<fires.length;i++){
        fires[i]["age"]++
        if(fires[i]["age"]<20){
            new_pos = add_to_sphere(fires[i]["hangle"],fires[i]["vangle"],fires[i]["rotation"],speed+0.1)
            fires[i]["hangle"] = new_pos["hangle"]
            fires[i]["vangle"] = new_pos["vangle"]
            fires[i]["rotation"] = new_pos["rotation"]
            new_fires[new_fires.length] = fires[i]
        }
    }
    fires = new_fires
    if(firePressed && !fired){
        fired = true
        new_pos = add_to_sphere(position["hangle"],position["vangle"],rotation,0.1)
        new_pos["age"] = 0
        fires[fires.length] = new_pos
    }
    if(!firePressed){
        fired=false
    }
}

function increase_speed(){
    if(options["surface"]=="sphere"){
        speed = Math.min(0.07,speed+0.001)
    }
}

function decrease_speed(){
    if(options["surface"]=="sphere"){
        speed = Math.max(0,speed-0.0001)
    }
}

function rotate_left(){
    rotation -= 0.1
}

function rotate_right(){
    rotation += 0.1
}

function draw_fire(ctx){
    if(options["projection"] == "Mercator"){
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
                Mercator_draw_line(ctx,starth,startv,endh,endv)
                starth = new_pos["hangle"]
                startv = new_pos["vangle"]
            }
        }
    }
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
    if(options["projection"]=="Mercator"){
        points = ship_sprite()
        var preh = 0
        var prev = 0
        for(var i=0;i<points.length;i++){
            var hangle = points[i][0]
            var vangle = points[i][1]
            if(i==0){
                Mercator_move(ctx,hangle,vangle)
            } else {
                Mercator_draw_line(ctx,preh,prev,hangle,vangle)
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

    b += badd

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
        new_pos = add_to_sphere(position["hangle"],position["vangle"],rotation,speed)
        rotation = new_pos["rotation"]
        position["hangle"] = new_pos["hangle"]
        position["vangle"] = new_pos["vangle"]
    }
}

function ship_sprite(){
    if(options["surface"]=="sphere"){
        var out = Array()
        var N = 15

        var p = {"hangle":position["hangle"],"vangle":position["vangle"],"rotation":rotation}
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

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
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

setInterval(tick,1000/60);
