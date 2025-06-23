-- Portfolio Website Database Setup
-- Run this in your Supabase SQL Editor

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
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
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    proficiency INTEGER DEFAULT 80,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS experience (
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
CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    icon VARCHAR(100),
    credential_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default profile record
INSERT INTO profile (name, title, subtitle, email, phone, location, about, years_experience, projects_completed, happy_clients, footer_text)
VALUES (
    'Your Name',
    'Full Stack Developer',
    'Passionate about creating amazing web experiences',
    'your.email@example.com',
    '+1 (555) 123-4567',
    'Your City, Country',
    'I am a passionate developer with experience in building modern web applications. I love learning new technologies and solving complex problems.',
    3,
    20,
    15,
    'Building amazing digital experiences.'
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experience_start_date ON experience(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_issue_date ON certifications(issue_date DESC); 