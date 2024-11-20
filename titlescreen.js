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

var info_shown = false

function show_menu(){
    titlescreen = true
    menu_tick()
    clearInterval(interval)
    interval = setInterval(menu_tick,1000/60);
    redraw_menu()
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
            var x2 = (x-y) * Math.cos(Math.PI/6)
            var y2 = z + (x+y) * Math.sin(Math.PI/6)
            var x3 = xcenter + x2 * 100
            var y3 = HEIGHT/2 + y2 * 100
            if(i==0 || (i%2==0 && x+y-z<-0.2)){
                ctx.moveTo(x3,y3)
            } else {
                ctx.lineTo(x3,y3)
            }
            hangle += Math.PI*2/N
            if(circle==1){
                vangle = Math.atan(Math.cos(hangle)+Math.sin(hangle))
            }
        }
    }
}

function draw_loop(ctx, xcenter){
    N = 100
    var angle = 0
    var r = 0
    for(var i=0;i<=N;i++){
        var x = xcenter+285*Math.cos(angle)
        var y = HEIGHT/2+150*Math.sin(angle)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
        angle += Math.PI*2/N
    }
}

function draw_a_Craig(ctx, xcenter){
    N = 100
    for(var circle=0;circle<3;circle++){
        var vangle = 0
        var hangle = 0
        if(circle==0){vangle=Math.PI/2}
        if(circle==1){vangle=-Math.PI/2}
        var move = true
        for(var i=0;i<=N;i++){
            if(circle==2){
                vangle = Math.atan(-Math.cos(hangle-Math.PI)/Math.tan(Craig_zeroang))-0.01
            }

            var c_xy = Craig_xy(hangle, vangle)
            var x = xcenter+(c_xy["x"]-WIDTH/2)/2
            var y = HEIGHT/4+c_xy["y"]/2
            if (y < 150 || y > HEIGHT - 100){
                move = true;
            } else if(move || (i%2==0 && circle==0)){
                move = false
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
            hangle += Math.PI*2/N
        }
    }
}

function draw_a_Robinson(ctx, xcenter){
    N = 100
    for(var circle=0;circle<2;circle++){
        var hangle = 0
        var vangle = - Math.PI / 2
        if(circle==1){hangle=2 * Math.PI}
        for(var i=0;i<=N;i++){

            var c_xy = Robinson_xy(hangle, vangle)
            var x = xcenter+(c_xy["x"]-WIDTH/2)/2
            var y = HEIGHT/4+c_xy["y"]/2
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
            vangle += Math.PI/N
        }
    }
    var p_xy = Robinson_xy(0, -Math.PI / 2)
    var px = xcenter+(p_xy["x"]-WIDTH/2)/2
    var py = HEIGHT/4+p_xy["y"]/2
    ctx.moveTo(px, py)
    p_xy = Robinson_xy(2 * Math.PI, -Math.PI / 2)
    px = xcenter+(p_xy["x"]-WIDTH/2)/2
    py = HEIGHT/4+p_xy["y"]/2
    ctx.lineTo(px, py)
    p_xy = Robinson_xy(0, Math.PI / 2)
    px = xcenter+(p_xy["x"]-WIDTH/2)/2
    py = HEIGHT/4+p_xy["y"]/2
    ctx.moveTo(px, py)
    p_xy = Robinson_xy(2 * Math.PI, Math.PI / 2)
    px = xcenter+(p_xy["x"]-WIDTH/2)/2
    py = HEIGHT/4+p_xy["y"]/2
    ctx.lineTo(px, py)
}

function draw_a_sinusoidal(ctx, xcenter){
    N = 100
    for(var circle=0;circle<2;circle++){
        var hangle = 0
        var vangle = - Math.PI / 2
        if(circle==1){hangle=2 * Math.PI}
        for(var i=0;i<=N;i++){

            var c_xy = sinusoidal_xy(hangle, vangle)
            var x = xcenter+(c_xy["x"]-WIDTH/2)/2
            var y = HEIGHT/4+c_xy["y"]/2
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
            vangle += Math.PI/N
        }
    }
}

function draw_a_Mollweide(ctx, xcenter){
    N = 100
    for(var circle=0;circle<2;circle++){
        var hangle = 0
        var vangle = - Math.PI / 2
        if(circle==1){hangle=2 * Math.PI}
        for(var i=0;i<=N;i++){

            var c_xy = Mollweide_xy(hangle, vangle)
            var x = xcenter+(c_xy["x"]-WIDTH/2)/2
            var y = HEIGHT/4+c_xy["y"]/2
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
            vangle += Math.PI/N
        }
    }
}

function draw_a_Goode(ctx, xcenter){
    var N = 100
    var eps = 0.0001
    var points = [
        [0,Math.PI/2],
        [4*Math.PI/9-eps,Math.PI/2],
        [4*Math.PI/9-eps,0],
        [4*Math.PI/9+eps,0],
        [4*Math.PI/9+eps,Math.PI/2],
        [8*Math.PI/9-eps,Math.PI/2],
        [8*Math.PI/9-eps,0],
        [8*Math.PI/9+eps,0],
        [8*Math.PI/9+eps,Math.PI/2],
        [14*Math.PI/9-eps,Math.PI/2],
        [14*Math.PI/9-eps,0],
        [14*Math.PI/9+eps,0],
        [14*Math.PI/9+eps,Math.PI/2],
        [2*Math.PI,Math.PI/2],
        [2*Math.PI,-Math.PI/2],
        [7*Math.PI/9+eps,-Math.PI/2],
        [7*Math.PI/9+eps,0],
        [7*Math.PI/9-eps,0],
        [7*Math.PI/9-eps,-Math.PI/2],
        [0, -Math.PI/2]
        //[4*Math.PI/4+eps,0], [4*Math.PI/4+eps,Math.PI/2],
    ]
    var prev = points[points.length - 1]

    var hangle = prev[0]
    var vangle = prev[1]
    for (var p = 0; p < points.length; p++){
        var pt = points[p]
        for(var i=0;i<=N;i++){
            var c_xy = Goode_xy(hangle, vangle)
            var x = xcenter+(c_xy["x"]-WIDTH/2)/2
            var y = HEIGHT/4+c_xy["y"]/2
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
            hangle += (pt[0] - prev[0])/N
            vangle += (pt[1] - prev[1])/N
        }
        hangle = pt[0]
        vangle = pt[1]
        prev = pt
    }
}

function draw_a_cube(ctx, xcenter){
    var size = WIDTH/10
    ctx.moveTo(xcenter-2*size,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter-size,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter-size,HEIGHT/2-1.5*size)
    ctx.lineTo(xcenter,HEIGHT/2-1.5*size)
    ctx.lineTo(xcenter,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter+2*size,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter+2*size,HEIGHT/2+0.5*size)
    ctx.lineTo(xcenter,HEIGHT/2+0.5*size)
    ctx.lineTo(xcenter,HEIGHT/2+1.5*size)
    ctx.lineTo(xcenter-size,HEIGHT/2+1.5*size)
    ctx.lineTo(xcenter-size,HEIGHT/2+0.5*size)
    ctx.lineTo(xcenter-2*size,HEIGHT/2+0.5*size)
    ctx.lineTo(xcenter-2*size,HEIGHT/2-0.5*size)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter-size,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter-size,HEIGHT/2+0.5*size)
    ctx.lineTo(xcenter,HEIGHT/2+0.5*size)
    ctx.lineTo(xcenter,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter-size,HEIGHT/2-0.5*size)

    ctx.moveTo(xcenter+size,HEIGHT/2-0.5*size)
    ctx.lineTo(xcenter+size,HEIGHT/2+0.5*size)

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
}

