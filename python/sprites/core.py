from math import sin,cos

class Sprite:
    def spherical_polar(self, rotation):
        points = []
        corn = [(i[0]*cos(rotation) - i[1]*sin(rotation),
                 i[1]*cos(rotation) + i[0]*sin(rotation)) for i in self.corners()]
        for a,b in zip(corn,corn[1:]+[corn[0]]):
            for i in range(10):
                points.append((a[0]+(b[0]-a[0])*i/10,a[1]+(b[1]-a[1])*i/10))
        points.append(corn[0])
        return points
