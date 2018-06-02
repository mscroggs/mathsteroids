import os as _os

path = _os.path.dirname(_os.path.realpath(__file__))

with open(_os.path.join(path, "VERSION")) as f:
    VERSION = f.read().strip("\n")
