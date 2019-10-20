from flask import Flask, request
import json
import os
from skimage.io import imread
from flask_uploads import *

app = Flask(__name__)

app.config['UPLOADED_PHOTOS_DEST'] = os.getcwd()

# file = UploadSet('SecretKey', DATA)

photos = UploadSet('photos', IMAGES)

configure_uploads(app, photos)

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/save", methods=["POST"])
def save_session():
    with open(os.path.join("static", "user.json"), "w") as fp:
        json.dump(request.json, fp)
    return "", 200

@app.route('/upload', methods=['POST'])
def upload():
    print(request.files)
    if request.method == 'POST' and 'myimage' in request.files:
        filename = photos.save(request.files['myimage'])
        rec = Photo(filename=filename, user=g.user.id)

        print(type(rec))
        
        # rec.store()
        flash("Photo saved.")
        # return redirect(url_for('show', id=rec.id))
    return "ok", 200


if __name__ == "__main__":
    app.run(debug=True)

