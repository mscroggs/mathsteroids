import pygame

class Asteroids:
    def __init__(self):
        self.BLACK = (0,0,0)
        self.WHITE = (255, 255, 255)
        self.size = (800, 450)

    def start(self):
        pygame.init()

        self.screen = pygame.display.set_mode(self.size)
        pygame.display.set_caption("Mathsteroids")

        done = False
        clock = pygame.time.Clock()

        while not done:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    done = True
            self.tick()
            clock.tick(60)
        pygame.quit()

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
        xs,ys = self.ship_coords()
        for x1,x2,y1,y2 in zip(xs[:-1],xs[1:],ys[:-1],ys[1:]):
            self.line(x1,x2,y1,y2)
        pygame.display.flip()

    def line(self, x1, x2, y1, y2):
        xa = self.size[0]/2 + x1/3 * min(self.size)
        xb = self.size[0]/2 + x2/3 * min(self.size)
        ya = self.size[1]/2 + y1/3 * min(self.size)
        yb = self.size[1]/2 + y2/3 * min(self.size)
        pygame.draw.line(self.screen, self.WHITE, [xa, ya], [xb, yb], 1)

    def reset(self):
        self.speed = 0
        self.vector.reset()

    def to_2d(self, dh=0, dv=0):
        raise NotImplementedError

    def ship_coords(self):
        raise NotImplementedError

    def speed_up(self):
        raise NotImplementedError

    def slow_down(self):
        raise NotImplementedError

    def turn_left(self):
        raise NotImplementedError

    def turn_right(self):
        raise NotImplementedError
