# Modern Portfolio Website with Admin Dashboard

A dynamic, modern portfolio website built with Flask, HTML, CSS, JavaScript, and Supabase. Features a beautiful frontend portfolio and a comprehensive admin dashboard for content management.

## Features

### Portfolio Website
- **Modern Design**: Clean, responsive design with smooth animations
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **About Section**: Personal information with statistics
- **Skills Section**: Interactive skill cards with proficiency bars
- **Projects Section**: Portfolio showcase with live links and GitHub integration
- **Experience Timeline**: Professional experience with company details
- **Certifications**: Professional certifications with credential links
- **Contact Form**: Functional contact form with validation
- **Responsive Design**: Mobile-first approach with perfect mobile experience

### Admin Dashboard
- **Secure Login**: Protected admin access with session management
- **Profile Management**: Edit personal information, social links, and about section
- **Skills Management**: Add, edit, and delete skills with proficiency levels
- **Projects Management**: Manage portfolio projects with images and links
- **Experience Management**: Add and edit work experience entries
- **Certifications Management**: Manage professional certifications
- **Real-time Updates**: Changes reflect immediately on the portfolio
- **Modern UI**: Clean, intuitive interface with modal forms

## Technology Stack

- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome
- **Animations**: AOS (Animate On Scroll)
- **Authentication**: Session-based with password hashing

## Setup Instructions

### 1. Prerequisites
- Python 3.8 or higher
- Supabase account and project

### 2. Clone the Repository
```bash
git clone <repository-url>
cd portfolio-website
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Supabase Database

#### Create Tables in Supabase SQL Editor:

```sql
-- Profile table
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    title VARCHAR(255),
    subtitle TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    about TEXT,
    profile_image VARCHAR(500),
    about_image VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    instagram_url VARCHAR(500),
    years_experience INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    happy_clients INTEGER DEFAULT 0,
    footer_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    proficiency INTEGER DEFAULT 80,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    technologies TEXT,
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Experience table
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    technologies TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Certifications table
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    icon VARCHAR(100),
    credential_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'pbkdf2:sha256:600000$your_hashed_password_here');
```

### 5. Environment Configuration
1. Copy `env.example` to `.env`
2. Update the following variables:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SECRET_KEY=your_random_secret_key
   ```

### 6. Create Admin User
Run this Python script to create an admin user:
```python
from werkzeug.security import generate_password_hash
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase = create_client(url, key)

# Create admin user
password_hash = generate_password_hash('your_admin_password')
supabase.table('admin_users').insert({
    'username': 'admin',
    'password_hash': password_hash
}).execute()

print("Admin user created successfully!")
```

### 7. Run the Application
```bash
python app.py
```

The application will be available at:
- Portfolio: `http://localhost:5000`
- Admin Dashboard: `http://localhost:5000/admin/login`

## File Structure

```
portfolio-website/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
├── README.md             # This file
├── templates/            # HTML templates
│   ├── index.html        # Main portfolio page
│   └── admin/           # Admin templates
│       ├── login.html    # Admin login page
│       └── dashboard.html # Admin dashboard
├── static/              # Static files
│   ├── css/            # Stylesheets
│   │   ├── style.css   # Main portfolio styles
│   │   └── admin.css   # Admin dashboard styles
│   ├── js/             # JavaScript files
│   │   ├── main.js     # Main portfolio scripts
│   │   └── admin.js    # Admin dashboard scripts
│   └── images/         # Images and assets
└── .env                # Environment variables (create this)
```

## Database Schema

### Profile Table
- `id`: Primary key
- `name`: Full name
- `title`: Professional title
- `subtitle`: Short description
- `email`: Contact email
- `phone`: Contact phone
- `location`: Current location
- `about`: Detailed about section
- `profile_image`: Profile picture URL
- `about_image`: About section image URL
- `github_url`, `linkedin_url`, etc.: Social media links
- `years_experience`, `projects_completed`, `happy_clients`: Statistics

### Skills Table
- `id`: Primary key
- `name`: Skill name
- `icon`: FontAwesome icon class
- `proficiency`: Skill level (0-100)
- `order_index`: Display order

### Projects Table
- `id`: Primary key
- `title`: Project title
- `description`: Project description
- `image`: Project image URL
- `technologies`: Comma-separated tech stack
- `live_url`: Live project URL
- `github_url`: GitHub repository URL

### Experience Table
- `id`: Primary key
- `position`: Job title
- `company`: Company name
- `start_date`: Employment start date
- `end_date`: Employment end date (null for current)
- `description`: Job description
- `technologies`: Technologies used

### Certifications Table
- `id`: Primary key
- `title`: Certification title
- `issuer`: Issuing organization
- `issue_date`: Date issued
- `icon`: FontAwesome icon class
- `credential_url`: Verification URL

## Customization

### Styling
- Modify `static/css/style.css` for portfolio styling
- Modify `static/css/admin.css` for admin dashboard styling
- Update color scheme, fonts, and layout as needed

### Content
- Use the admin dashboard to manage all content
- Add your own images to `static/images/`
- Update social media links in the profile section

### Features
- Add new sections by extending the Flask routes
- Implement additional admin features as needed
- Add more interactive elements with JavaScript

## Security Features

- Password hashing with Werkzeug
- Session-based authentication
- CSRF protection (can be added)
- Input validation and sanitization
- Secure environment variable management

## Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set `FLASK_ENV=production` in environment variables
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Set up proper SSL certificates
4. Configure your domain and hosting provider

### Example with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## Changelog

### Version 1.0.0
- Initial release
- Complete portfolio website
- Admin dashboard with CRUD operations
- Supabase integration
- Responsive design
- Modern UI/UX 
 