from flask import Flask, render_template, request, redirect, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from drought_indices import Drought
import pandas as pd

app = Flask(__name__)
HOST = '0.0.0.0'
PORT = 5000
drought = Drought()

@app.route('/')
def root():
	return 'Welcome to backend!'

@app.route('/send_discharge_data', methods = ['POST'])
def send_discharge_data():
	if request.method == 'POST':
		df = pd.read_csv(request.files['file'],index_col=0, parse_dates=True, squeeze=True)
		drought.set_discharge(df)
		return jsonify(success=True)
	return jsonify(success=False)

@app.route('/send_precip_data', methods = ['POST'])
def send_precip_data():
	if request.method == 'POST':
		df = pd.read_csv(request.files['file'],index_col=0, parse_dates=True, squeeze=True)
		drought.set_precip(df)
		return jsonify(success=True)
	return jsonify(success=False)

@app.route('/get_indices', methods = ['GET'])
def get_indices():
	if request.method == 'GET':
		start, end = request.args.get('start'), request.args.get('end')
		sdi, spi, dates = drought.get_indices(start, end)
		return jsonify({'sdi':list(sdi), 'spi':list(spi), 'dates':dates})
	return jsonify(success=False)

@app.route('/get_data', methods = ['GET'])
def get_data():
	if request.method == 'GET':
		start, end = request.args.get('start'), request.args.get('end')
		dis, pre = drought.get_discharge(start, end), drought.get_precip(start, end)
		dates = drought.get_dates(start, end)
		return jsonify({'dates':dates, 'discharge':list(dis), 'precip':list(pre)})
	return jsonify(success=False)

@app.route('/get_yearly_indices', methods = ['GET'])
def get_yearly_indices():
	if request.method == 'GET':
		start, end = request.args.get('start'), request.args.get('end')
		sdi, spi, dates = drought.get_yearly_indices(start, end)
		return jsonify({'sdi':list(sdi), 'spi':list(spi), 'dates':dates})
	return jsonify(success=False)

@app.route('/get_yearly_data', methods = ['GET'])
def get_yearly_data():
	if request.method == 'GET':
		start, end = request.args.get('start'), request.args.get('end')
		dis, pre = drought.get_yearly_discharge(start, end), drought.get_yearly_precip(start, end)
		dates = drought.get_yearly_dates(start, end)
		return jsonify({'dates':dates, 'discharge':list(dis), 'precip':list(pre)})
	return jsonify(success=False)

if __name__ == "__main__":
	app.run(host=HOST, port=PORT, debug=True)