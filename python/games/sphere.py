from .core import Asteroids
from geometry.spherical import SphericalVector
from math import sin,cos,tan,log,pi
from sprites import ship

class Sphere(Asteroids):
    def __init__(self):
        super().__init__()
        self.vector = SphericalVector()
        self.vector.set_from_polar()
        self.reset()

    def ship_coords(self, xlim, ylim):
        xs,ys = [],[]
        for dh,dv in ship.spherical_polar(self.vector.polar()[3]):
            x,y = self.to_2d(xlim,ylim,dh,dv)
            xs.append(x)
            ys.append(y)
        return xs,ys

    def move_forward(self):
        self.vector.add_to_great(b=self.speed)

    def speed_up(self):
        self.speed = min(0.07/self.polar()[0],self.speed+0.001)

    def slow_down(self):
        self.speed = max(0,self.speed-0.0001)

    def turn_left(self):
        self.add_to_polar(rotation=-0.1)

    def turn_right(self):
        self.add_to_polar(rotation=0.1)

    def polar(self, *args, **kwargs):
        return self.vector.polar(*args, **kwargs)

    def great(self, *args, **kwargs):
        return self.vector.great(*args, **kwargs)

    def cartesian(self, *args, **kwargs):
        return self.vector.cartesian(*args, **kwargs)

    def add_to_polar(self, *args, **kwargs):
        self.vector.add_to_polar(*args, **kwargs)

    def add_to_great(self, *args, **kwargs):
        self.vector.add_to_great(*args, **kwargs)

    def add_to_cartesian(self, *args, **kwargs):
        self.vector.add_to_cartesian(*args, **kwargs)

    def set_from_polar(self, *args, **kwargs):
        self.vector.set_from_polar(*args, **kwargs)

    def set_from_great(self, *args, **kwargs):
        self.vector.set_from_great(*args, **kwargs)

    def set_from_cartesian(self, *args, **kwargs):
        self.vector.set_from_cartesian(*args, **kwargs)

class SphereIsometric(Sphere):
    def to_2d(self, xlim, ylim, dh=0, dv=0):

        x,y,z,rot = self.cartesian(dh, dv)
        x2 = (x-y) * sin(30)
        y2 = z + (x+y) * cos(30)

        x3 = (xlim[0] + xlim[1])/2 + x2/3 * min(xlim[1],ylim[1])
        y3 = (ylim[0] + ylim[1])/2 + y2/3 * min(xlim[1],ylim[1])

        return x3,y3

class SphereMercator(Sphere):
    def to_2d(self, xlim, ylim, dh=0, dv=0):
        r,hangle,vangle,rot = self.polar(dh,dv)
        if vangle > pi/2:
            hangle += pi
            vangle = pi-vangle
        if vangle < -pi/2:
            hangle += pi
            vangle = -pi-vangle

        hangle += pi

        while hangle < 0:
            hangle += 2*pi
        while hangle > 2*pi:
            hangle -= 2*pi


        x2 = xlim[0] + (xlim[1]-xlim[0]) * hangle/(2*pi)
        maxa = 85.05 * pi/180
        if -maxa <= vangle <= maxa:
            y2 = (ylim[0]+ylim[1])/2 + (ylim[1]-ylim[0])/2 * log(tan(pi/4+vangle/2))/log(tan(pi/4+maxa/2))
        elif vangle > maxa:
            y2 = ylim[0]-1
        else:
            y2 = ylim[1]+1
        return x2, y2

    def wrap(self, x1, x2, y1, y2):
        if abs(x1-x2)>self.size[0]/2 and abs(y1-y2)>self.size[0]/2:
            pass # TODO
        elif abs(x1-x2)>self.size[0]/2:
            if x1<x2:
                xa,xb = x2,x1
                ya,yb = y2,y1
            else:
                xa,xb = x1,x2
                ya,yb = y1,y2
            ymid = xb*(yb-ya)/(xa-xb-self.size[0]) + yb
            return (([xa,ya],[self.size[0],ymid]),([0,ymid],[xb,yb]))
        elif abs(y1-y2)>self.size[0]/2:
            out = []
            if self.size[1]/2 < y1 < self.size[1]:
                out.append(([x1,y1],[x1,self.size[1]]))
            elif 0 < y1 < self.size[1]/2:
                out.append(([x1,y1],[x1,0]))
            if self.size[1]/2 < y2 < self.size[1]:
                out.append(([x1,y2],[x1,self.size[1]]))
            elif 0 < y2 < self.size[1]/2:
                out.append(([x1,y2],[x1,0]))
            return out
        return []
