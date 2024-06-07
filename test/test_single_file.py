import os

def test_single_file():
    os.system("make html-single-file")
    with open("index.html") as f:
        content = f.read()
    for i in content.split("<script")[1:]:
        assert "src=" not in i.split(">")[0]
