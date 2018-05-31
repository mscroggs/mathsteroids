from .core import Sprite

class Ship(Sprite):
    def __init__(self):
        pass

    def corners(self):
        return (
                (0.1,0),
                (-0.05,0.1),
                (0,0),
                (-0.05,-0.1)
               )
