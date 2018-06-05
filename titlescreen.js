/********************************/
/*                              */
/*         Mathsteroids         */
/*                              */
/********************************/
/* This code was written        */
/*           by Matthew Scroggs */
/*  mscroggs.co.uk/mathsteroids */
/********************************/


function show_menu(){
    menu_tick()
    clearInterval(interval)
    interval = setInterval(menu_tick,1000/60);
}

function draw_a_sphere(ctx, xcenter){
    N = 100
    for(var circle=0;circle<2;circle++){
        var vangle = 0
        var hangle = 0
        if(circle==1){hangle=3*Math.PI/4}
        for(var i=0;i<=N;i++){
            var x = Math.cos(vangle) * Math.cos(hangle)
            var y = Math.cos(vangle) * Math.sin(hangle)
            var z = Math.sin(vangle)
            var x2 = (x-y) * Math.sin(30)
            var y2 = z + (x+y) * Math.cos(30)
            var x3 = xcenter + x2 * 100
            var y3 = HEIGHT/2 + y2 * 100
            if(i==0 || (i%2==0 && x+y<-0.2)){
                ctx.moveTo(x3,y3)
            } else {
                ctx.lineTo(x3,y3)
            }
            if(circle==0){hangle += Math.PI*2/N}
            else{vangle += Math.PI*2/N}
        }
    }
}

function draw_a_plane(ctx, xcenter){
    ctx.moveTo(xcenter-120, HEIGHT/2-80)
    ctx.lineTo(xcenter+120, HEIGHT/2-80)
    ctx.lineTo(xcenter+120, HEIGHT/2+80)
    ctx.lineTo(xcenter-120, HEIGHT/2+80)
    ctx.lineTo(xcenter-120, HEIGHT/2-80)
}

function draw_two_circles(ctx, xcenter){
    var N = 100
    var angle = 0
    var R = WIDTH/9
    for(var circle=0;circle<2;circle++){
        for(var i=0;i<=N;i++){
            angle = 2*i*Math.PI/N
            var x = xcenter + R*Math.cos(angle)
            if(circle==0){x += R*1.1}
            else{x -= R*1.1}
            var y = HEIGHT/2 + R*Math.sin(angle)
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
        }
    }
}

function draw_surface(ctx){
    if(options["surface"]=="sphere"){
        draw_a_sphere(ctx,WIDTH/4)
    }

    if(options["projection"]=="isometric"){
        draw_a_sphere(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Mercator"){
        draw_a_plane(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Stereographic"){
        draw_two_circles(ctx,3*WIDTH/4)
    }
}

var leftTimer=0
var rightTimer=0
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
    draw_surface(ctx)
    add_scaled_text(ctx,"surface:",20,HEIGHT-45,0.5)
    add_scaled_text(ctx,"<< "+game_title+" >>",150,HEIGHT-45,0.5)
    add_scaled_text(ctx,"press <fire> to begin",WIDTH-295,HEIGHT-20,0.5)
    ctx.stroke();
}

function draw_titles(ctx){
    add_text(ctx, "Mathsteroids", 20, 70)
    add_scaled_text(ctx, "v"+VERSION, 410, 70, 0.6)
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
