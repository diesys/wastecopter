from flask import Flask, request
import json
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/save", methods=["POST"])
def save_session():
    with open(os.path.join("static", "user.json"), "w") as fp:
        json.dump(request.json, fp)
    return "", 200

if __name__ == "__main__":
    app.run(debug=True)

