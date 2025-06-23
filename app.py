from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from supabase.client import create_client, Client
import os
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import json
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'

# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Supabase configuration - using your credentials directly
url = "https://gtjookapwwtzshofxeur.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0am9va2Fwd3d0enNob2Z4ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODU4MjksImV4cCI6MjA2NjE2MTgyOX0.6Bw2_nD-61NVFf58iZmieMCJbkmaKSVy2UCz_DlDGCA"
supabase: Client = create_client(url, key)

@app.route('/')
def index():
    """Main portfolio page"""
    try:
        # Fetch profile data
        profile_response = supabase.table('profile').select('*').limit(1).execute()
        profile = profile_response.data[0] if profile_response.data else {}
        
        # Fetch skills
        skills_response = supabase.table('skills').select('*').order('order_index').execute()
        skills = skills_response.data if skills_response.data else []
        
        # Fetch projects
        projects_response = supabase.table('projects').select('*').order('created_at', desc=True).execute()
        projects = projects_response.data if projects_response.data else []
        
        # Fetch certifications
        certs_response = supabase.table('certifications').select('*').order('created_at', desc=True).execute()
        certifications = certs_response.data if certs_response.data else []
        
        # Fetch experience
        experience_response = supabase.table('experience').select('*').order('start_date', desc=True).execute()
        experience = experience_response.data if experience_response.data else []

        # Debug output
        print('Profile:', profile)
        print('Skills:', skills)
        print('Projects:', projects)
        print('Certifications:', certifications)
        print('Experience:', experience)
        
        return render_template('index.html', 
                             profile=profile, 
                             skills=skills, 
                             projects=projects, 
                             certifications=certifications,
                             experience=experience)
    except Exception as e:
        print(f"Error loading portfolio: {e}")
        return render_template('index.html', 
                             profile={}, 
                             skills=[], 
                             projects=[], 
                             certifications=[],
                             experience=[])

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin login page"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        try:
            # Check admin credentials
            admin_response = supabase.table('admin_users').select('*').eq('username', username).execute()
            
            if admin_response.data and check_password_hash(admin_response.data[0]['password_hash'], password):
                session['admin_logged_in'] = True
                session['admin_username'] = username
                flash('Login successful!', 'success')
                return redirect(url_for('admin_dashboard'))
            else:
                flash('Invalid credentials!', 'error')
        except Exception as e:
            flash('Login error!', 'error')
    
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
def admin_dashboard():
    """Admin dashboard"""
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    try:
        # Fetch all data for admin dashboard
        profile_response = supabase.table('profile').select('*').limit(1).execute()
        profile = profile_response.data[0] if profile_response.data else {}
        
        skills_response = supabase.table('skills').select('*').order('order_index').execute()
        skills = skills_response.data if skills_response.data else []
        
        projects_response = supabase.table('projects').select('*').order('created_at', desc=True).execute()
        projects = projects_response.data if projects_response.data else []
        
        certs_response = supabase.table('certifications').select('*').order('created_at', desc=True).execute()
        certifications = certs_response.data if certs_response.data else []
        
        experience_response = supabase.table('experience').select('*').order('start_date', desc=True).execute()
        experience = experience_response.data if experience_response.data else []
        
        return render_template('admin/dashboard.html', 
                             profile=profile, 
                             skills=skills, 
                             projects=projects, 
                             certifications=certifications,
                             experience=experience)
    except Exception as e:
        flash(f'Error loading dashboard: {e}', 'error')
        return render_template('admin/dashboard.html', 
                             profile={}, 
                             skills=[], 
                             projects=[], 
                             certifications=[],
                             experience=[])

@app.route('/admin/logout')
def admin_logout():
    """Admin logout"""
    session.pop('admin_logged_in', None)
    session.pop('admin_username', None)
    flash('Logged out successfully!', 'success')
    return redirect(url_for('admin_login'))

# API Routes for CRUD operations
@app.route('/api/profile', methods=['PUT'])
def update_profile():
    """Update profile information"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('profile').update(data).eq('id', 1).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills', methods=['POST'])
def add_skill():
    """Add new skill"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('skills').insert(data).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills/<int:skill_id>', methods=['GET'])
