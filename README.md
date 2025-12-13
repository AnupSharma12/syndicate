# Syndicate ESP - Esports Tournament Management Platform

A comprehensive esports tournament management platform built with Next.js, React, and Firebase. Syndicate ESP brings together passionate gamers to compete, connect, and champion their skills in exciting esports tournaments.

## Overview

Syndicate ESP is the ultimate destination for competitive gaming, offering tournament organization, team management, registration systems, and leaderboards for multiple popular games.

## Features

### 🎮 Multi-Game Support
- Valorant
- Free Fire
- Minecraft
- PUBG
- CS:GO
- Apex Legends

### 📋 Tournament Management
- Create and manage tournaments for different games
- Set tournament status (Open, Closed, Live, Coming Soon)
- Define prize pools, entry fees, and team limits
- Auto-open tournaments on scheduled release dates
- Track registered teams and participant engagement

### 👥 Team Management
- Team registration and creation
- Squad member management
- Team leaderboards with ranking system (Unranked, Pro, Elite, Champion)
- Team logo uploads
- Track tournament wins

### 📝 Registration System
- Easy team registration for tournaments
- Squad member management with game IDs
- Payment proof upload support
- YouTube proof submission
- Real-time registration tracking

### 🔐 Admin Dashboard
- Comprehensive admin panel for tournament management
- User management and staff roles
- Application review system
- Team management with registration tracking
- Tournament statistics and analytics

### 📱 Responsive Design
- Mobile-first design approach
- Fully responsive across all devices
- Dark/Light theme support with Tailwind CSS
- Smooth animations and transitions

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: Firebase hooks

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: imgbb for image uploads
- **Rules**: Firestore security rules

### Deployment
- **Platform**: Firebase App Hosting / Vercel
- **Environment**: Node.js runtime

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project setup
- Firebase credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/AnupSharma12/syndicate.git
cd syndicate
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
- Create a `src/firebase/config.ts` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── about/             # About page
│   ├── teams/             # Teams listing
│   ├── tournaments/        # Tournament details
│   ├── register-event/     # Tournament registration
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── admin/             # Admin-specific components
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature-specific components
├── firebase/              # Firebase configuration and hooks
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and data types
└── styles/                # Global CSS
```

## Key Pages

- **Home** (`/`) - Landing page with tournament browser
- **About** (`/about`) - Information about Syndicate ESP
- **Teams** (`/teams`) - Leaderboard and team showcase
- **Tournaments** (`/tournaments/[game]`) - Game-specific tournaments
- **Register** (`/register-event/[id]`) - Tournament registration
- **Admin** (`/admin`) - Admin dashboard (staff only)

## Features in Detail

### Tournament Registration
- Teams can register for tournaments with full squad management
- Automatic deduplication of team owner in members list
- Support for payment proof and YouTube proof submissions
- Real-time validation and error handling

### Team Management (Admin)
- View pending applications from registered teams
- Convert registrations to official teams
- Manage team rankings and statistics
- Track tournament wins and team history

### Admin Dashboard
Multiple management sections:
- **Users**: Manage platform users and staff roles
- **Tournaments**: Create and manage tournaments
- **Applications**: Review and approve team registrations
- **Teams**: Manage official teams with three tabs:
  - Official Teams: Teams in the leaderboard
  - Pending Registrations: Teams awaiting approval
  - Registered Teams: Teams converted from applications

## Security

- Firebase Authentication for user management
- Role-based access control (Staff/Admin)
- Firestore security rules for data protection
- Email verification for registrations
- Payment proof verification workflow

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Zod for runtime validation
- Component-based architecture

## Contributors

**Created by**: [Anup Sharma](https://www.anupsharma12.com.np)

## License

This project is proprietary and confidential.

## Support

For support, please contact the development team or visit the Syndicate ESP website.

---

**Syndicate ESP** - The ultimate destination for competitive gaming.
