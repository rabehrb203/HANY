import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
from datetime import datetime, timezone

from flask import Flask, render_template, request, jsonify, send_file, flash, redirect, url_for, session
from werkzeug.utils import secure_filename
import os
from PIL import Image
import json
from datetime import datetime
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, text
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from functools import wraps
from flask_mail import Mail, Message
import PyPDF2
import sqlite3

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///textanalysis.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

db = SQLAlchemy(app)
mail = Mail(app)
admin = Admin(app, name='لوحة التحكم', template_mode='bootstrap3', url='/admin')

try:
    pass
except Exception as e:
    print("تنبيه: يجب تثبيت برنامج Tesseract OCR على جهازك.")
    print("يمكنك تحميله من: https://github.com/UB-Mannheim/tesseract/wiki")
    print("بعد التثبيت، تأكد من إضافة مسار التثبيت إلى متغيرات البيئة PATH")


class TextAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(255), nullable=False)
    difficulty_level = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    email = db.Column(db.String(120))

    def __str__(self):
        return f"التحليل #{self.id}"

class TextAnalysisAdmin(ModelView):
    column_labels = {
        'id': 'الرقم',
        'file_path': 'مسار الملف',
        'difficulty_level': 'مستوى الصعوبة',
        'score': 'النقاط',
        'created_at': 'تاريخ الإنشاء',
        'email': 'البريد الإلكتروني'
    }
    column_default_sort = ('created_at', True)
    can_create = False
    can_edit = False
    can_delete = True
    column_searchable_list = ['email', 'difficulty_level']
    column_filters = ['difficulty_level', 'score', 'created_at']

