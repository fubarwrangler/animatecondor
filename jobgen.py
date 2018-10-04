#!/usr/bin/python

import random


class JobGen(object):
    """ Generate jobs with a "bursty" randomness:
            smap: list of 0<n<1 float probability of transition to next state
            make_list(): lim, stop after t>=lim
                        spacing: [(a,b),...]: a: mean, b: stddev of rand from
                        position indexed by location in list (len := len smap)
    """
    def __init__(self, smap):
        self.smap = smap
        self.state = random.randint(0, len(smap)-1)

    def _next(self):
        if random.random() < self.smap[self.state]:
            self.state = (self.state + 1) % len(self.smap)
        return self.state

    def make_list(self, spacing, lim):
        tt = 0
        while True:
            t = abs(random.normalvariate(*spacing[self._next()]))
            tt += t
            if tt > lim:
                break
            yield tt


if __name__ == '__main__':
    g = JobGen([0.1, 0.5])
    print '\n'.join(map(str, g.make_list([(0.18, 0.05), (4, 2)], 30)))
