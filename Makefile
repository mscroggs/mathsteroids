all: html
.PHONY: html html-single-file

html:
	php index.php > index.html

html-single-file:
	php index.php > index.html
	python3 put_javascript_in.py
