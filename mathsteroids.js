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

var score = 0

var fired = 0;
var fires = Array()
var spaceship = {"x":0,"y":0,"hangle":0,"vangle":0,"rotation":0,"speed":0,"direction":0}

var asteroids = Array()

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
    spaceship = {"x":0,"y":0,"hangle":Math.PI,"vangle":0,"rotation":0,"speed":0,"direction":0}
    score = 0
    fired = 0
    fires = Array()
    asteroids = Array()
    for(var i=0;i<5;i++){
        new_a = {"x":0,"y":0,"hangle":0,"vangle":0,
                 "rotation":Math.random()*Math.PI*2,"speed":0.005+Math.random()*0.005,"direction":Math.random()*Math.PI*2,
                 "size":4,"radius":0.01,"sides":2}
        while(too_close(new_a,spaceship)){
            new_a["x"] = Math.random()*WIDTH
            new_a["y"] = Math.random()*HEIGHT
            new_a["hangle"] = Math.random()*Math.PI*2
            new_a["vangle"] = Math.random()*Math.PI*2-Math.PI
        }
        var as = get_a_s(new_a)
        new_a["radius"] = as["radius"]
        new_a["sides"] = as["sides"]

        asteroids[i] = new_a
    }
}

function too_close(p,q){
    if(Math.abs(p["x"]-q["x"])<100){return true}
    if(Math.abs(p["y"]-q["y"])<100){return true}
    if(Math.abs(p["hangle"]-q["hangle"])<0.5){return true}
    if(Math.abs(p["vangle"]-q["vangle"])<0.5){return true}
    return false
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
    move_asteroids()
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_scaled_text(ctx,""+score,20,38,0.6)
    draw_ship(ctx)
    draw_fire(ctx)
    draw_asteroids(ctx)
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
            new_pos = add_to_sphere(spaceship["hangle"],spaceship["vangle"],spaceship["rotation"],0.1)
            new_pos["speed"] = 0.05 + spaceship["speed"]*(Math.cos(spaceship["rotation"]-spaceship["direction"]))
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
        var new_speed_x = spaceship["speed"]*Math.cos(spaceship["direction"]) + 0.01*Math.cos(spaceship["rotation"])
        var new_speed_y = spaceship["speed"]*Math.sin(spaceship["direction"]) + 0.01*Math.sin(spaceship["rotation"])
        var new_speed = Math.sqrt(new_speed_x*new_speed_x+new_speed_y*new_speed_y)
        spaceship["speed"] = Math.min(0.07,new_speed)
        spaceship["direction"] = Math.atan2(new_speed_y,new_speed_x)
    }
}

function decrease_speed(){
    if(options["surface"]=="sphere"){
        spaceship["speed"] = Math.max(0,spaceship["speed"]-0.0001)
    }
}

function rotate_left(){
    spaceship["rotation"] -= 0.07
}

function rotate_right(){
    spaceship["rotation"] += 0.07
}

function draw_ship(ctx){
    draw_sprite(ctx,ship_sprite())
}

function draw_asteroids(ctx){
    for(var i=0;i<asteroids.length;i++){
        draw_sprite(ctx,asteroid_sprite(asteroids[i]))
    }
}

function draw_fire(ctx){
    for(var i=0;i<fires.length;i++){
        draw_sprite(ctx,fire_sprite(fires[i]))
    }
}

function draw_sprite(ctx, points){
    if(options["surface"]=="sphere"){
        var preh = 0
        var prev = 0
        for(var i=0;i<points.length;i++){
            var hangle = points[i][0]
            var vangle = points[i][1]
            if(i==0){
                sphere_move(ctx,hangle,vangle)
            } else {
                sphere_draw_line(ctx,preh,prev,hangle,vangle)
            }
            preh = hangle
            prev = vangle
        }
    }
}

function move_ship(){
    if(options["surface"]=="sphere"){
        var new_pos = add_to_sphere(spaceship["hangle"],spaceship["vangle"],spaceship["direction"],spaceship["speed"])
        spaceship["rotation"] -= spaceship["direction"]
        spaceship["direction"] = new_pos["rotation"]
        spaceship["rotation"] += spaceship["direction"]
        spaceship["hangle"] = new_pos["hangle"]
        spaceship["vangle"] = new_pos["vangle"]
    }
}

function get_a_s(a){
    var out = {}
    if(a["size"]==4){
        out["radius"] = 0.1
        out["sides"] = 6
    }
    if(a["size"]==3){
         out["radius"] = 0.085
         out["sides"] = 5
    }
    if(a["size"]==2){
         out["radius"] = 0.07
         out["sides"] = 4
    }
    if(a["size"]==1){
         out["radius"] = 0.06
         out["sides"] = 3
    }
    return out
}

