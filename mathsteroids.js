//********************************/
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
             ["sphere (stereographic projection)","sphere","stereographic"],
             ["sphere (gall-peters projection)","sphere","Gall"],
             ["(flat) torus","torus","flat"],
             ["(flat) klein bottle","Klein","flat"],
             ["(flat) real projective plane","real-pp","flat"]
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
    if(options["projection"]=="flat"){
        spaceship["hangle"] = WIDTH/2
        spaceship["vangle"] = HEIGHT/2
    } else if(options["surface"]=="sphere"){
        if(options["projection"]=="Mercator" || options["projection"]=="Gall"){
            spaceship["hangle"] = Math.PI
        }
        if(options["projection"]=="stereographic"){
            spaceship["vangle"] = Math.PI/2
        }
    }
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
        new_a = {"hangle":spaceship["hangle"],"vangle":spaceship["vangle"],
                 "rotation":Math.random()*Math.PI*2,"direction":Math.random()*Math.PI*2,
                 "size":4,"sides":2,
                 "radius":1,"speed":1}
        if(options["surface"]=="sphere"){
            new_a["speed"] = 0.005+Math.random()*0.005
            new_a["radius"] = 0.01
        }
        if(options["projection"] == "flat"){
            new_a["speed"] = 0.5+Math.random()*0.5
            new_a["radius"] = 0.1
        }
        while(too_close(new_a,spaceship)){
            if(options["surface"]=="sphere"){
                new_a["hangle"] = Math.random()*Math.PI*2
                new_a["vangle"] = Math.random()*Math.PI*2-Math.PI
            }
            if(options["projection"] == "flat"){
                new_a["hangle"] = Math.random()*WIDTH
                new_a["vangle"] = Math.random()*HEIGHT
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
    if(options["surface"]=="sphere"){
        var d = 0.15
        var x1 = Math.cos(p["hangle"])*Math.cos(p["vangle"])
        var x2 = Math.cos(q["hangle"])*Math.cos(q["vangle"])
        var y1 = Math.cos(p["hangle"])*Math.sin(p["vangle"])
        var y2 = Math.cos(q["hangle"])*Math.sin(q["vangle"])
        var z1 = Math.sin(p["vangle"])
        var z2 = Math.sin(q["vangle"])
    }
    if(options["projection"]=="flat"){
        var d = 80
        var x1 = p["hangle"]
        var x2 = q["hangle"]
        var y1 = p["vangle"]
        var y2 = q["vangle"]
        var z1 = 0
        var z2 = 0
    }
    if(Math.abs(x1-x2)<d && Math.abs(y1-y2)<d && Math.abs(z1-z2)<d){
        return true
    }
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

    if(lives<=0){gameover()}
}

function gameover(){
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

    setTimeout(gameoveron,1000)
}

function gameoveron(){
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect((WIDTH-440)/2,(HEIGHT-50)/2+60,440,40);

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    add_scaled_text(ctx, "press any key to continue", (WIDTH-440)/2+10, (HEIGHT-50)/2+90, 0.6)
    ctx.stroke();

    interval = setInterval(overtick,1000/60);
}
function overtick(){
    if(upPressed || firePressed || leftPressed || rightPressed){
        show_menu()
    }
}

function move_fire(){
    var new_fires = Array()
    for(var i=0;i<fires.length;i++){
        fires[i]["age"]++
        if(fires[i]["age"]<40){
            new_pos = add_to_surface(fires[i]["hangle"],fires[i]["vangle"],fires[i]["rotation"],fires[i]["speed"],1)
            fires[i]["hangle"] = new_pos["hangle"]
            fires[i]["vangle"] = new_pos["vangle"]
            fires[i]["rotation"] = new_pos["rotation"]
            new_fires[new_fires.length] = fires[i]
        }
    }
    fires = new_fires
    if(firePressed){
        if(fired==0){
            if(options["surface"] == "sphere"){
                var leng = 0.1
                var speed = 0.05
            }
            if(options["projection"] == "flat"){
                var leng = 10
                var speed = 5
            }
            new_pos = add_to_surface(spaceship["hangle"],spaceship["vangle"],spaceship["rotation"],leng,1)
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
    if(options["projection"]=="flat"){
        var speed_add = 0.2
        var speed_max = 5
    }
    if(options["surface"]=="sphere"){
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
    if(options["projection"]=="flat"){
        var slow=0.01
    }
    if(options["surface"]=="sphere"){
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
    var new_pos = add_to_surface(sprite["hangle"],sprite["vangle"],sprite["direction"],sprite["speed"],1)
    sprite["rotation"] *= new_pos["flip"]
    sprite["rotation"] -= sprite["direction"]
    sprite["direction"] = new_pos["rotation"]
    sprite["rotation"] += new_pos["flip"]*sprite["direction"] // TODO
    sprite["hangle"] = new_pos["hangle"]
    sprite["vangle"] = new_pos["vangle"]
    return sprite
}

function get_a_s(a){
    var mult = 1
    if(options["projection"]=="flat"){
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
        for(var j=0;j<points.length;j++){
            if(Math.abs(a["hangle"]-points[j][0])<0.9*a["radius"] && Math.abs(a["vangle"]-points[j][1])<0.9*a["radius"]){
                explode[explode.length] = {"hangle":points[j][0],"vangle":points[j][1],"age":0,"rotation":Math.random()*Math.PI,"speed":3}
                spaceship["rotation"] = Math.random()*2*Math.PI
                spaceship["direction"] = spaceship["rotation"]
                spaceship["speed"] = 0
                var counter = 0
                while(close_to_asteroid() && counter<50){
                    counter ++
                    if(options["surface"]=="sphere"){
                        spaceship["hangle"] = Math.random()*2*Math.PI
                        spaceship["vangle"] = Math.random()*Math.PI-Math.PI/2
                    }
                    if(options["projection"]=="flat"){
                        spaceship["hangle"] = Math.random()*WIDTH
                        spaceship["vangle"] = Math.random()*HEIGHT
                    }
                }
                lives--
                break
            }
        }

        for(var j=0;j<fires.length;j++){
            if(Math.abs(a["hangle"]-fires[j]["hangle"])<a["radius"] && Math.abs(a["vangle"]-fires[j]["vangle"])<a["radius"]){
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
                if(options["surface"]=="sphere"){
                    var speed_start = 0.005
                }
                if(options["projection"]=="flat"){
                    var speed_start = 0.5
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
    if(options["projection"]=="flat"){
        var size1 = 10
        var size2 = 15
        var leng = size1
        var leng2 = Math.sqrt(size1*size1+size2*size2+Math.sqrt(2)*size1*size2)
        var angle = Math.asin(size2/(Math.sqrt(2)*leng2))
        var bngle = Math.asin(size1/(Math.sqrt(2)*leng2))
        var cngle = Math.PI/4
    }
    if(options["surface"]=="sphere"){
        var size1 = 0.05
        var size2 = 0.15
        var leng = Math.acos(Math.cos(size1)*Math.cos(size1))
        var leng2 = Math.acos(Math.cos(size1)*Math.cos(size2))
        var angle = Math.atan2(Math.sin(0.15),Math.sin(0.05)*Math.cos(0.15))-Math.atan2(1,Math.cos(0.05))
        var bngle = Math.atan2(Math.sin(0.05),Math.sin(0.15)*Math.cos(0.05))
        var cngle = Math.atan2(1,Math.cos(0.05))
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

function fire_sprite(f){
    var out = Array()
    if(options["surface"] == "sphere"){
        var leng = 0.1
    }
    if(options["projection"]=="flat"){
        var leng = 10
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
    if(options["projection"] == "flat"){
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
    if(options["surface"] == "sphere"){
        var side_l = Math.acos(Math.cos(r)*Math.cos(r)+Math.sin(r)*Math.sin(r)*Math.cos(2*Math.PI/sides))
        var angle = Math.acos(Math.cos(r)*(1-Math.cos(side_l)) / (Math.sin(r)*Math.sin(side_l)))
    }
    if(options["projection"] == "flat"){
        var side_l = r*Math.sqrt(2-2*Math.cos(2*Math.PI/sides))
        var angle = (sides-2)*Math.PI/(2*sides)
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


// surface code
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

function draw_line(ctx,preh,prev,hangle,vangle){
    if(options["projection"]=="flat"){
        if(options["surface"]=="torus"){
            flat_torus_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["surface"]=="Klein"){
            flat_Klein_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["surface"]=="real-pp"){
            flat_real_pp_draw_line(ctx,preh,prev,hangle,vangle)
        }
    } else if(options["surface"]=="sphere"){
        if(options["projection"]=="Mercator"){
            Mercator_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="Gall"){
            Gall_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="isometric"){
            isometric_draw_line(ctx,preh,prev,hangle,vangle)
        } else if(options["projection"]=="stereographic"){
            stereographic_draw_line(ctx,preh,prev,hangle,vangle)
        }
    }
}

function add_to_surface(hangle, vangle, rot, badd, flip){
    if(options["projection"]=="flat"){
        hangle += badd*Math.cos(rot)
        vangle += badd*Math.sin(rot)
        if(options["surface"]=="torus"){
            if(hangle>WIDTH){hangle-=WIDTH}
            if(hangle<0){hangle+=WIDTH}
            if(vangle>HEIGHT){vangle-=HEIGHT}
            if(vangle<0){vangle+=HEIGHT}
        }
        if(options["surface"]=="Klein"){
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
        }
        if(options["surface"]=="real-pp"){
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
    ctx.moveTo(prex,prey)
    ctx.lineTo(x,y)
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
        if(x<prex){ctx.lineTo(x,y)} else {ctx.lineTo(prex,prey)}
        ctx.moveTo(mid2["x"],mid2["y"])
        if(x>prex){ctx.lineTo(x,y)} else {ctx.lineTo(prex,prey)}
    } else {
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(WIDTH,ymid)
        ctx.moveTo(0,ymid)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(xmid,HEIGHT)
        ctx.moveTo(xmid,0)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
    } else {
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(WIDTH,HEIGHT-ymid)
        ctx.moveTo(0,ymid)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(xmid,HEIGHT)
        ctx.moveTo(xmid,0)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
    } else {
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(WIDTH,HEIGHT-ymid)
        ctx.moveTo(0,ymid)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
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
        ctx.moveTo(xa,ya)
        ctx.lineTo(WIDTH-xmid,HEIGHT)
        ctx.moveTo(xmid,0)
        ctx.lineTo(xb,yb)
        ctx.moveTo(x,y)
    } else {
        ctx.moveTo(prex,prey)
        ctx.lineTo(x,y)
    }
}
