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
var leftPressed  = false;
var rightPressed = false;
var mouse = "";
var WIDTH=800
var HEIGHT=450

var position = {"x":0,"y":0,"z":0,"hangle":0,"vangle":0}
var rotation = 0
var speed = 0

function reset(){
    position = {"x":0,"y":0,"z":0,"hangle":Math.PI,"vangle":0}
    rotation = 0
    speed = 0
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
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    draw_ship(ctx)
}
tick()

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

function draw_ship(ctx){
    if(options["projection"]=="Mercator"){
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 2
        ctx.beginPath()
        points = ship_sprite()
        var prex = -1
        var prey = -1
        for(var i=0;i<points.length;i++){
            var hangle = points[i][0]
            var vangle = points[i][1]
            var x = WIDTH * hangle/(2*Math.PI)
            var y = 0
            var maxa = 85.05 * Math.PI/180
            if(-maxa <= vangle <= maxa){
                y = HEIGHT/2 + HEIGHT/2 * Math.log(Math.tan(Math.PI/4+vangle/2))/Math.log(Math.tan(Math.PI/4+maxa/2))
            } else if(vangle > maxa){
                y = -5
            } else {
                y = HEIGHT+5
            }
            if(i==0){
                ctx.moveTo(x,y)
            } else {
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
                    ctx.lineTo(x,y)
                }
            }
            prex = x
            prey = y
        }
        ctx.stroke();
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
    if(keyName == "ArrowUp"){
        upPressed=true;
    }
    if(keyName == "ArrowLeft"){
        leftPressed=true;
    }
    if(keyName == "ArrowRight"){
        rightPressed=true;
    }
    button_styles()
});

document.addEventListener('mouseup', (event) => {
    if(mouse=="up"){
        upPressed=false;
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
    if(keyName == "ArrowUp"){
        upPressed=false;
    }
    if(keyName == "ArrowLeft"){
        leftPressed=false;
    }
    if(keyName == "ArrowRight"){
        rightPressed=false;
    }
    button_styles()
});

function button_styles(){
    if(upPressed){
        document.getElementById("display_up").style.backgroundColor="red"
    } else {
        document.getElementById("display_up").style.backgroundColor="white"
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

setInterval(tick,10);
