from .core import Vector
from math import sin,cos,tan,asin,acos,atan2,sqrt

class SphericalVector(Vector):
    def __init__(self):
        super().__init__()

    def reset(self):
        self.set_from_polar(1,0,0,0)

    def polar(self):
        return self.radius, self.hangle, self.vangle, self.rotation

    def set_from_polar(self, radius=1, hangle=0, vangle=0, rotation=0):
        self.radius = radius
        self.hangle = hangle
        self.vangle = vangle
        self.rotation = rotation

    def add_to_polar(self, radius=0, hangle=0, vangle=0, rotation=0):
        r_, h_, v_, rot_ = self.polar()
        radius += r_
        hangle += h_
        vangle += v_
        rotation += rot_
        self.set_from_polar(radius,hangle,vangle,rotation)

    def great(self):
        alpha = acos(cos(self.rotation)*cos(self.vangle))
        a = self.hangle - atan2(cos(self.rotation) * sin(self.vangle),sin(self.rotation))
        b = atan2(sin(self.vangle), sin(self.rotation)*cos(self.vangle))
        return self.radius, a, b, alpha

    def add_to_great(self, radius=0, a=0, b=0, alpha=0):
        r_, a_, b_, alpha_ = self.great()
        radius += r_
        a += a_
        b += b_
        alpha += alpha_
        self.set_from_great(radius,a,b,alpha)

    def set_from_great(self, radius=1, a=0, b=0, alpha=0):
        h = a + atan2(cos(alpha)*sin(b),cos(b))
        v = asin(sin(b) * sin(alpha))
        rot = atan2(cos(b)*sin(alpha),cos(alpha))
        self.set_from_polar(radius,h,v,rot)

    def cartesian(self, dh=0, dv=0):
        x = self.radius * cos(self.vangle+dv) * cos(self.hangle+dh)
        y = self.radius * cos(self.vangle+dv) * sin(self.hangle+dh)
        z = self.radius * sin(self.vangle+dv)
        return x, y, z, self.rotation

    def add_to_cartesian(self, x=0, y=0, z=0, rotation=0):
        x_, y_, z_, rot_ = self.cartesian()
        x += x_
        y += y_
        z += z_
        rotation += rot_
        self.set_from_cartesian(x,y,z,rotation)

    def set_from_cartesian(self, x=1, y=0, z=0, rotation=0):
        r = sqrt(x**2+y**2+z**2)
        h = atan(y,x)
        v = asin(z,r)
        self.set_from_polar(r,h,v,rotation)

