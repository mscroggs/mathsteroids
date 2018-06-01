from .core import Asteroids
from geometry.spherical import SphericalVector
from math import sin,cos
from sprites import ship

class Sphere(Asteroids):
    def __init__(self):
        super().__init__()
        self.vector = SphericalVector()
        self.reset()

    def to_2d(self, dh=0, dv=0):
        x,y,z,rot = self.cartesian(dh, dv)
        x2 = (x-y) * sin(30)
        y2 = z + (x+y) * cos(30)
        return x2,y2

    def ship_coords(self):
        xs,ys = [],[]
        for dh,dv in ship.spherical_polar(self.vector.polar()[3]):
            x,y = self.to_2d(dh,dv)
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

