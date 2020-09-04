from flask import Flask, request
import json
import os

# from skimage.io import imread
# from skimage.transform import resize
# from skimage.util import img_as_float
# from flask_uploads import *
# import tensorflow as tf
# import keras
# from keras.models import load_model
# from tensorflow.python.keras.backend import set_session

app = Flask(__name__)

# app.config['UPLOADED_PHOTOS_DEST'] = os.getcwd()


# photos = UploadSet('photos', IMAGES)

# configure_uploads(app, photos)

# tf_config = some_custom_config
# sess = tf.Session()
# graph = tf.get_default_graph()
# set_session(sess)

# model = load_model('static/simplenet.h5')

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/save", methods=["POST"])
def save_session():
    with open(os.path.join("static", "user.json"), "w") as fp:
        json.dump(request.json, fp)
    return "", 200

# @app.route('/upload', methods=['POST'])
# def upload():
    
#     if request.method == 'POST' and 'photo' in request.files:
#         filename = photos.save(request.files['photo'])
        
#         I = imread(filename)
#         I = img_as_float(I[:, :, :-1])
#         I = resize(I, (128, 128))

#         global sess
#         global graph
#         with graph.as_default():
#             set_session(sess)
#             y = model.predict(I.reshape(1, 128, 128, 3))[0]

#             outstr = ""
#             for label, out in zip(["glass", "paper", "plastics", "metal", "trash"], y):
#                 outstr += "{}, {:.2f}<br/>".format(label, out)
#             # outstr = "{} {} {}".format(I.shape[0], I.shape[1], y)

#         return outstr, 200


if __name__ == "__main__":
    app.run(debug=True, threaded=False)