admin.add_view(TextAnalysisAdmin(TextAnalysis, db.session, name='تحليلات النصوص'))

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        try:
            msg = Message('رسالة جديدة من نموذج الاتصال',
                         sender=email,
                         recipients=[app.config['MAIL_USERNAME']])
            msg.body = f"""
            اسم المرسل: {name}
            البريد الإلكتروني: {email}
            الرسالة: {message}
            """
            mail.send(msg)
            flash('تم إرسال رسالتك بنجاح!', 'success')
        except Exception as e:
            flash('عذراً، حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.', 'danger')
            
    return redirect(url_for('home', _anchor='contact'))

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('لم يتم اختيار ملف', 'error')
        return redirect(url_for('home'))
    
    file = request.files['file']
    if file.filename == '':
        flash('لم يتم اختيار ملف', 'error')
        return redirect(url_for('home'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            file_type = filename.rsplit('.', 1)[1].lower()
            if file_type == 'pdf':
                with open(filepath, 'rb') as pdf_file:
                    PyPDF2.PdfReader(pdf_file)
            elif file_type in ['jpg', 'jpeg']:
                pass
            elif file_type == 'txt':
                with open(filepath, 'r', encoding='utf-8') as text_file:
                    text_file.read()
            
            session['filename'] = filename
            session['file_type'] = file_type
            return redirect(url_for('questions'))
        except Exception as e:
            os.remove(filepath)
            flash('الملف المحدد غير صالح', 'error')
            return redirect(url_for('home'))
    else:
        flash('نوع الملف غير مسموح به. الأنواع المسموح بها هي: PDF, TXT, JPG', 'error')
        return redirect(url_for('home'))

@app.route('/view_file/<filename>')
def view_file(filename):
    try:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    except Exception as e:
        return str(e), 404

@app.route('/questions')
def questions():
    if 'filename' not in session:
        flash('يرجى تحميل ملف أولاً', 'error')
        return redirect(url_for('home'))
    return render_template('questions.html')


def evaluate_value(value):
    if 0 < value < 17:
        return "C2"
    elif 18 < value < 26:
        return "C2&C1"
    elif 27 < value < 31:
        return "C1"
    elif 32 < value < 40:
        return "C1&B2"
    elif 41 < value < 45:
        return "B2"
    elif 46 < value < 54:
        return "B2&B1"
    elif 55 < value < 59:
        return "B1"
    elif 60 < value < 69:
        return "B1&A2"
    elif 70 < value < 74:
        return "A2"
    elif 75 < value < 83:
        return "A2&A1"
    elif 84 < value:
        return "A1"
    else:
        return "Value out of range"

@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    try:
        data = request.get_json()
        total_score = data.get('score', 0) 
        difficulty_level = data.get('level', '')

        file_path = session.get('current_file', '')

        return jsonify({
            'success': True,
            'score': total_score,
            'difficulty_level': difficulty_level,
            'file_path': file_path
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})



@app.route('/calculate_difficulty', methods=['POST'])
def calculate_difficulty():
    try:
        data = request.get_json()
        score = data.get('score', 0)
        
        difficulty = evaluate_value(score)
        
        return jsonify({
            'success': True,
            'difficulty': difficulty,
            'score': score
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/share_results', methods=['POST'])
def share_results():
    try:
        data = request.get_json()
        print('Received data:', data)

        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'error': 'البريد الإلكتروني مطلوب'})
        
        created_at = datetime.now(timezone.utc)

        analysis_id = session.get('analysis_id')
        if analysis_id:
            analysis = TextAnalysis.query.get(analysis_id)
            if analysis:
                analysis.email = email
                analysis.created_at = created_at 
                db.session.commit()
        
        total_score = data.get('score', 0)
        difficulty_level = data.get('level', '')
        file_path = data.get('current_file', '') 
        


        print("Score:", total_score)
        print("Difficulty Level:", difficulty_level)
        msg = Message(
            'نتائج تحليل النص',
            sender=app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        
        if 'filename' in session:
            filename = session['filename']
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            msg.attach(filename, 'application/octet-stream', open(filepath, 'rb').read())
        
        msg.html = render_template(
            'email_template.html',
            score=total_score,
            difficulty_level=difficulty_level,
            file_path=file_path,
            created_at=created_at.strftime('%Y-%m-%d %H:%M:%S'),
        )
        mail.send(msg)
        
        return jsonify({'success': True, 'message': 'تم إرسال البريد بنجاح!','success_message': 'تم إرسال النتائج بنجاح!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_pdf_path')
def get_pdf_path():
    if 'filename' not in session:
        return jsonify({
            'success': False,
            'error': 'لم يتم تحميل ملف'
        })
    
    try:
        filename = session['filename']
        file_type = filename.rsplit('.', 1)[1].lower()
        file_path = url_for('view_file', filename=filename)
        
        return jsonify({
            'success': True,
            'file_path': file_path,
            'file_type': file_type
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/admin')
def admin_dashboard():
    try:
        total_analyses = db.session.query(TextAnalysis).count()
        
        recent_results = db.session.query(TextAnalysis).order_by(
            TextAnalysis.created_at.desc()
        ).limit(10).all()
        
        return render_template('admin/dashboard.html',
                             stats={'total_analyses': total_analyses},
                             recent_results=recent_results)
    except Exception as e:
        app.logger.error(f"Dashboard error: {str(e)}")
        return "Error loading dashboard", 500

@app.route('/admin/results')
def admin_results():
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    results = TextAnalysis.query.order_by(TextAnalysis.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False)
    
    return render_template('admin/results.html', results=results)

@app.route('/admin/delete_result/<int:id>', methods=['POST'])
def delete_result(id):
    result = TextAnalysis.query.get_or_404(id)
    db.session.delete(result)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/admin/stats')
def get_stats():
    difficulty_stats = db.session.query(
        TextAnalysis.difficulty_level,
        func.count(TextAnalysis.id)
    ).group_by(TextAnalysis.difficulty_level).all()
    
    
    return jsonify({
        'difficulty_stats': dict(difficulty_stats),
        'score_stats': [float(score[0]) for score in score_stats]
    })

@app.route('/contact_form', methods=['POST'])
def contact_form():
    if request.method == 'POST':
        file = request.files['file'] 
        if file:
            pass
        return jsonify({'message': 'تم إرسال البريد بنجاح!'}), 200

conn = sqlite3.connect('scores.db')
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    score INTEGER NOT NULL,
    level TEXT NOT NULL,
    file_name TEXT NOT NULL
)
''')
conn.commit()


def save_score(email, score, level, file_name):
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO scores (email, score, level, file_name)
    VALUES (?, ?, ?, ?)
    ''', (email, score, level, file_name))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    app.run(debug=True)