function draw_a_tetrahedron(ctx, xcenter){
    var size = WIDTH/6
    ctx.moveTo(xcenter-size,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter+size,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter,HEIGHT/2-size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter-size,HEIGHT/2+size*Math.sqrt(3)/2)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter+size/2,HEIGHT/2)
    ctx.lineTo(xcenter-size/2,HEIGHT/2)
    ctx.lineTo(xcenter,HEIGHT/2+size*Math.sqrt(3)/2)

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
}

function draw_a_octahedron(ctx, xcenter){
    var size = WIDTH/9
    ctx.moveTo(xcenter-size/2,HEIGHT/2)
    ctx.lineTo(xcenter,HEIGHT/2-size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter+2*size,HEIGHT/2-size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter+1.5*size,HEIGHT/2)
    ctx.lineTo(xcenter+0.5*size,HEIGHT/2)
    ctx.lineTo(xcenter,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter-2*size,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter-1.5*size,HEIGHT/2)
    ctx.lineTo(xcenter-0.5*size,HEIGHT/2)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter-1.5*size,HEIGHT/2)
    ctx.lineTo(xcenter-1*size,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter-0.5*size,HEIGHT/2)
    ctx.lineTo(xcenter,HEIGHT/2+size*Math.sqrt(3)/2)
    ctx.moveTo(xcenter-0.5*size,HEIGHT/2)
    ctx.lineTo(xcenter+0.5*size,HEIGHT/2)
    ctx.moveTo(xcenter,HEIGHT/2-size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter+0.5*size,HEIGHT/2)
    ctx.lineTo(xcenter+size,HEIGHT/2-size*Math.sqrt(3)/2)
    ctx.lineTo(xcenter+1.5*size,HEIGHT/2)

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
}

