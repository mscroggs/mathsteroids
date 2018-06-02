from unittest import TestCase
from geometry import SphericalVector
from math import pi,acos,atan,sqrt,cos,sin,tan
from random import random

def cot(angle):
    return 1/tan(angle)

A,B = 1,0.8
cases = [
         ((5,pi/2,pi/4,0),(5,0,pi/2,pi/4)),
         ((2,pi/2,0,pi/2),(2,pi/2,0,pi/2)),
         ((1,acos(cos(B)/sin(A)),acos(cos(A)/sin(B)),pi/2-B),(1,0,acos(cot(A)*cot(B)),A))
        ]

class GeometryTests(TestCase):
    def test_spherical_to_great(self):
        vec = SphericalVector()
        for p,g in cases:
            vec.set_from_polar(radius=p[0], hangle=p[1], vangle=p[2], rotation=p[3])
            r,a,b,alpha = vec.great()
            self.assertAlmostEqual(r, g[0])
            self.assertAlmostEqual(a, g[1])
            self.assertAlmostEqual(b, g[2])
            self.assertAlmostEqual(alpha, g[3])

    def test_great_to_spherical(self):
        vec = SphericalVector()
        for p,g in cases:
            vec.set_from_great(radius=g[0], a=g[1], b=g[2], alpha=g[3])
            r,h,v,rot = vec.polar()
            self.assertAlmostEqual(r, p[0])
            self.assertAlmostEqual(h, p[1])
            self.assertAlmostEqual(v, p[2])
            self.assertAlmostEqual(rot, p[3])

    def test_invert(self):
        vec = SphericalVector()
        for a,b,c,d in [(1,1,0,1),(1,0,1,1),(0.1,0.2,0.3,0.4)]:
            vec.set_from_great(a,b,c,d)
            A,B,C,D = vec.great()
            self.assertAlmostEqual(a, A)
            self.assertAlmostEqual(b, B)
            self.assertAlmostEqual(c, C)
            self.assertAlmostEqual(d, D)

if __name__ == "__main__":
    from unittest import main
    main()
