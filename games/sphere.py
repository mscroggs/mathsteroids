]from .core import Asteroids
from geometry.spherical import cartesian_to_great, great_to_cartesian
from math import sin,cos,tan,sin,acos,atan2
from sprites import ship

class Sphere(Asteroids):
    def __init__(self):
        self.radius = 1
        self.speed = 0.1
        self.reset()
        pass

    def reset(self):
        self.hangle = 0
        self.vangle = 0
        self.rotation = 0

    def cartesian(self, dh=0, dv=0):
        x = self.radius * cos(self.hangle+dh) * cos(self.vangle+dv)
        y = self.radius * sin(self.hangle+dh) * cos(self.vangle+dv)
        z = self.radius * sin(self.vangle+dv)
        return x,y,z

    def to_2d(self, dh=0, dv=0):
        x,y,z = self.cartesian(dh, dv)
        x2 = (x-y) * sin(30)
        y2 = z + (x+y) * cos(30)
        return x2,y2

    def ship_coords(self):
        xs,ys = [],[]
        for dh,dv in ship.spherical_polar(self.rotation):
            x,y = self.to_2d(dh,dv)
            xs.append(x)
            ys.append(y)
        return xs,ys

    def plot_ship(self, plt):
        xs,ys = self.ship_coords()
        plt.plot(xs,ys,"k-")

    def move_forward(self):
        r,a,b,alpha = cartesian_to_great(self.radius, self.hangle, self.vangle, self.rotation)
        b += self.speed
        self.radius, self.hangle, self.vangle, self.rotation = great_to_cartesian(r,a,b,alpha)