function draw_a_dodecahedron(ctx, xcenter){
    var size = WIDTH/13
    ctx.moveTo(xcenter+size*-1.6478165385088959,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*-2.225166807698521,HEIGHT/2+size*0.7230005232249495)
    ctx.lineTo(xcenter+size*-2.802517076888147,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*-2.581988897471611,HEIGHT/2+size*-0.37518494817015985)
    ctx.lineTo(xcenter+size*-1.8683447179254318,HEIGHT/2+size*-0.37518494817015996)
    ctx.lineTo(xcenter+size*-2.4456949871150577,HEIGHT/2+size*-0.7946544722917663)
    ctx.lineTo(xcenter+size*-2.225166807698522,HEIGHT/2+size*-1.4733704195652693)
    ctx.lineTo(xcenter+size*-1.511522628152342,HEIGHT/2+size*-1.4733704195652693)
    ctx.lineTo(xcenter+size*-1.2909944487358058,HEIGHT/2+size*-0.7946544722917662)
    ctx.lineTo(xcenter+size*-1.0704662693192697,HEIGHT/2+size*-1.4733704195652693)
    ctx.lineTo(xcenter+size*-0.3568220897730898,HEIGHT/2+size*-1.4733704195652693)
    ctx.lineTo(xcenter+size*-0.13629391035655392,HEIGHT/2+size*-0.7946544722917663)
    ctx.lineTo(xcenter+size*-0.7136441795461801,HEIGHT/2+size*-0.3751849481701598)
    ctx.lineTo(xcenter+size*2.220446049250313e-16,HEIGHT/2+size*-0.37518494817015985)
    ctx.lineTo(xcenter+size*0.577350269189626,HEIGHT/2+size*-0.7946544722917662)
    ctx.lineTo(xcenter+size*1.1547005383792515,HEIGHT/2+size*-0.37518494817016)
    ctx.lineTo(xcenter+size*0.9341723589627158,HEIGHT/2+size*-1.053900895443663)
    ctx.lineTo(xcenter+size*1.5115226281523417,HEIGHT/2+size*-1.4733704195652693)
    ctx.lineTo(xcenter+size*2.0888728973419672,HEIGHT/2+size*-1.053900895443663)
    ctx.lineTo(xcenter+size*1.8683447179254318,HEIGHT/2+size*-0.3751849481701597)
    ctx.lineTo(xcenter+size*2.4456949871150577,HEIGHT/2+size*-0.7946544722917662)
    ctx.lineTo(xcenter+size*3.0230452563046835,HEIGHT/2+size*-0.37518494817015985)
    ctx.lineTo(xcenter+size*2.8025170768881478,HEIGHT/2+size*0.3035309991033432)
    ctx.lineTo(xcenter+size*2.088872897341968,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*2.666223166531594,HEIGHT/2+size*0.7230005232249495)
    ctx.lineTo(xcenter+size*2.445694987115058,HEIGHT/2+size*1.4017164704984524)
    ctx.lineTo(xcenter+size*1.732050807568878,HEIGHT/2+size*1.4017164704984524)
    ctx.lineTo(xcenter+size*1.5115226281523424,HEIGHT/2+size*0.7230005232249495)
    ctx.lineTo(xcenter+size*1.290994448735806,HEIGHT/2+size*1.4017164704984524)
    ctx.lineTo(xcenter+size*0.577350269189626,HEIGHT/2+size*1.4017164704984526)
    ctx.lineTo(xcenter+size*0.35682208977309027,HEIGHT/2+size*0.7230005232249495)
    ctx.lineTo(xcenter+size*0.934172358962716,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*0.22052817941653602,HEIGHT/2+size*0.3035309991033432)
    ctx.lineTo(xcenter+size*-0.35682208977308993,HEIGHT/2+size*0.7230005232249495)
    ctx.lineTo(xcenter+size*-0.934172358962716,HEIGHT/2+size*0.3035309991033432)
    ctx.lineTo(xcenter+size*-0.7136441795461801,HEIGHT/2+size*0.9822469463768462)
    ctx.lineTo(xcenter+size*-1.2909944487358058,HEIGHT/2+size*1.4017164704984526)
    ctx.lineTo(xcenter+size*-1.8683447179254318,HEIGHT/2+size*0.9822469463768462)
    ctx.lineTo(xcenter+size*-1.6478165385088959,HEIGHT/2+size*0.30353099910334314)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter+size*-1.2909944487358058,HEIGHT/2+size*-0.7946544722917662)
    ctx.lineTo(xcenter+size*-1.8683447179254318,HEIGHT/2+size*-0.37518494817015996)
    ctx.lineTo(xcenter+size*-1.6478165385088959,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.934172358962716,HEIGHT/2+size*0.3035309991033432)
    ctx.lineTo(xcenter+size*-0.7136441795461801,HEIGHT/2+size*-0.3751849481701598)
    ctx.lineTo(xcenter+size*-1.2909944487358058,HEIGHT/2+size*-0.7946544722917662)
    ctx.moveTo(xcenter+size*2.220446049250313e-16,HEIGHT/2+size*-0.37518494817015985)
    ctx.lineTo(xcenter+size*0.22052817941653602,HEIGHT/2+size*0.3035309991033432)
    ctx.moveTo(xcenter+size*1.1547005383792515,HEIGHT/2+size*-0.37518494817016)
    ctx.lineTo(xcenter+size*0.934172358962716,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*1.5115226281523424,HEIGHT/2+size*0.7230005232249495)
    ctx.lineTo(xcenter+size*2.088872897341968,HEIGHT/2+size*0.30353099910334314)
    ctx.lineTo(xcenter+size*1.8683447179254318,HEIGHT/2+size*-0.3751849481701597)
    ctx.lineTo(xcenter+size*1.1547005383792515,HEIGHT/2+size*-0.37518494817016)

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
}

function draw_a_icosahedron(ctx, xcenter){
    var size = WIDTH/13
    ctx.moveTo(xcenter+size*-2.8915211166552344,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-2.365790004536101,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*-1.8400588924169674,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*1.5176549955167158)
    ctx.lineTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.2628655560595667,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.7885966681787003,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*1.5176549955167158)
    ctx.lineTo(xcenter+size*2.3657900045361013,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*2.891521116655235,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*2.3657900045361013,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*0.7885966681787004,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-0.2628655560595668,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.7885966681787004,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-1.8400588924169679,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-2.365790004536101,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-2.8915211166552344,HEIGHT/2+size*0.6070619982066863)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter+size*-2.8915211166552344,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-1.8400588924169674,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-2.365790004536101,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-1.8400588924169674,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.2628655560595668,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.2628655560595668,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*0.7885966681787004,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.7885966681787004,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*2.3657900045361013,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*2.891521116655235,HEIGHT/2+size*-0.30353099910334314)

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
}

