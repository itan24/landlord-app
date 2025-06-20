# 🏠 Landlord Management App

A modern, responsive web application for landlords to manage their properties, tenants, and bills efficiently. Built with Next.js 14, featuring a beautiful UI with advanced animations and dark/light theme support.

## ✨ Features

### 🎨 User Interface
- **Modern Design**: Glassmorphism cards with hover effects and smooth animations
- **Theme Support**: Light and dark mode with automatic system preference detection
- **Responsive Design**: Mobile-first approach with hamburger navigation
- **Advanced Animations**: Floating particles, wave effects, and pulse glows
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

### 👥 Tenant Management
- **Profile Creation**: Add new tenant profiles with detailed information
- **Profile Viewing**: View individual tenant details with organized sections
- **Profile Editing**: Update tenant information and contact details
- **Profile Deletion**: Remove tenant profiles with confirmation

### 💰 Bill Management
- **Bill Creation**: Add new bills with amount, due date, and description
- **Bill Tracking**: View all bills with status indicators (paid/unpaid)
- **Bill Updates**: Mark bills as paid or update bill information
- **Bill History**: Track payment history and outstanding amounts

### 🔐 Authentication & Security
- **NextAuth.js Integration**: Secure authentication with multiple providers
- **Session Management**: Persistent user sessions with automatic refresh
- **Protected Routes**: Middleware-based route protection
- **Role-based Access**: Different permissions for different user types

### 📊 Dashboard
- **Overview Statistics**: Quick view of properties, tenants, and bills
- **Recent Activity**: Latest updates and notifications
- **Quick Actions**: Fast access to common tasks
- **Data Visualization**: Charts and graphs for financial insights

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation

### Backend & Database
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Reliable relational database
- **NextAuth.js**: Authentication framework
- **Next.js API Routes**: Serverless API endpoints

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **TypeScript**: Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd landlord-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/landlord_app"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed database with sample data
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
landlord-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bills/         # Bill management API
│   │   └── profiles/      # Profile management API
│   ├── dashboard/         # Dashboard page
│   ├── profiles/          # Profile pages
│   └── add-profile/       # Add profile page
├── components/            # Reusable React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   └── AnimatedBackground.tsx
├── lib/                  # Utility functions and configurations
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database utilities
│   └── utils.ts         # Helper functions
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎯 Usage Guide

### Adding a New Tenant
1. Navigate to the "Add Profile" page
2. Fill in tenant information (name, contact, property details)
3. Submit the form to create the profile
4. View the new profile in the profiles list

### Managing Bills
1. Go to the Bills section
2. Click "Add New Bill" to create a bill
3. Fill in bill details (amount, due date, description)
4. Mark bills as paid when tenants submit payments
5. Track payment history and outstanding amounts

### Dashboard Overview
- View total number of properties and tenants
- See recent bill activity
- Access quick actions for common tasks
- Monitor financial summaries

## 🔒 Security Features

- **Authentication**: Secure login with NextAuth.js
- **Authorization**: Route protection with middleware
- **Data Validation**: Input validation with Zod schemas
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js CSRF tokens

## 🎨 Customization

### Themes
The app supports light and dark themes. Users can toggle between themes using the theme toggle button in the navigation.

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

### Animations
Advanced animations are implemented in `components/AnimatedBackground.tsx` and can be customized by modifying the CSS animations.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables
3. Deploy the `out` directory or use `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

## 🔄 Changelog

### Version 1.0.0
- Initial release with core features
- Tenant profile management
- Bill tracking system
- Responsive design with animations
- Authentication system
- Dashboard with statistics

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
