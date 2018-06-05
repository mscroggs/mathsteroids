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
var games = [
             ["sphere (mercator projection)","sphere","Mercator"],
             ["sphere (isometric)","sphere","isometric"],
             ["sphere (stereographic projection)","sphere","Stereographic"]
            ]
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
var lives = 3
var asterN = 1

var fired = 0;
var fires = Array()
var spaceship = {"x":0,"y":0,"hangle":0,"vangle":0,"rotation":0,"speed":0,"direction":0}

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
    spaceship = {"x":0,"y":0,"hangle":Math.PI,"vangle":0,"rotation":0,"speed":0,"direction":0}
    score = 0
    lives = 3
    fired = 0
    fires = Array()
    explode = Array()
    asterN = 2
    asteroids = make_new_asteroids(asterN)
}

function make_new_asteroids(n){
    var out = Array()
    for(var i=0;i<n;i++){
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

        out[i] = new_a
    }
    return out
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
    move_fire()
    move_explodes()
    move_asteroids()
    if(lives<=0){gameover()}

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
        sphere_draw_line(ctx,back_points[i][0],back_points[i][1],back_points[i][2],back_points[i][3])
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "#FFFFFF"
    for(var i=0;i<front_points.length;i++){
        sphere_draw_line(ctx,front_points[i][0],front_points[i][1],front_points[i][2],front_points[i][3])
    }
    ctx.stroke()
}

function gameover(){
    show_menu()
}

function move_fire(){
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
    if(options["surface"]=="sphere"){
        var new_speed_x = spaceship["speed"]*Math.cos(spaceship["direction"]) + 0.002*Math.cos(spaceship["rotation"])
        var new_speed_y = spaceship["speed"]*Math.sin(spaceship["direction"]) + 0.002*Math.sin(spaceship["rotation"])
        var new_speed = Math.sqrt(new_speed_x*new_speed_x+new_speed_y*new_speed_y)
        spaceship["speed"] = Math.min(0.05,new_speed)
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
    if(options["surface"]=="sphere" && options["projection"]=="isometric"){
        for(var circle=0;circle<2;circle++){
            var vangle = 0
            var hangle = 0
            var prev = 0
            var preh = 0
            var N = 100
            if(circle==1){hangle=3*Math.PI/4}
            for(var i=0;i<=N;i++){
                if(i!=0){
                    add_line_to_draw(Array(preh,prev,hangle,vangle))
                }
                prev = vangle
                preh = hangle
                if(circle==0){hangle += Math.PI*2/N}
                else{vangle += Math.PI*2/N}
            }
        }
    }
}

function draw_ship(){
    draw_sprite(ship_sprite(15))
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
    if(options["surface"]=="sphere"){
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

function close_to_asteroid(){
    for(var i=0;i<asteroids.length;i++){
        var a = asteroids[i]
        if(Math.abs(a["hangle"]-spaceship["hangle"])<2*a["radius"] && Math.abs(a["vangle"]-spaceship["vangle"])<2*a["radius"]){
            return true
        }
    }
    return false
}

function move_asteroids(){
    if(asteroids.length==0){
        asterN++
        score += 1000
        asteroids = make_new_asteroids(asterN)
    }
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

            var points = ship_sprite(1)[0]
            for(var j=0;j<points.length;j++){
                if(Math.abs(a["hangle"]-points[j][0])<0.9*a["radius"] && Math.abs(a["vangle"]-points[j][1])<0.9*a["radius"]){
                    explode[explode.length] = {"x":0,"y":0,"hangle":points[j][0],"vangle":points[j][1],"age":0,"rotation":Math.random()*Math.PI,"speed":3}
                    spaceship["rotation"] = Math.random()*2*Math.PI
                    spaceship["direction"] = spaceship["rotation"]
                    spaceship["speed"] = 0
                    while(close_to_asteroid()){
                        spaceship["hangle"] = Math.random()*2*Math.PI
                        spaceship["vangle"] = Math.random()*Math.PI-Math.PI/2
                    }
                    lives--
                    break
                }
            }

            for(var j=0;j<fires.length;j++){
                if(Math.abs(a["hangle"]-fires[j]["hangle"])<a["radius"] && Math.abs(a["vangle"]-fires[j]["vangle"])<a["radius"]){
                    fireRemove[fireRemove.length]=j
                    explode[explode.length] = {"x":0,"y":0,"hangle":a["hangle"],"vangle":a["vangle"],"age":0,"rotation":Math.random()*Math.PI,"speed":1}
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
function ship_sprite(N){
    if(options["surface"]=="sphere"){
        var out = Array()

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

        return Array(out)
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
        return Array(out)
    }
}

function explode_sprite(f){
    if(options["surface"] == "sphere"){
        var out = Array()
        var angles = Array(1,3,5)
        if(f["speed"]>1){
            for(var i=0;i<angles.length;i++){
                var part = Array()
                var p = {"hangle":f["hangle"],"vangle":f["vangle"],"rotation":angles[i]+f["rotation"]}
                p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],f["speed"]*0.01*f["age"])
                part[part.length] = Array(p["hangle"],p["vangle"])

                var N = 10
                for(var j=0;j<N;j++){
                    p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],0.1/N)
                    part[part.length] = Array(p["hangle"],p["vangle"])
                }
                out[out.length] = part
            }
        }
        for(var i=0;i<angles.length;i++){
            var part = Array()
            var p = {"hangle":f["hangle"],"vangle":f["vangle"],"rotation":angles[i]+3*f["rotation"]}
            p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],f["speed"]*0.005*(f["age"]*(200-f["age"]))/60)
            part[part.length] = Array(p["hangle"],p["vangle"])

            var N = 10
            for(var j=0;j<N;j++){
                p = add_to_sphere(p["hangle"],p["vangle"],p["rotation"],0.05/N)
                part[part.length] = Array(p["hangle"],p["vangle"])
            }
            out[out.length] = part
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
        return Array(out)
    }
}


// sphere code
function add_line_to_draw(thing){
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
    front_points[front_points.length] = thing
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
