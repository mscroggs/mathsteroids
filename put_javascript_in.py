with open("index.html") as f:
    content = f.read()

for file in ["mathsteroids.js", "inputs.js", "titlescreen.js"]:
    with open(file) as f:
        js = f.read()
    content = content.replace(
        f"<script type='text/javascript' src='{file}'></script>",
        f"<script type='text/javascript'>\n{js}\n</script>")

with open("index.html", "w") as f:
    f.write(content)
