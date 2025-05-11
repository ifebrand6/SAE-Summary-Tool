import os
from flask import Flask, jsonify, request, send_file, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import uuid
import io
import json
from sae_parser import parse_sae_tables

load_dotenv()

app = Flask(__name__)
# Allow CORS for the Next.js frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Store the last summary data in memory (for demo purposes)
last_summary_data = None

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Backend is working!"})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global last_summary_data
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file format. Only .docx files are allowed'}), 400
    try:
        # Save the file
        filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Use the parser module
        results = parse_sae_tables(file_path)
        last_summary_data = {'results': results}
        return jsonify(last_summary_data), 200
    except Exception as e:
        return jsonify({'error': f'Error uploading or parsing file: {str(e)}'}), 500

@app.route('/api/download', methods=['GET'])
def download_summary():
    global last_summary_data
    if not last_summary_data:
        return jsonify({'error': 'No summary data available. Please upload a file first.'}), 400
    json_str = json.dumps(last_summary_data, indent=2)
    buf = io.BytesIO(json_str.encode('utf-8'))
    buf.seek(0)
    return Response(
        buf,
        mimetype='application/json',
        headers={
            'Content-Disposition': 'attachment; filename=sae_summary.json'
        }
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