function draw_a_dymaxion(ctx, xcenter){
    var size = WIDTH/13
    ctx.moveTo(xcenter+size*-2.8915211166552344,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-2.102924448476534,HEIGHT/2+size*1.062358496861701)
    ctx.lineTo(xcenter+size*-2.3657900045361013,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*-1.314327780297834,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*0.9105929973100294)
    ctx.lineTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.7885966681787004,HEIGHT/2+size*1.2141239964133725)
    ctx.lineTo(xcenter+size*-0.2628655560595667,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.7885966681787003,HEIGHT/2+size*1.5176549955167158)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*2.3657900045361013,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*2.891521116655235,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*2.891521116655235,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*2.3657900045361013,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*0.7885966681787004,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.2628655560595668,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*0.2628655560595669,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-0.7885966681787004,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-1.8400588924169679,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-2.3657900045361013,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-1.8400588924169679,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-2.8915211166552344,HEIGHT/2+size*0.6070619982066863)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter+size*-1.314327780297834,HEIGHT/2+size*1.5176549955167156)
    ctx.lineTo(xcenter+size*-1.8400588924169679,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-2.102924448476534,HEIGHT/2+size*1.062358496861701)
    ctx.moveTo(xcenter+size*-1.8400588924169679,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-1.8400588924169679,HEIGHT/2+size*0.6070619982066863)
    ctx.moveTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-0.7885966681787004,HEIGHT/2+size*-1.2141239964133725)
    ctx.lineTo(xcenter+size*-0.2628655560595668,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*-1.3143277802978341,HEIGHT/2+size*-0.30353099910334314)
    ctx.moveTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.2628655560595668,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.7885966681787006,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*-0.2628655560595667,HEIGHT/2+size*1.5176549955167156)
    ctx.moveTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.7885966681787004,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*2.891521116655235,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*2.3657900045361013,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*1.8400588924169676,HEIGHT/2+size*-0.30353099910334314)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.7885966681787004,HEIGHT/2+size*-0.30353099910334314)
    ctx.moveTo(xcenter+size*0.2628655560595668,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*1.314327780297834,HEIGHT/2+size*0.6070619982066863)
    ctx.lineTo(xcenter+size*0.7885966681787003,HEIGHT/2+size*1.5176549955167158)

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
}

function draw_a_plane(ctx, xcenter){
    ctx.moveTo(xcenter-120, HEIGHT/2-80)
    ctx.lineTo(xcenter+120, HEIGHT/2-80)
    ctx.lineTo(xcenter+120, HEIGHT/2+80)
    ctx.lineTo(xcenter-120, HEIGHT/2+80)
    ctx.lineTo(xcenter-120, HEIGHT/2-80)
    if(options["projection"]=="flat"){
        var al = 10
        if(options["surface"]!="flatmobius" && options["surface"]!="flatcylinder") {
            ctx.moveTo(xcenter-al,HEIGHT/2-80-al)
            ctx.lineTo(xcenter+al,HEIGHT/2-80)
            ctx.lineTo(xcenter-al,HEIGHT/2-80+al)
        }
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
        } else if(options["surface"]!="flatmobius" && options["surface"]!="flatcylinder") {
            ctx.moveTo(xcenter-al,HEIGHT/2+80-al)
            ctx.lineTo(xcenter+al,HEIGHT/2+80)
            ctx.lineTo(xcenter-al,HEIGHT/2+80+al)
        }
        if(options["surface"]=="flatreal-pp" || options["surface"]=="flatKlein" || options["surface"]=="flatmobius") {
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

function draw_a_bk(ctx, xcenter, bounded){
    var N = 100
    var angle = 0
    var R = WIDTH/6
    var R2 = WIDTH/6.2

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    ctx.moveTo(xcenter + R,HEIGHT/2);
    for(var i=0;i<=6;i++){
        angle = i*Math.PI/3
        ctx.lineTo(xcenter + R*Math.cos(angle), HEIGHT/2 + R*Math.sin(angle))
    }

    if(!bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])
    }

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

    if(bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])

        for(var i=0;i<=N;i++){
            angle = 2*i*Math.PI/N
            var x = xcenter + R2*Math.cos(angle)
            var y = HEIGHT/2 + R2*Math.sin(angle)
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
        }
    }
}

function draw_a_poincare(ctx, xcenter, bounded){
    var N = 100
    var NN = 15
    var angle = 0
    var R = WIDTH/6
    var R3 = WIDTH/8

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    var cangle = 0
    var R2 = R / Math.sqrt(3)
    var a = Math.PI / 3
    var d = 2/Math.sqrt(3) * R
    ctx.moveTo(xcenter + R,HEIGHT/2);
    for(var i=0;i<6;i++){
        cangle = Math.PI/6 + i*Math.PI/3
        for (var j = 1; j <= N; j++){
            angle = Math.PI + cangle + a - 2*a*j/N
            ctx.lineTo(xcenter + d * Math.cos(cangle) + R2*Math.cos(angle), HEIGHT/2 + d * Math.sin(cangle) + R2*Math.sin(angle))
        }
    }

    if(!bounded) {
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])
    }
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

    if(bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])

        for(var i=0;i<=N;i++){
            angle = 2*i*Math.PI/N
            var x = xcenter + R3*Math.cos(angle)
            var y = HEIGHT/2 + R3*Math.sin(angle)
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
        }
    }
}

