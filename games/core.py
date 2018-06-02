import pygame
from exceptions import EndGame
import config

class Asteroids:
    def __init__(self):
        self.BLACK = (0,0,0)
        self.WHITE = (255, 255, 255)
        self.size = (800, 450)

    def start(self):
        pygame.init()

        self.screen = pygame.display.set_mode(self.size)
        pygame.display.set_caption("Mathsteroids")

        try:
            self.title_screen()

        except EndGame:
            pygame.quit()

    def title_screen(self):
        clock = pygame.time.Clock()
        self.screen.fill(self.BLACK)
        from fonts import linefont
        for l in linefont("Mathsteroids %"+config.VERSION,50,100):
            for p1,p2 in zip(l[:-1],l[1:]):
                pygame.draw.line(self.screen, self.WHITE, p1, p2, 1)
        pygame.display.flip()
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    raise EndGame
            keys = pygame.key.get_pressed()
            if keys[pygame.K_RETURN]:
                break
            clock.tick(60)
        self.play_game()

    def play_game(self):
        clock = pygame.time.Clock()
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    raise EndGame
            self.tick()
            clock.tick(60)

    def tick(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP]:
            self.speed_up()
        else:
            self.slow_down()
        if keys[pygame.K_LEFT]:
            self.turn_left()
        if keys[pygame.K_RIGHT]:
            self.turn_right()
        self.move_forward()
        self.screen.fill(self.BLACK)
        xs,ys = self.ship_coords([0,self.size[0]],[0,self.size[1]])
        for x1,x2,y1,y2 in zip(xs[:-1],xs[1:],ys[:-1],ys[1:]):
            if abs(x1-x2)<self.size[0]/2 and abs(y1-y2)<self.size[1]/2:
                pygame.draw.line(self.screen, self.WHITE, [x1, y1], [x2, y2], 1)
            else:
                points = self.wrap(x1,x2,y1,y2)
                for p1,p2 in points:
                    pygame.draw.line(self.screen, self.WHITE, p1, p2, 1)
        pygame.display.flip()

    def wrap(self, x1, x2, y1, y2):
        if abs(x1-x2)>self.size[0]/2 and abs(y1-y2)>self.size[1]/2:
            return [] # TODO
        elif abs(x1-x2)>self.size[0]/2:
            if x1<x2:
                xa,xb = x2,x1
                ya,yb = y2,y1
            else:
                xa,xb = x1,x2
                ya,yb = y1,y2
            ymid = xb*(yb-ya)/(xa-xb-self.size[0]) + yb
            return (([xa,ya],[self.size[0],ymid]),([0,ymid],[xb,yb]))
        elif abs(y1-y2)>self.size[1]/2:
            if y1<y2:
                xa,xb = x2,x1
                ya,yb = y2,y1
            else:
                xa,xb = x1,x2
                ya,yb = y1,y2
            xmid = yb*(xb-xa)/(ya-yb-self.size[1]) + xb
            return (([xa,ya],[xmid,self.size[1]]),([xmid,0],[xb,yb]))

    def reset(self):
        self.speed = 0
        self.vector.reset()

    def to_2d(self, xlim, ylim, dh=0, dv=0):
        raise NotImplementedError

    def ship_coords(self, xlim, ylim):
        raise NotImplementedError

    def speed_up(self):
        raise NotImplementedError

    def slow_down(self):
        raise NotImplementedError

    def turn_left(self):
        raise NotImplementedError

    def turn_right(self):
        raise NotImplementedError
