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

function draw_a_Craig(ctx, xcenter){
    N = 100
    for(var circle=0;circle<3;circle++){
        var vangle = 0
        var hangle = 0
        if(circle==0){vangle=Math.PI/2}
        if(circle==1){vangle=-Math.PI/2}
        for(var i=0;i<=N;i++){
            if(circle==2){
                vangle = Math.atan(-Math.cos(hangle-Math.PI)/Math.tan(Craig_zeroang))-0.01
            }

            var c_xy = Craig_xy(hangle, vangle)
            var x = xcenter+(c_xy["x"]-WIDTH/2)/2
            var y = HEIGHT/4+c_xy["y"]/2
            if(i==0 || (i%2==0 && circle==0) || y<150 || y>HEIGHT-100){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
            hangle += Math.PI*2/N
        }
    }
}

function draw_a_plane(ctx, xcenter){
    ctx.moveTo(xcenter-120, HEIGHT/2-80)
    ctx.lineTo(xcenter+120, HEIGHT/2-80)
    ctx.lineTo(xcenter+120, HEIGHT/2+80)
    ctx.lineTo(xcenter-120, HEIGHT/2+80)
    ctx.lineTo(xcenter-120, HEIGHT/2-80)
    if(options["projection"]=="flat"){
        var al = 10
        ctx.moveTo(xcenter-al,HEIGHT/2-80-al)
        ctx.lineTo(xcenter+al,HEIGHT/2-80)
        ctx.lineTo(xcenter-al,HEIGHT/2-80+al)

        ctx.moveTo(xcenter-120-al,HEIGHT/2+2*al)
        ctx.lineTo(xcenter-120,HEIGHT/2)
        ctx.lineTo(xcenter-120+al,HEIGHT/2+2*al)
        ctx.moveTo(xcenter-120-al,HEIGHT/2)
        ctx.lineTo(xcenter-120,HEIGHT/2-2*al)
        ctx.lineTo(xcenter-120+al,HEIGHT/2)

        if(options["surface"]=="flatreal-pp") {
            ctx.moveTo(xcenter+al,HEIGHT/2+80-al)
            ctx.lineTo(xcenter-al,HEIGHT/2+80)
            ctx.lineTo(xcenter+al,HEIGHT/2+80+al)
        } else {
            ctx.moveTo(xcenter-al,HEIGHT/2+80-al)
            ctx.lineTo(xcenter+al,HEIGHT/2+80)
            ctx.lineTo(xcenter-al,HEIGHT/2+80+al)
        }
        if(options["surface"]=="flatreal-pp" || options["surface"]=="flatKlein") {
            ctx.moveTo(xcenter+120-al,HEIGHT/2-2*al)
            ctx.lineTo(xcenter+120,HEIGHT/2)
            ctx.lineTo(xcenter+120+al,HEIGHT/2-2*al)
            ctx.moveTo(xcenter+120-al,HEIGHT/2)
            ctx.lineTo(xcenter+120,HEIGHT/2+2*al)
            ctx.lineTo(xcenter+120+al,HEIGHT/2)
        } else {
            ctx.moveTo(xcenter+120-al,HEIGHT/2+2*al)
            ctx.lineTo(xcenter+120,HEIGHT/2)
            ctx.lineTo(xcenter+120+al,HEIGHT/2+2*al)
            ctx.moveTo(xcenter+120-al,HEIGHT/2)
            ctx.lineTo(xcenter+120,HEIGHT/2-2*al)
            ctx.lineTo(xcenter+120+al,HEIGHT/2)
        }
    }
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

function draw_a_circle(ctx, xcenter){
    var N = 100
    var angle = 0
    var R = WIDTH/6
    for(var i=0;i<=N;i++){
        angle = 2*i*Math.PI/N
        var x = xcenter + R*Math.cos(angle)
        var y = HEIGHT/2 + R*Math.sin(angle)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
    }
}

function draw_a_real_pp(ctx, xcenter){
    ctx.translate(xcenter-95,HEIGHT/2-110)

    ctx.moveTo(102.90,113.12);
    ctx.bezierCurveTo(102.90,113.12,114.97,114.99,111.72,119.80);
    ctx.bezierCurveTo(108.23,124.97,102.90,113.12,102.90,113.12);
    ctx.lineTo(101.03,34.54);
    ctx.bezierCurveTo(-4.68,106.09,9.37,197.42,87.40,199.45);
    ctx.bezierCurveTo(189.05,194.99,201.79,-6.06,101.03,34.54);

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.setLineDash([7,7])

    ctx.moveTo(102.90,113.12);
    ctx.bezierCurveTo(87.79,98.21,72.51,83.58,54.43,73.62);

    ctx.moveTo(27.21,125.40);
    ctx.bezierCurveTo(39.71,147.73,104.61,140.03,107.35,120.11);

    ctx.moveTo(35.91,177.56);
    ctx.bezierCurveTo(69.62,195.30,116.98,168.18,110.94,120.86);

    ctx.moveTo(98.27,197.78);
    ctx.bezierCurveTo(131.22,170.18,120.51,144.66,112.40,119.02);

    ctx.moveTo(138.72,176.05);
    ctx.bezierCurveTo(139.59,146.10,122.59,136.12,112.59,118.31);

    ctx.moveTo(159.03,143.99);
    ctx.bezierCurveTo(140.70,136.12,126.06,127.43,112.22,118.56);

    ctx.moveTo(170.66,99.32);
    ctx.bezierCurveTo(158.68,117.42,135.39,118.90,111.53,119.53);

    ctx.moveTo(158.49,46.03);
    ctx.bezierCurveTo(164.18,79.67,109.62,122.04,107.04,113.92);

    ctx.moveTo(134.44,29.20);
    ctx.bezierCurveTo(135.61,45.13,127.94,71.63,107.04,113.92);

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.setLineDash([])

    ctx.translate(-xcenter+95,-HEIGHT/2+110)
}

function draw_a_Klein(ctx, xcenter){
    ctx.translate(xcenter-70,HEIGHT/2-115)
    ctx.moveTo(91.87,4.13);
    ctx.bezierCurveTo(72.40,-2.18,45.62,1.26,28.05,11.46);
    ctx.bezierCurveTo(19.30,16.54,9.38,26.41,6.11,36.10);
    ctx.bezierCurveTo(-1.04,57.33,11.95,85.11,27.24,100.03);
    ctx.bezierCurveTo(21.91,108.64,16.32,117.15,12.25,126.44);
    ctx.bezierCurveTo(1.50,150.86,-4.49,183.26,16.41,204.47);
    ctx.bezierCurveTo(36.16,224.53,72.85,225.12,94.48,207.66);
    ctx.bezierCurveTo(118.57,188.21,127.93,158.40,131.31,129.25);
    ctx.bezierCurveTo(135.64,92.14,138.65,19.27,91.87,4.13);
    ctx.closePath();

    ctx.moveTo(31.40,171.88);
    ctx.bezierCurveTo(27.03,154.18,43.28,131.95,52.52,118.65);
    ctx.bezierCurveTo(52.60,118.55,52.66,118.46,52.72,118.36);
    ctx.lineTo(65.39,99.14);
    ctx.bezierCurveTo(61.66,105.18,57.44,111.58,52.72,118.36);
    ctx.lineTo(47.39,126.44);
    ctx.bezierCurveTo(55.43,136.59,64.48,154.06,65.43,166.90);
    ctx.bezierCurveTo(67.02,188.39,36.85,194.02,31.40,171.88);
    ctx.closePath();

    ctx.moveTo(87.64,13.64);
    ctx.bezierCurveTo(110.53,22.88,60.42,38.37,36.18,38.37);
    ctx.bezierCurveTo(11.95,38.37,24.68,26.39,24.68,26.39);
    ctx.bezierCurveTo(50,8,87.64,13.64,87.64,13.64);

    ctx.moveTo(40.49,73.99);
    ctx.bezierCurveTo(37.34,83.32,32.40,91.73,27.24,100.03);

    ctx.moveTo(65.39,99.14);
    ctx.bezierCurveTo(70.51,87.46,46.77,57.13,40.49,73.99);

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(94.55,23.94);
    ctx.bezierCurveTo(95.03,34.59,90.45,58.72,65.39,99.14);
    ctx.bezierCurveTo(57.07,114.61,35.18,89.77,40.49,73.99);
    ctx.bezierCurveTo(41.90,69.80,40.74,62.06,38.97,56.20);
    ctx.bezierCurveTo(35.98,46.36,31.93,43.70,25.21,37.76);

    ctx.moveTo(28.98,41.05);
    ctx.bezierCurveTo(27.04,39.33,24.83,37.49,22.28,35.09);

    ctx.moveTo(93.35,18.18);
    ctx.bezierCurveTo(94.02,19.32,94.59,21.73,94.58,25.52);

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])

    ctx.translate(-xcenter+70,-HEIGHT/2+115)
}