function _poincare_hp_f(x, y){
    return [2*x / (x*x + (1 + y)*(1 + y)),(x*x + y * y - 1) / (x*x + (1 + y)*(1 + y))]
}

function draw_a_poincare_hp(ctx, xcenter, bounded){
    var N = 500
    var NN = 15
    var angle = 0
    var R = WIDTH/6


    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    var cangle = 0
    var R2 = 1 / Math.sqrt(3)
    var a = Math.PI / 3
    var d = 2/Math.sqrt(3)
    var pt = _poincare_hp_f(1, 0)
    ctx.moveTo(xcenter + 30*pt[0], HEIGHT*0.75 + 30*pt[1])
    for(var i=0;i<6;i++){
        cangle = Math.PI/6 + i*Math.PI/3
        for (var j = 1; j <= N; j++){
            angle = Math.PI + cangle + a - 2*a*j/N
            pt = _poincare_hp_f(d * Math.cos(cangle) + R2*Math.cos(angle), d * Math.sin(cangle) + R2*Math.sin(angle))
            ctx.lineTo(xcenter + 30*pt[0], HEIGHT*0.75 + 30*pt[1])
        }
    }

    if(!bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])
    }

    var a = Math.PI/2.5
    for(var i=0;i<=N;i++){
        angle = -a + (Math.PI + 2*a)*i/N
        var x = Math.cos(angle)
        var y = Math.sin(angle)
        pt = _poincare_hp_f(x, y)
        if(i==0){
            ctx.moveTo(xcenter + 30*pt[0], HEIGHT*0.75 + 30*pt[1])
        } else {
            ctx.lineTo(xcenter + 30*pt[0], HEIGHT*0.75 + 30*pt[1])
        }
    }

    if(bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])

        var R3 = 3/4
        for(var i=0;i<=N;i++){
            angle = 2*i*Math.PI/N
            var x = R3*Math.cos(angle)
            var y = R3*Math.sin(angle)
            pt = _poincare_hp_f(x, y)
            if(i==0){
                ctx.moveTo(xcenter + 30*pt[0], HEIGHT*0.75 + 30*pt[1])
            } else {
                ctx.lineTo(xcenter + 30*pt[0], HEIGHT*0.75 + 30*pt[1])
            }
        }
    }
}

function draw_a_gans(ctx, xcenter, bounded){
    var N = 100
    var NN = 15
    var angle = 0
    var R = WIDTH/20
    var R3 = WIDTH/8

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    var prev = 0
    var preh = 0
    var x = 0
    var y = 0
    var d = 1
    var buffer = 0.08
    ctx.moveTo(xcenter + R,HEIGHT/2);
    for(var i=0;i<6;i++){
        var start = [Math.cos(i*Math.PI/3),Math.sin(i*Math.PI/3)]
        var end = [Math.cos((i+1)*Math.PI/3),Math.sin((i+1)*Math.PI/3)]
        for (var j=0;j<=N; j++){
            x = start[0] + (end[0] - start[0]) * (buffer + (1 - 2*buffer) * j/N)
            y = start[1] + (end[1] - start[1]) * (buffer + (1 - 2*buffer) * j/N)
            d = Math.sqrt(1 - x*x - y*y)
            if(j==0){
                ctx.moveTo(xcenter + R*x/d, HEIGHT/2 + R*y/d)
            } else {
                ctx.lineTo(xcenter + R*x/d, HEIGHT/2 + R*y/d)
            }
            prev=x
            preh=y
        }
    }

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])

    if(bounded){
        for(var i=0;i<=N;i++){
            angle = 2*i*Math.PI/N
            var x = xcenter + R3*Math.cos(angle)
            var y = HEIGHT/2 + R3*Math.sin(angle)
            if(i==0){
                ctx.moveTo(x,y)
            } else {
                ctx.lineTo(x,y)
            }
        }
    }
}

function _band_f(x, y){
    var ss = x*x + y*y
    var rt = Math.sqrt(1 - ss)
    p =  [x / (1 + rt), y / (1 + rt)]
    var d = ((1-p[0])*(1-p[0])+p[1]*p[1])
    var real = ((1 + p[0])*(1 - p[0]) - p[1]*p[1]) / d
    var imag = 2*p[1] / d
    var r = Math.sqrt(real*real + imag*imag)
    var theta = Math.atan2(imag, real)
    return [Math.log(r), theta]
}

