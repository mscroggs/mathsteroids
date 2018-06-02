import unittest
from os.path import dirname,join

loader = unittest.TestLoader()
suite = loader.discover(join(dirname(__file__),"test"))
test_runner = unittest.TextTestRunner(verbosity=2)
result = test_runner.run(suite)
