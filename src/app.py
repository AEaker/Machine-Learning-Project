import subprocess
import sys
import os
import face_recognition
import pickle
import cv2
import pymongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from recognize_faces_images import recognizeDriverFace
from pymongo import MongoClient

try: 
    from flask import Flask, render_template, request, redirect, url_for, abort, \
    send_from_directory
    import imghdr
    from werkzeug.utils import secure_filename
except ImportError: 
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'flask'])   
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'flask_cors']) 
finally: 
    from flask import Flask, render_template, request, redirect, url_for, abort, \
    send_from_directory

    """
    subprocess -store the return code to execute in systerm and display the output. 
    flask_cors - A Flask extension for handling Cross Origin Resource Sharing (CORS), making cross-origin AJAX possible. 
    This package has a simple philosophy: when you want to enable CORS, you wish to enable 
    it for all use cases on a domain. This means no mucking around with different allowed headers, methods, etc.

    """

#
app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

#would use these to error catch stuff.
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024 # set constraints for image size
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.jpeg'] # set only image file types to accept
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # where to upload images
# C- create R- read U- update D -delete
def validate_image(stream):
    header = stream.read(512)
    stream.seek(0)
    format = imghdr.what(None, header)
    if not format:
        return None
    return '.' + (format if format != 'jpeg' else 'jpg')

#This Route is to send an error for images to large to process.
@app.errorhandler(413)
def too_large(e):
    return "File is too large", 413

@app.route('/')
def index():

    return render_template('index.html')

@app.route('/', methods=['POST'])
def upload_file():

    if request.method == 'POST':
        userimage = request.files['userimage']
        # recognizeDriverFace(userimage)
        filename = secure_filename(userimage.filename)
        userimage.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('send_file', filename=filename))
    return 



@app.route('/show/<filename>')
def uploaded_file(filename):
    filename = 'http://127.0.0.1:5000/uploads/' + filename
    return render_template('index.html', filename = filename)

@app.route('/uploads/<filename>')
def send_file(filename):
    path = UPLOAD_FOLDER + "/" + filename
    processedimage = recognizeDriverFace(path)
    # processedname = secure_filename(processedimage.filename)
    # processedimage.save(os.path.join(app.config['UPLOAD_FOLDER'], processedname))
    return send_from_directory("./output", "Detected.jpg")

@app.route("/adj.json")
def tester():

    db = client['B-Masseys']
    collection = db['rank']
    rank_list = list(collection.find())
    rank_data = rank_list[0]
    r=0
    for ranks in range(len(rank_data['Driver1'])):

        ranks = []
        rank_dict = {'x': ranks }
        for x in rank_data['Driver1']:
            ranks.append(rank_dict[x])
    

    response = dumps({"nodes": rank_data})
    return response



# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True)