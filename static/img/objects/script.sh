montage output-*.png -tile x1 -geometry 128x128+1+1 -background none montage.png

convert *.png -gravity center -resize 128x128\! output.png
