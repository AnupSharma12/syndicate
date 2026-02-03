# Syndicate ESP - Esports Tournament Management Platform

A comprehensive esports tournament management platform built with Next.js, React, and Firebase. Syndicate ESP brings together passionate gamers to compete, connect, and champion their skills in exciting esports tournaments.

## Overview

Syndicate ESP is the ultimate destination for competitive gaming, offering tournament organization, team management, registration systems, and leaderboards for multiple popular games.

## Features

### 🎮 Multi-Game Support
Valorant, Free Fire, Minecraft, PUBG, CS:GO, Apex Legends

### 📋 Tournament Management
- Create and manage tournaments with custom settings
- Set status, prize pools, entry fees, and team limits
- Auto-open tournaments on scheduled dates
- Track registrations in real-time

### 👥 Team Management
- Team registration and squad management
- Leaderboards with ranking system
- Team logo uploads and profiles
- Tournament win tracking

### 📝 Registration System
- Easy tournament registration
- Payment and YouTube proof uploads
- Real-time validation
- Application review workflow

### 🔐 Admin Dashboard
- Tournament and team management
- User and staff role management
- Analytics, settings, audit logs, system health
- Application review system

### 📱 Responsive Design
- Mobile-first with Tailwind CSS
- Fully responsive across all devices
- Dark mode support
- Smooth animations

## Tech Stack

**Frontend**: Next.js 15 + React + TypeScript  
**Styling**: Tailwind CSS + shadcn/ui components  
**Backend**: Firebase (Auth + Firestore)  
**Deployment**: Vercel / Firebase Hosting  

---

## Quick Start (5 Minutes)

### 1. Prerequisites
- Node.js 18+
- Firebase account (free)
- Git

### 2. Clone & Install
```bash
git clone https://github.com/AnupSharma12/syndicate.git
cd syndicate
npm install
```

### 3. Firebase Setup
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password) + **Firestore** (Test Mode)
4. Go to Project Settings → Web App and copy credentials

### 4. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### 5. Run
```bash
npm run dev
# Visit http://localhost:9002
```

### 6. Make Admin
- Register an account on the app
- Go to Firebase Console → Firestore → `users` collection
- Find your email → Edit `role` field → Set to `"admin"`
- Refresh app → Admin dashboard appears!

---

## Detailed Setup Guide

