from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS, cross_origin
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# gpus = tf.config.experimental.list_physical_devices('GPU')
# if gpus:
#     try:
#         # Currently, memory growth needs to be the same across GPUs
#         for gpu in gpus:
#             tf.config.experimental.set_memory_growth(gpu, True)
#         logical_gpus = tf.config.experimental.list_logical_devices('GPU')
#         print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
#     except RuntimeError as e:
#         # Memory growth must be set before GPUs have been initialized
#         print(e)


def init():
    global model

    model = load_model('model/my_model')
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy', metrics=['accuracy'])


@app.route('/predict/', methods=['POST'])
@cross_origin()
def predict():
    img = Image.open(request.files['file'].stream).convert(
        "L").resize((28, 28))
    imgArr = np.array(img) / 255.0
    imgInput = np.expand_dims(imgArr, axis=0)
    y_pred = model.predict(imgInput)
    # print(y_pred)
    return str(np.argmax(y_pred[0]))
    # response = jsonify(message="recieved")
    # return response


if __name__ == "__main__":
    init()
    app.run(debug=True)