def get_skill(skill_id):
    """Get single skill"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('skills').select('*').eq('id', skill_id).execute()
        if response.data:
            return jsonify({'success': True, 'skill': response.data[0]})
        else:
            return jsonify({'error': 'Skill not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills/<int:skill_id>', methods=['PUT'])
def update_skill(skill_id):
    """Update skill"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('skills').update(data).eq('id', skill_id).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills/<int:skill_id>', methods=['DELETE'])
def delete_skill(skill_id):
    """Delete skill"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('skills').delete().eq('id', skill_id).execute()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
def add_project():
    """Add new project"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('projects').insert(data).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get single project"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('projects').select('*').eq('id', project_id).execute()
        if response.data:
            return jsonify({'success': True, 'project': response.data[0]})
        else:
            return jsonify({'error': 'Project not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Update project"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('projects').update(data).eq('id', project_id).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete project"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('projects').delete().eq('id', project_id).execute()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certifications', methods=['POST'])
def add_certification():
    """Add new certification"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('certifications').insert(data).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certifications/<int:cert_id>', methods=['GET'])
def get_certification(cert_id):
    """Get single certification"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('certifications').select('*').eq('id', cert_id).execute()
        if response.data:
            return jsonify({'success': True, 'certification': response.data[0]})
        else:
            return jsonify({'error': 'Certification not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certifications/<int:cert_id>', methods=['PUT'])
def update_certification(cert_id):
    """Update certification"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('certifications').update(data).eq('id', cert_id).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certifications/<int:cert_id>', methods=['DELETE'])
def delete_certification(cert_id):
    """Delete certification"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('certifications').delete().eq('id', cert_id).execute()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/experience', methods=['POST'])
def add_experience():
    """Add new experience"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('experience').insert(data).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/experience/<int:exp_id>', methods=['GET'])
def get_experience(exp_id):
    """Get single experience"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('experience').select('*').eq('id', exp_id).execute()
        if response.data:
            return jsonify({'success': True, 'experience': response.data[0]})
        else:
            return jsonify({'error': 'Experience not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/experience/<int:exp_id>', methods=['PUT'])
def update_experience(exp_id):
    """Update experience"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        response = supabase.table('experience').update(data).eq('id', exp_id).execute()
        return jsonify({'success': True, 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/experience/<int:exp_id>', methods=['DELETE'])
def delete_experience(exp_id):
    """Delete experience"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        response = supabase.table('experience').delete().eq('id', exp_id).execute()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/image', methods=['POST'])
def upload_profile_image():
    """Upload profile image"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        # Check if file is empty
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload PNG, JPG, JPEG, GIF, or WEBP'}), 400
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save file
        file.save(filepath)
        
        # Generate URL for the uploaded image
        image_url = f"/static/uploads/{unique_filename}"
        
        # Update profile with new image URL
        supabase.table('profile').update({'profile_image': image_url}).eq('id', 1).execute()
        
        return jsonify({
            'success': True, 
            'image_url': image_url,
            'message': 'Profile image uploaded successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/image', methods=['DELETE'])
def delete_profile_image():
    """Delete profile image"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        # Get current profile to find existing image
        profile_response = supabase.table('profile').select('profile_image').eq('id', 1).execute()
        
        if profile_response.data and profile_response.data[0].get('profile_image'):
            current_image_url = profile_response.data[0]['profile_image']
            
            # Remove image file if it exists
            if current_image_url.startswith('/static/uploads/'):
                image_path = current_image_url.replace('/static/', 'static/')
                if os.path.exists(image_path):
                    os.remove(image_path)
        
        # Update profile to remove image URL
        supabase.table('profile').update({'profile_image': None}).eq('id', 1).execute()
        
        return jsonify({
            'success': True,
            'message': 'Profile image removed successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=== Portfolio Website ===")
    print("Starting server on http://localhost:5000")
    print("Admin dashboard: http://localhost:5000/admin/login")
    print("Press Ctrl+C to stop the server")
    print()
    app.run(debug=True, host='127.0.0.1', port=5000) 