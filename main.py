import matplotlib
matplotlib.use("Agg")

from flask import Flask, request, render_template, session, flash, redirect, url_for
import random
from datetime import datetime
import os, shutil
from werkzeug.utils import secure_filename
import PIL
from PIL import Image, ImageDraw, ImageFilter
import ast
import numpy as np
import cv2
# import tkinter


from PIL.ImageFilter import (
   BLUR, CONTOUR, DETAIL, EDGE_ENHANCE, EDGE_ENHANCE_MORE,
   EMBOSS, FIND_EDGES, SMOOTH, SMOOTH_MORE, SHARPEN
)

app = Flask(__name__)

app.config['SECRET_KEY'] = '<---YOUR_SECRET_FORM_KEY--->'


@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
    filename = request.args.get('filename')
    width = None
    height = None
    dpi = None

    if filename != None:
        # try:
        # loading the image
        img = PIL.Image.open("static/files/"+filename)
        # fetching the dimensions
        width, height = img.size

        # root = tkinter.Tk()
        # dpi = int(float(root.winfo_fpixels('1i')))

        dpi = 100

        # if 'dpi' not in session:
        #     session['dpi'] = int(img.info['dpi'][0])
        # else:
        #     dpi = session['dpi']

        # except:
        #     filename = None
        #     width = None
        #     height = None
        #     dpi = None

    return render_template('index.html', title='Index', filename=filename, width=width, height=height, dpi=dpi,
                           material=request.args.get('material'))


@app.route('/upload_file', methods=['POST'])
def upload_file():
    delete_all_files()
    file = request.files['file']
    filename = secure_filename(file.filename)
    # filename = 'image' + file_extension
    file.save(os.path.join("static/files/", filename))

    original = Image.open("static/files/" + filename)
    filename, file_extension = os.path.splitext(filename)
    original.save("static/files/" + filename + ".png", format="png")

    return redirect(url_for('index', filename=filename + ".png"))


def delete_all_files():
    folder = 'static/files'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

    if 'dpi' in session:
        session.pop('dpi')


@app.route('/crop_file', methods=['POST'])
def crop_file():
    filename = request.form['filename']
    cords = ast.literal_eval(request.form['crop'])
    radius = ast.literal_eval(request.form['radius'])

    crop_edges = (int(float(radius['rx'])) + int(float(radius['ry'])) ) / 2

    image = cv2.imread('static/files/' + filename)
    y = int(float(cords['y']))
    x = int(float(cords['x']))
    h = int(float(cords['height']))
    w = int(float(cords['width']))
    crop = image[y:y + h, x:x + w]

    cv2.imwrite('static/files/' + filename, crop)


    img = Image.open(f'static/files/' + filename)
    img = circle_corner(img, int(float(crop_edges)))
    img.save(f'static/files/' + filename, 'png', quality=100, dpi=(300.0, 300.0))


    return redirect(url_for('index', filename=filename))


def circle_corner(img, radii):
    # Draw a circle (used to separate 4 corners)
    circle = Image.new('L', (radii * 2, radii * 2), 0)  # create a black square
    # circle.save('1.jpg','JPEG',qulity=100)


    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, radii * 2, radii * 2), fill=255)  # black square inside cut white circle
    # circle.save('2.jpg','JPEG',qulity=100)

    img = img.convert("RGBA")
    w, h = img.size

    alpha = Image.new('L', img.size, 255)
    alpha.paste(circle.crop((0, 0, radii, radii)), (0, 0))  # upper left corner
    alpha.paste(circle.crop((radii, 0, radii * 2, radii)),
                (w - radii, 0))  # upper right corner
    alpha.paste(circle.crop((radii, radii, radii * 2, radii * 2)),
                (w - radii, h - radii))  # bottom right corner
    alpha.paste(circle.crop((0, radii, radii, radii * 2)),
                (0, h - radii))  # lower left corner

    img.putalpha(alpha)  # White area is transparent and visible, black area is invisible

    return img


@app.route('/resize_file', methods=['POST'])
def resize_file():
    filename = request.form['filename']
    width = request.form['width']
    height = request.form['height']
    format = request.form['format']
    dpi = request.form['dpi']

    if format == 'in':
        # in to px
        width = float(width) * 96
        height = float(height) * 96
    elif format == 'mm':
        # mm to px (3.7795)
        width = float(width) * 3.7795
        height = float(height) * 3.7795

    im = Image.open(r'static/files/' + filename)
    newsize = (int(float(width)), int(float(height)))
    im = im.resize(newsize)
    im.save("static/files/" + filename , format="png")

    return redirect(url_for('index', filename=filename))



@app.route('/material_file', methods=['POST'])
def material_file():
    filename = request.form['filename']
    material = request.form['material']

    # creating a image object
    im1 = Image.open(r"static/files/" + filename)
    # applying the contour filter
    if 'BLUR' in material:
        im2 = im1.filter(ImageFilter.BLUR)
        im2.save("static/files/material_" + filename, format="png")
    elif 'CONTOUR' in material:
        im2 = im1.filter(ImageFilter.CONTOUR)
        im2.save("static/files/material_" + filename, format="png")
    elif 'DETAIL' in material:
        im2 = im1.filter(ImageFilter.DETAIL)
        im2.save("static/files/material_" + filename, format="png")
    elif 'EDGE_ENHANCE' in material:
        im2 = im1.filter(ImageFilter.EDGE_ENHANCE)
        im2.save("static/files/material_" + filename, format="png")
    elif 'EDGE_ENHANCE_MORE' in material:
        im2 = im1.filter(ImageFilter.EDGE_ENHANCE_MORE)
        im2.save("static/files/material_" + filename, format="png")
    elif 'FIND_EDGES' in material:
        im2 = im1.filter(ImageFilter.FIND_EDGES)
        im2.save("static/files/material_" + filename, format="png")
    elif 'SMOOTH' in material:
        im2 = im1.filter(ImageFilter.SMOOTH)
        im2.save("static/files/material_" + filename, format="png")
    elif 'SMOOTH_MORE' in material:
        im2 = im1.filter(ImageFilter.SMOOTH_MORE)
        im2.save("static/files/material_" + filename, format="png")
    elif 'SHARPEN' in material:
        im2 = im1.filter(ImageFilter.SHARPEN)
        im2.save("static/files/material_" + filename, format="png")


    return redirect(url_for('index', filename=filename, material="material_" + filename))


if __name__ == '__main__':
    app.run(debug=True)