function draw_a_band(ctx, xcenter, bounded){
    var N = 500
    var NN = 15
    var angle = 0
    var R = WIDTH/6

    var scale = 70

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    var cangle = 0
    var R2 = 1 / Math.sqrt(3)
    var a = Math.PI / 3
    var d = 2/Math.sqrt(3)
    var pt = _band_f(1, 0)
    ctx.moveTo(xcenter + scale*pt[0], HEIGHT/2 + scale*pt[1])
    for(var i=0;i<6;i++){
        cangle = i*Math.PI/3
        for (var j = 1; j <= N; j++){
            angle = Math.PI + cangle + a - 2*a*j/N
            pt = _band_f(d * Math.cos(cangle) + R2*Math.cos(angle), d * Math.sin(cangle) + R2*Math.sin(angle))
            ctx.lineTo(xcenter + scale*pt[0], HEIGHT/2 + scale*pt[1])
        }
    }

    if(!bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])
    }
    ctx.moveTo(xcenter + scale*3, HEIGHT/2 + scale*1.55)
    ctx.lineTo(xcenter + scale*-3, HEIGHT/2 + scale*1.55)
    ctx.moveTo(xcenter + scale*3, HEIGHT/2 - scale*1.55)
    ctx.lineTo(xcenter + scale*-3, HEIGHT/2 - scale*1.55)

    if(bounded){
        // end dash this
        ctx.stroke()
        ctx.beginPath()
        ctx.setLineDash([])

        var R3 = 0.992
        for(var i=0;i<=N;i++){
            angle = 2*i*Math.PI/N
            var x = R3*Math.cos(angle)
            var y = R3*Math.sin(angle)
            pt = _band_f(x, y)
            if(i==0){
                ctx.moveTo(xcenter + 30*pt[0], HEIGHT/2 + 30*pt[1])
            } else {
                ctx.lineTo(xcenter + 30*pt[0], HEIGHT/2 + 30*pt[1])
            }
        }
    }
}

function _hyperboloid_f(x, y){
    var d = Math.sqrt(1 - x*x - y*y)
    var xx = x/d
    var yy = y/d
    var zz = 1/d

    return [(xx-yy) * Math.sin(30), zz + (xx+yy) * Math.cos(30)]
}