function move_asteroids(){
    var new_asteroids = Array()
    if(options["surface"]=="sphere"){
        for(var i=0;i<asteroids.length;i++){
            var a = asteroids[i]
            var new_pos = add_to_sphere(a["hangle"],a["vangle"],a["direction"],a["speed"])
            a["rotation"] -= a["direction"]
            a["direction"] = new_pos["rotation"]
            a["rotation"] += a["direction"]
            a["hangle"] = new_pos["hangle"]
            a["vangle"] = new_pos["vangle"]

            var fireRemove = Array()
            for(var j=0;j<fires.length;j++){
                if(Math.abs(a["hangle"]-fires[j]["hangle"])<a["radius"] && Math.abs(a["vangle"]-fires[j]["vangle"])<a["radius"]){
                    fireRemove[fireRemove.length]=j
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
                    var new_a = {"x":a["x"],"y":a["y"],"hangle":a["hangle"],"vangle":a["vangle"],
                                 "rotation":a["rotation"]-Math.PI/4+Math.random()*Math.PI/2,"speed":0.005+Math.random()*1.1*a["speed"],
                                 "direction":a["direction"]-Math.PI/4+Math.random()*Math.PI/2,
                                 "size":a["size"]-1,"radius":0.01,"sides":2}
                    var as = get_a_s(new_a)
                    new_a["radius"] = as["radius"]
                    new_a["sides"] = as["sides"]
                    new_asteroids[new_asteroids.length] = new_a

                    var new_b = {"x":a["x"],"y":a["y"],"hangle":a["hangle"],"vangle":a["vangle"],
                                 "rotation":a["rotation"]+Math.PI/4+Math.random()*Math.PI/2,"speed":0.005+Math.random()*1.1*a["speed"],
                                 "direction":a["direction"]+Math.PI/4+Math.random()*Math.PI/2,
                                 "size":a["size"]-1,"radius":0.01,"sides":2}
                    var as = get_a_s(new_b)
                    new_b["radius"] = as["radius"]
                    new_b["sides"] = as["sides"]
                    new_asteroids[new_asteroids.length] = new_b
                }
            }
        }
    }
    asteroids = new_asteroids
}

// sprites
function ship_sprite(){
    if(options["surface"]=="sphere"){
        var out = Array()
        var N = 15

        var p = {"hangle":spaceship["hangle"],"vangle":spaceship["vangle"],"rotation":spaceship["rotation"]}
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

function fire_sprite(f){
    if(options["surface"] == "sphere"){
        var out = Array()
        var p = {"hangle":f["hangle"],"vangle":f["vangle"],"rotation":f["rotation"]}
        out[out.length] = Array(p["hangle"],p["vangle"])

        var N = 10
        for(var j=0;j<N;j++){
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],0.1/N)
            out[out.length] = Array(p["hangle"],p["vangle"])
        }
        return out
    }
}

function asteroid_sprite(a){
    if(options["surface"] == "sphere"){
        var r = a["radius"]
        var sides = a["sides"]
        var side_l = Math.acos(Math.cos(r)*Math.cos(r)+Math.sin(r)*Math.sin(r)*Math.cos(2*Math.PI/sides))
        var angle = Math.acos(Math.cos(r)*(1-Math.cos(side_l)) / (Math.sin(r)*Math.sin(side_l)))
        var out = Array()

        var p = {"hangle":a["hangle"],"vangle":a["vangle"],"rotation":a["rotation"]}
        p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],r)
        p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"]+angle,0)

        out[out.length] = Array(p["hangle"],p["vangle"])

        for(var i=0;i<sides;i++){
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"]+Math.PI-2*angle,0)

            var N = 10
            for(var j=0;j<N;j++){
                p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],side_l/N)
                out[out.length] = Array(p["hangle"],p["vangle"])
            }
        }
        return out
    }
}


// sphere code
function sphere_move(ctx,hangle,vangle){
    if(options["projection"]=="Mercator"){
        Mercator_move(ctx,hangle,vangle)
    }
    if(options["projection"]=="isometric"){
        isometric_move(ctx,hangle,vangle)
    }
}

function sphere_draw_line(ctx,preh,prev,hangle,vangle){
    if(options["projection"]=="Mercator"){
        Mercator_draw_line(ctx,preh,prev,hangle,vangle)
    }
    if(options["projection"]=="isometric"){
        isometric_draw_line(ctx,preh,prev,hangle,vangle)
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
    ctx.moveTo(prex,prey)
    ctx.lineTo(x,y)
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