function draw_a_torus(ctx, xcenter){
    var ratio = 2
    var A = WIDTH/5
    var N = 100
    var x = 0
    var y = 0
    for(var i=0;i<=N;i++){
        x = xcenter + A*Math.cos(Math.PI*2*i/N)
        y = HEIGHT/2 + A/ratio*Math.sin(Math.PI*2*i/N)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
    }

    A = 100
    var B = 120
    var C = 60
    var ycenter = HEIGHT/2+Math.sqrt(A*A-C*C)/ratio
    var ang = Math.acos(C/A)
    N = 30
    for(var i=0;i<=N;i++){
        x = xcenter + A*Math.cos(ang+(Math.PI-2*ang)*i/N)
        y = ycenter - A/ratio*Math.sin(ang+(Math.PI-2*ang)*i/N)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
    }
    ycenter = HEIGHT/2-Math.sqrt(B*B-C*C)/ratio
    ang = Math.acos(C/B)*0.8
    N = 30
    for(var i=0;i<=N;i++){
        x = xcenter + B*Math.cos(ang+(Math.PI-2*ang)*i/N)
        y = ycenter + B/ratio*Math.sin(ang+(Math.PI-2*ang)*i/N)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
    }
}

function draw_surface(ctx){
    if(options["surface"]=="sphere"){
        draw_a_sphere(ctx,WIDTH/4)
    }
    if(options["surface"]=="flattorus"){
        draw_a_torus(ctx,WIDTH/4)
    }
    if(options["surface"]=="flatKlein"){
        draw_a_Klein(ctx,WIDTH/4)
    }
    if(options["surface"]=="flatreal-pp"){
        draw_a_real_pp(ctx,WIDTH/4)
    }
    if(options["surface"]=="torus"){
        draw_a_torus(ctx,WIDTH/4)
    }

    if(options["projection"]=="isometric"){
        if(options["surface"]=="sphere"){
            draw_a_sphere(ctx,3*WIDTH/4)
        }
        if(options["surface"]=="torus"){
            draw_a_torus(ctx,3*WIDTH/4)
        }
    }
    if(options["projection"]=="azim"){
        draw_a_circle(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Craig"){
        draw_a_Craig(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Mercator" || options["projection"] == "Gall" || options["projection"]=="flat"){
        draw_a_plane(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="stereographic"){
        draw_two_circles(ctx,3*WIDTH/4)
    }
}

if(game_n_start!=""){
    for(var i=0;i<games.length;i++){
        if(games[i][1]+games[i][2]==game_n_start){
            game_n = i
            break
        }
    }
}

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