function draw_a_hyperboloid(ctx, xcenter, bounded){
    var R = 30
    var N = 100
    var prev = 0
    var preh = 0
    var a = Math.PI / 2 + 0.15
    var p1 = hyper_add(0, 0, Math.PI/4 + a, HYPER_RADIUS)
    var p2 = hyper_add(0, 0, Math.PI/4 - a, HYPER_RADIUS)

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([7,7])

    var angle = 0
    for(var i=0;i<=N;i++){
        angle = Math.PI/4 + a + 2*(Math.PI-a) * i/N
        p = _hyperboloid_f(0.964*Math.cos(angle),0.964*Math.sin(angle))
        if(i==0){
            ctx.moveTo(xcenter+R*p[0],HEIGHT/3+R*p[1])
        } else {
            ctx.lineTo(xcenter+R*p[0],HEIGHT/3+R*p[1])
        }
    }

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])

    var angle = 0
    for(var i=0;i<=N;i++){
        angle = Math.PI/4 - a + 2*a * i/N
        p = _hyperboloid_f(0.964*Math.cos(angle),0.964*Math.sin(angle))
        if(i==0){
            ctx.moveTo(xcenter+R*p[0],HEIGHT/3+R*p[1])
        } else {
            ctx.lineTo(xcenter+R*p[0],HEIGHT/3+R*p[1])
        }
    }

    for(var i=0;i<=N;i++){
        p = _hyperboloid_f(p1[0] + (p2[0]-p1[0])*i/N,p1[1] + (p2[1]-p1[1])*i/N)
        if(i==0){
            ctx.moveTo(xcenter+R*p[0],HEIGHT/3+R*p[1])
        } else {
            ctx.lineTo(xcenter+R*p[0],HEIGHT/3+R*p[1])
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

function draw_a_mobius(ctx, xcenter){
    var dang = 5
    ctx.moveTo(xcenter,HEIGHT/2+100);
    for(var ang=0;ang<180;ang+=dang){
        ctx.lineTo(xcenter+100*Math.sin(ang*Math.PI/180),HEIGHT/2+100*Math.cos(ang*Math.PI/180));
    }
    for(var ang=180;ang<360;ang+=dang){
        ctx.lineTo(xcenter+80*Math.sin(ang*Math.PI/180),HEIGHT/2-20+80*Math.cos(ang*Math.PI/180));
    }
    for(var ang=0;ang<180;ang+=dang){
        ctx.lineTo(xcenter+60*Math.sin(ang*Math.PI/180),HEIGHT/2+60*Math.cos(ang*Math.PI/180));
    }
    for(var ang=180;ang<360;ang+=dang){
        ctx.lineTo(xcenter+80*Math.sin(ang*Math.PI/180),HEIGHT/2+20+80*Math.cos(ang*Math.PI/180));
    }
    ctx.closePath();

    // dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.setLineDash([7,7])

    dang = 10

    for(var ang=0;ang<180;ang+=dang){
        ctx.moveTo(xcenter+100*Math.sin(ang*Math.PI/180),HEIGHT/2+100*Math.cos(ang*Math.PI/180));
        ctx.lineTo(xcenter+60*Math.sin(ang*Math.PI/180),HEIGHT/2+60*Math.cos(ang*Math.PI/180));
    }
    for(var ang=180;ang<360;ang+=dang){
        ctx.moveTo(xcenter+80*Math.sin(ang*Math.PI/180),HEIGHT/2-20+80*Math.cos(ang*Math.PI/180));
        ctx.lineTo(xcenter+80*Math.sin(ang*Math.PI/180),HEIGHT/2+20+80*Math.cos(ang*Math.PI/180));
    }

    // end dash this
    ctx.stroke()
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.setLineDash([])

    ctx.stroke()
}

function draw_a_cylinder(ctx, xcenter){
    var dang = 5
    ctx.moveTo(xcenter,HEIGHT/2-60);
    for(var ang=0;ang<360;ang+=dang){
        ctx.lineTo(xcenter+100*Math.sin(ang*Math.PI/180),HEIGHT/2-80+20*Math.cos(ang*Math.PI/180));
    }
    ctx.closePath();
    ctx.moveTo(xcenter+100,HEIGHT/2-80)
    ctx.lineTo(xcenter+100,HEIGHT/2+80)

    for(var ang=90;ang>-90;ang-=dang){
        ctx.lineTo(xcenter+100*Math.sin(ang*Math.PI/180),HEIGHT/2+80+20*Math.cos(ang*Math.PI/180));
    }
    ctx.lineTo(xcenter-100,HEIGHT/2-80)

    ctx.stroke()
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

function draw_a_top_torus(ctx, xcenter){
    var ratio = 2
    var A = WIDTH/7
    var N = 100
    var x = 0
    var y = 0
    for(var i=0;i<=N;i++){
        x = xcenter + A*Math.cos(Math.PI*2*i/N)
        y = HEIGHT/2 + A*Math.sin(Math.PI*2*i/N)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
    }

    var ratio = 2
    var A = WIDTH/18
    var N = 100
    var x = 0
    var y = 0
    for(var i=0;i<=N;i++){
        x = xcenter + A*Math.cos(Math.PI*2*i/N)
        y = HEIGHT/2 + A*Math.sin(Math.PI*2*i/N)
        if(i==0){
            ctx.moveTo(x,y)
        } else {
            ctx.lineTo(x,y)
        }
    }
}

function draw_surface(ctx){
    if(options["projection"]=="loop"){
        draw_loop(ctx,WIDTH/2)
    }

    if(options["surface"]=="sphere"){
        draw_a_sphere(ctx,WIDTH/4)
    }
    if(options["surface"]=="hyperbolic"){
        draw_a_poincare(ctx,WIDTH/4, true)
    }
    if(options["surface"]=="hyperbolicunbounded"){
        draw_a_poincare(ctx,WIDTH/4, false)
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
    if(options["surface"]=="flatmobius"){
        draw_a_mobius(ctx,WIDTH/4)
    }
    if(options["surface"]=="flatcylinder"){
        draw_a_cylinder(ctx,WIDTH/4)
    }

    if(options["projection"]=="isometric"){
        if(options["surface"]=="sphere"){
            draw_a_sphere(ctx,3*WIDTH/4)
        }
    }
    if(options["projection"]=="top_v"){
        draw_a_top_torus(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="azim"){
        draw_a_circle(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="van der Grinten"){
        draw_a_circle(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Craig"){
        draw_a_Craig(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Robinson"){
        draw_a_Robinson(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="sinusoidal"){
        draw_a_sinusoidal(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Mollweide"){
        draw_a_Mollweide(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Goode"){
        draw_a_Goode(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="cube"){
        draw_a_cube(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="tetrahedron"){
        draw_a_tetrahedron(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="octahedron"){
        draw_a_octahedron(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="dodecahedron"){
        draw_a_dodecahedron(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="icosahedron"){
        draw_a_icosahedron(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="dymaxion"){
        draw_a_dymaxion(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Mercator" || options["projection"] == "Gall" || options["projection"]=="flat" || options["projection"] == "projected" ||
       options["projection"]=="plate caree"){
        if(games[game_n][0] == "credits"){
            add_scaled_text(ctx, "mathsteroids v"+VERSION, 3*WIDTH/4-90, HEIGHT/2-25, 0.25)
            add_scaled_text(ctx, "created by matthew scroggs", 3*WIDTH/4-90, HEIGHT/2, 0.25)
            add_scaled_text(ctx, "mscroggs.co.uk/mathsteroids", 3*WIDTH/4-90, HEIGHT/2+25, 0.25)
        }
        draw_a_plane(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="stereographic"){
        draw_two_circles(ctx,3*WIDTH/4)
    }
    if(options["projection"]=="Beltrami-Klein"){
        draw_a_bk(ctx,3*WIDTH/4, options["surface"]=="hyperbolic")
    }
    if(options["projection"]=="Poincare"){
        draw_a_poincare(ctx,3*WIDTH/4, options["surface"]=="hyperbolic")
    }
    if(options["projection"]=="Poincare HP"){
        draw_a_poincare_hp(ctx,3*WIDTH/4, options["surface"]=="hyperbolic")
    }
    if(options["projection"]=="hyperboloid"){
        draw_a_hyperboloid(ctx,3*WIDTH/4, options["surface"]=="hyperbolic")
    }
    if(options["projection"]=="gans"){
        draw_a_gans(ctx,3*WIDTH/4, options["surface"]=="hyperbolic")
    }
    if(options["projection"]=="band"){
        draw_a_band(ctx,3*WIDTH/4, options["surface"]=="hyperbolic")
    }
}

if(game_n_start!=""){
    // Compatability with old links
    if(game_n_start=="looploop"){game_n_start = "poolloop"}
    if(game_n_start=="torusflat"){game_n_start = "flattorusflat"}
    if(game_n_start=="Kleinflat"){game_n_start = "flatKleinflat"}
    if(game_n_start=="real-ppflat"){game_n_start = "flatreal-ppflat"}

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
    redraw_menu()
}
changeGameN(0)


function menu_tick(){
    if(leftPressed){
        if(leftTimer==0){
            if(game_config("sound") && !mute){
                sound_next.cloneNode().play()
            }
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
            if(game_config("sound") && !mute){
                sound_next.cloneNode().play()
            }
        }
        rightTimer++
        rightTimer%=15
    } else {
        rightTimer = 0
    }
    if(firePressed){
        if(game_config("sound") && !mute){
            sound_start.cloneNode().play()
        }
        firePressed = false
        start_game()
    }
    if(upPressed != info_shown){
        info_shown = upPressed
        redraw_menu()
    }
}

function redraw_menu(){
    var canvas = document.getElementById("mathsteroids");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2;
    ctx.beginPath()
    draw_titles(ctx)
    draw_surface(ctx)

    if(game_config("controller") == "none") {
        add_scaled_text(ctx,"controls",WIDTH-330,25,0.5)
        add_scaled_text(ctx,"a",WIDTH-330,50,0.5)
        add_scaled_text(ctx,"left",WIDTH-305,50,0.35)
        add_scaled_text(ctx,"d",WIDTH-210,50,0.5)
        add_scaled_text(ctx,"right",WIDTH-185,50,0.35)
        add_scaled_text(ctx,"k",WIDTH-90,50,0.5)
        add_scaled_text(ctx,"fire",WIDTH-65,50,0.35)
        add_scaled_text(ctx,"w",WIDTH-330,75,0.5)
        add_scaled_text(ctx,"forward",WIDTH-305,75,0.35)
        add_scaled_text(ctx,"q",WIDTH-210,75,0.5)
        add_scaled_text(ctx,"return to menu",WIDTH-185,75,0.35)
    } else {
        add_scaled_text(ctx,"controls",WIDTH-300,25,0.5)
        add_scaled_text(ctx,"turn left / right",WIDTH-275,50,0.35)
        add_scaled_text(ctx,"fire",WIDTH-275,75,0.35)
        add_scaled_text(ctx,"forward",WIDTH-185,75,0.35)
        if(game_config("controller") == "playstation") {
            add_scaled_text(ctx,"#",WIDTH-300,50,0.5)
            add_scaled_text(ctx,"@",WIDTH-300,75,0.5)
            add_scaled_text(ctx,"*",WIDTH-210,75,0.5)
        } else if(game_config("controller") == "mega-drive") {
            add_scaled_text(ctx,"&",WIDTH-300,50,0.5)
            add_scaled_text(ctx,"b",WIDTH-300,75,0.5)
            add_scaled_text(ctx,"F",WIDTH-210,75,0.5)
        } else if(game_config("controller") == "emf") {
            add_scaled_text(ctx,"&",WIDTH-300,50,0.5)
            add_scaled_text(ctx,"a",WIDTH-300,75,0.5)
            add_scaled_text(ctx,"F",WIDTH-210,75,0.5)
        }
    }
    add_scaled_text(ctx,"surface:",20,HEIGHT-45,0.5)
    add_scaled_text(ctx,"<< "+game_title+" >>",150,HEIGHT-45,0.5)
    add_scaled_text(ctx,"hold <forward> for info",20,HEIGHT-20,0.5)
    add_scaled_text(ctx,"press <fire> to begin",WIDTH-295,HEIGHT-20,0.5)
    ctx.stroke();
    draw_mute(ctx)
    if(info_shown){
        ctx.fillStyle = "#000000CC";
        ctx.fillRect(0,80,WIDTH,HEIGHT-150);
        ctx.beginPath()
        add_wrapped_text(ctx, games[game_n][3], 50, 120, WIDTH-100)
        ctx.stroke();
    }
}

function draw_titles(ctx){
    add_text(ctx, "Mathsteroids", 20, 70)
    add_scaled_text(ctx, "v"+VERSION, 350, 30, 0.4)
}

function add_text(ctx, text, x, y){
    add_scaled_text(ctx, text, x, y, 1)
}
function add_wrapped_text(ctx, text, x, y, width){
    var scale = 0.5
    var words = text.split(" ")
    var new_x = x
    var x_in = x
    for (var i=0;i<words.length;i++) {
        new_x = x
        for(var j=0;j<words[i].length;j++) {
            new_x = add_letter_x(words[i].charAt(j), new_x, scale)
        }
        if (new_x > x_in + width) {
            x = x_in
            y += 50*scale
        }
        for(var j=0;j<words[i].length;j++) {
            x = add_letter(ctx, words[i].charAt(j), x, y, scale);
        }
        x = add_letter(ctx, " ", x, y, scale);
    }
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
    ctx.lineCap = "round";
    for(var j=0;j<lines.length;j++){
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

function add_letter_x(letter,x,scale){
    if(letter==" "){
        return x+20*scale
    }
    if(!(letter in font_data)){
        letter = "??"
    }
    var lines = font_data[letter]
    xout = x
    for(var j=0;j<lines.length;j++){
        for(var i=0;i<lines[j].length;i++){
            xout = Math.max(xout,x+lines[j][i][0]*scale)
        }
    }
    return xout+10*scale
}
