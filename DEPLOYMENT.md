# Deploying Your Portfolio Website to Vercel

This guide will help you deploy your Flask portfolio website to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project**: Your database should be set up and running

## Step 1: Prepare Your Repository

Make sure your repository contains these files:
- `app.py` (main Flask application)
- `requirements.txt` (Python dependencies)
- `vercel.json` (Vercel configuration)
- `runtime.txt` (Python version)
- `static/` directory (CSS, JS, images)
- `templates/` directory (HTML templates)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Python project
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

   ```
   SUPABASE_URL=https://gtjookapwwtzshofxeur.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0am9va2Fwd3d0enNob2Z4ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODU4MjksImV4cCI6MjA2NjE2MTgyOX0.6Bw2_nD-61NVFf58iZmieMCJbkmaKSVy2UCz_DlDGCA
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ```

3. Make sure to select **Production**, **Preview**, and **Development** environments
4. Click **Save**

## Step 4: Deploy

1. If using dashboard: Click **Deploy**
2. If using CLI: Run `vercel --prod`

## Step 5: Test Your Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test the main portfolio page
3. Test the admin dashboard at `/admin/login`
4. Verify all functionality works

## Important Notes

### File Uploads
- Vercel has a read-only filesystem, so file uploads won't work in production
- For production, consider using:
  - Supabase Storage
  - AWS S3
  - Cloudinary
  - Other cloud storage services

### Database
- Make sure your Supabase project is properly configured
- Ensure your database tables exist and have data
- Check that your Supabase RLS (Row Level Security) policies allow your app to access data

### Environment Variables
- Never commit sensitive information to your repository
- Always use environment variables for production credentials
- Make sure your `.env` file is in `.gitignore`

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `requirements.txt`
2. **Environment Variables Not Working**: Ensure they're set in Vercel dashboard
3. **Database Connection Issues**: Verify Supabase credentials and network access
4. **Static Files Not Loading**: Check that `static/` directory is included in deployment

### Debugging

1. Check Vercel build logs in the dashboard
2. Use `vercel logs` command for CLI deployments
3. Test locally with `python app.py` before deploying

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS settings as instructed by Vercel

## Continuous Deployment

Once set up, Vercel will automatically deploy when you push changes to your GitHub repository.

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Supabase Documentation](https://supabase.com/docs) 