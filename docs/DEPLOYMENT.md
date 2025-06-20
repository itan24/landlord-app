# Deployment Guide

This guide covers deploying the Landlord Management App to various platforms and environments.

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- A PostgreSQL database (local or cloud)
- Environment variables configured
- Domain name (optional but recommended)

## Environment Variables

Create a `.env.local` file for development or set environment variables in your deployment platform:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Additional (optional)
NODE_ENV="production"
```

### Generating NEXTAUTH_SECRET

Generate a secure secret key:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Setup

### Local PostgreSQL

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE landlord_app;
   ```
3. Update DATABASE_URL in your environment variables

### Cloud Databases

#### Supabase (Recommended)
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update DATABASE_URL

#### Railway
1. Create account at [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Copy the connection string
4. Update DATABASE_URL

#### PlanetScale
1. Create account at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Copy the connection string
4. Update DATABASE_URL

### Database Migration

After setting up the database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

## Deployment Platforms

### Vercel (Recommended)

Vercel is the easiest platform for Next.js applications.

#### Automatic Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "New Project"
   - Import your repository

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required environment variables
   - Set production environment

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Sign in and click "New site from Git"
   - Connect your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all required variables

4. **Deploy**
   - Netlify will automatically deploy on push to main branch

### Railway

1. **Create Project**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Connect your repository

2. **Add Services**
   - Add PostgreSQL service for database
   - Add Web Service for your app

3. **Configure Web Service**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Port: 3000

4. **Environment Variables**
   - Link PostgreSQL service
   - Add other required variables

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app
   - Connect your repository

2. **Configure App**
   - Source: GitHub repository
   - Branch: main
   - Build command: `npm run build`
   - Run command: `npm start`

3. **Add Database**
   - Add PostgreSQL database service
   - Link to your app

4. **Environment Variables**
   - Add all required variables
   - Link database connection

### Self-Hosted (VPS)

#### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=landlord_app
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

#### Manual Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd landlord-app
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Set environment variables
   export DATABASE_URL="postgresql://..."
   export NEXTAUTH_URL="https://your-domain.com"
   export NEXTAUTH_SECRET="your-secret"
   
   # Start with PM2
   pm2 start npm --name "landlord-app" -- start
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## SSL/HTTPS Setup

### Vercel/Netlify
SSL is automatically configured.

### Self-Hosted with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```javascript
   // next.config.ts
   const nextConfig = {
     compress: true,
     poweredByHeader: false,
   }
   ```

2. **Image Optimization**
   ```javascript
   // next.config.ts
   const nextConfig = {
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif'],
     },
   }
   ```

3. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

   ```javascript
   // next.config.ts
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   
   module.exports = withBundleAnalyzer({
     // your config
   })
   ```

### Database Optimization

1. **Connection Pooling**
   ```javascript
   // lib/db.ts
   import { Pool } from 'pg'
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   })
   ```

2. **Indexes**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_profiles_email ON profiles(email);
   CREATE INDEX idx_bills_profile_id ON bills(profile_id);
   CREATE INDEX idx_bills_due_date ON bills(due_date);
   ```

## Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring** (Self-hosted)
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Vercel Analytics**
   - Enable in Vercel dashboard
   - View performance metrics

3. **Custom Logging**
   ```javascript
   // lib/logger.ts
   export const logger = {
     info: (message: string, data?: any) => {
       console.log(`[INFO] ${message}`, data || '')
     },
     error: (message: string, error?: any) => {
       console.error(`[ERROR] ${message}`, error || '')
     },
   }
   ```

### Database Monitoring

1. **Prisma Studio**
   ```bash
   npx prisma studio
   ```

2. **Database Logs**
   ```sql
   -- Enable query logging
   ALTER SYSTEM SET log_statement = 'all';
   SELECT pg_reload_conf();
   ```

## Backup Strategy

### Database Backups

1. **Automated Backups**
   ```bash
   # Create backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   pg_dump $DATABASE_URL > backup_$DATE.sql
   
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

2. **Cloud Backups**
   - Supabase: Automatic daily backups
   - Railway: Automatic backups
   - PlanetScale: Automatic backups

### Application Backups

1. **Code Repository**
   - Use Git for version control
   - Regular commits and pushes

2. **Environment Variables**
   - Store securely (not in repository)
   - Document all variables

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test connection
   npx prisma db pull
   ```

3. **Environment Variables**
   ```bash
   # Verify variables
   echo $DATABASE_URL
   echo $NEXTAUTH_SECRET
   ```

### Performance Issues

1. **Slow Queries**
   ```sql
   -- Enable query logging
   SET log_statement = 'all';
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   pm2 monit
   ```

## Security Checklist

- [ ] Environment variables are secure
- [ ] Database is properly configured
- [ ] SSL/HTTPS is enabled
- [ ] Authentication is working
- [ ] Rate limiting is configured
- [ ] CORS is properly set
- [ ] Input validation is in place
- [ ] SQL injection protection is active
- [ ] XSS protection is enabled
- [ ] Regular backups are scheduled

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check application logs
   - Monitor performance metrics
   - Review error rates

2. **Monthly**
   - Update dependencies
   - Review security patches
   - Backup verification

3. **Quarterly**
   - Performance optimization
   - Security audit
   - Database maintenance

### Update Process

1. **Development**
   ```bash
   git pull origin main
   npm install
   npm run build
   npm test
   ```

2. **Production**
   ```bash
   # Vercel/Netlify: Automatic
   # Self-hosted:
   git pull origin main
   npm install
   npm run build
   pm2 restart landlord-app
   ```

This deployment guide covers the most common scenarios. Choose the platform that best fits your needs and budget. 