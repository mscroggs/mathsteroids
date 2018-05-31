def cartesian_to_great(r, hangle, vangle, rot):

    

    return r, a, b, alpha

def great_to_cartesian(r, a, b, alpha):
    hangle = (a+b)/r
    vangle = atan2(tan(alpha),sin(b/r))
    rot = alpha * cos(b/r)
    return r, hangle, vangle, rot