### Prerequisites
- **Node.js 18.0+** - [Download](https://nodejs.org/)
- **npm 9.0+** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - Free at [firebase.google.com](https://firebase.google.com)

### Firebase Project Setup

#### 1. Create Firebase Project
- Visit [console.firebase.google.com](https://console.firebase.google.com)
- Click "Create a project"
- Enter project name
- Accept terms and create

#### 2. Enable Authentication
- Left sidebar → Build → Authentication
- Click "Get Started"
- Select "Email/Password"
- Toggle to Enable
- Save

#### 3. Enable Firestore
- Left sidebar → Build → Firestore Database
- Click "Create Database"
- Start in **Test Mode** (for development)
- Select nearest location
- Create

#### 4. Get Credentials
- Click gear icon (⚙️) → Project Settings
- Scroll to "Your apps" section
- Copy the web config values

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/AnupSharma12/syndicate.git
cd syndicate
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NODE_ENV=development
```

#### 4. Deploy Firestore Rules
- Firebase Console → Firestore Database → Rules
- Replace with content from `firestore.rules`
- Publish

#### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002)

#### 6. Create Admin Account
1. Register account on the app
2. Firebase Console → Firestore → `users` collection
3. Find your email document
4. Edit `role` field: change `"user"` to `"admin"`
5. Refresh app and access admin dashboard

### Quick Start Checklist

- [ ] Node.js 18+ installed and verified
- [ ] Repository cloned locally
- [ ] Dependencies installed (`npm install`)
- [ ] Firebase project created
- [ ] Environment variables configured (`.env.local`)
- [ ] Firestore rules deployed
- [ ] Development server running (`npm run dev`)
- [ ] Admin account created

---

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── admin/             # Admin dashboard
│   ├── about/             # About page
│   ├── teams/             # Teams listing
│   ├── tournaments/        # Tournament details
│   └── [game]/            # Game-specific pages
├── components/            # React components
│   ├── admin/             # Admin-specific features
│   └── ui/                # shadcn/ui components
├── firebase/              # Firebase config & hooks
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & types
└── styles/                # Global CSS & animations
```

---

## Available Commands

```bash
npm run dev       # Start development server (port 9002)
npm run build     # Build for production
npm start         # Run production build
npm run lint      # Run ESLint
npm run typecheck # TypeScript checking
```

---

## Key Pages

- **Home** (`/`) - Landing page with tournaments
- **About** (`/about`) - Platform information
- **Teams** (`/teams`) - Leaderboards and team showcase
- **Tournaments** (`/tournaments/[game]`) - Game-specific tournaments
- **Register** (`/register-event/[id]`) - Tournament registration
- **Admin** (`/admin`) - Management dashboard (staff only)

---

## Admin Dashboard Features

Once you're admin, access:

- **Analytics Dashboard** - Key metrics, registration breakdown, export options
- **Settings Panel** - App configuration, notifications, security settings
- **Audit Logs** - Activity tracking with filters and statistics
- **System Health** - Real-time metrics, performance indicators, alerts
- **User Management** - View and manage users, assign roles
- **Tournament Management** - Create, edit, and manage tournaments
- **Team Management** - Approve registrations, manage teams
- **Application Review** - Review pending team applications

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Firebase credentials error | Check `.env.local` values match Firebase project |
| Port 9002 already in use | `npm run dev -- -p 3000` |
| Firestore permission denied | Ensure rules are published in test mode |
| Admin access denied | Set `role` to `"admin"` in users collection |
| Module not found | `rm -rf node_modules && npm install` |
| Environment variables not loading | Restart dev server after editing `.env.local` |

---

## Contributing

We welcome contributions! Here's how to help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly: `npm run typecheck && npm run lint`
5. Push and create a pull request

### Guidelines
- Keep changes focused and related
- Write clear commit messages
- Follow existing code style
- Test on mobile devices
- Add TypeScript types for new code
- Update documentation if needed

### Code Style
- Use TypeScript for type safety
- Follow React hooks patterns
- Use Tailwind CSS for styling
- Keep components modular and reusable
- Write meaningful comments for complex logic

### Commit Message Format
```
feat: Add new tournament filter
fix: Resolve registration validation issue
docs: Update setup instructions
refactor: Simplify admin layout
```

### Need Help?
- Check [GitHub Issues](https://github.com/AnupSharma12/syndicate/issues)
- Search for similar problems
- Open a new issue with clear description

---

## Security & Best Practices

### Firebase Security
- Email/password authentication with Firestore rules
- Role-based access control (user/staff/admin)
- User data protected - only owner can read/write
- Public tournament viewing allowed
- Admin features restricted to staff accounts

### Environment Variables
- `NEXT_PUBLIC_` variables are visible in browser (safe for public Firebase keys)
- Never commit `.env.local` - it's in `.gitignore`
- Keep admin credentials secure

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Zod for runtime validation
- Component-based architecture
- Firestore security rules enforce data protection

---

## Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Select your repository
4. Add environment variables from `.env.local`
5. Click Deploy

Your app deploys automatically on every push to main!

### Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Deploy Elsewhere
Works with any Node.js hosting (Railway, Render, Heroku, etc.)

---

## Roadmap

Future features:
- [ ] Discord server integration
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Streaming integration (Twitch)
- [ ] AI-powered tournament recommendations
- [ ] Multi-language support

---

## License

MIT License - See [LICENSE](./LICENSE) file for details

**You are free to:**
- ✅ Use for personal or commercial projects
- ✅ Modify and adapt the code
- ✅ Distribute and share
- ✅ Include in private/commercial applications

**With the condition:**
- Include original license
- Credit the original author

---

## Support & Community

- 📧 **Issues**: [GitHub Issues](https://github.com/AnupSharma12/syndicate/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/AnupSharma12/syndicate/discussions)
- 🌐 **Live Site**: [syndicate-beta.vercel.app](https://syndicate-beta.vercel.app)
- 👨‍💻 **Author**: [Anup Sharma](https://www.anupsharma12.com.np)

---

## Contributors

**Created by**: Anup Sharma ([@AnupSharma12](https://github.com/AnupSharma12))

Contributions welcome!

---

**Syndicate ESP** - The ultimate destination for competitive gaming.

Built with ❤️ for the esports community.
