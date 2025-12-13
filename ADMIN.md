# Syndicate ESP - Admin Guide

Complete guide for administrators managing Syndicate ESP platform.

## Admin Access

### Becoming an Admin

1. **Staff Role Assignment**:
   - Users can be marked as `staff: true` in the Firestore `users` collection
   - Or use the hardcoded admin email: `anup34343@gmail.com`

2. **Admin Panel Access**:
   - Navigate to `/admin` after logging in
   - Only staff members can access the admin panel
   - Non-staff users will be redirected to the home page

## Admin Dashboard

The admin dashboard provides access to five main management sections:

### 1. Dashboard Overview
- Quick stats and analytics
- Platform overview
- Navigation to other management sections

### 2. User Management
- View all registered users
- Check user details (username, email, staff status)
- Promote/demote users to staff role
- Monitor user activity

**Key Features**:
- User list with filtering
- Email verification status
- Account creation dates
- Staff role management

### 3. Tournament Management
- Create new tournaments
- Edit existing tournaments
- Delete tournaments (with confirmation)
- Manage tournament details:
  - Game title
  - Date and time
  - Status (Open, Closed, Live, Coming Soon)
  - Prize pool
  - Entry fee
  - Maximum teams
  - Game mode and map information
  - Auto-open date (for scheduled tournaments)

**Tournament Lifecycle**:
1. **Create**: Set up tournament with all details
2. **Open**: Accept team registrations
3. **Live**: Tournament is ongoing
4. **Closed**: No more registrations
5. **Coming Soon**: Scheduled to auto-open

### 4. Application Management
- Review team registrations for tournaments
- Three tabs for application status:
  - **All Applications**: All submitted registrations
  - **Pending**: Waiting for approval
  - **Approved**: Already converted to teams

**Application Review**:
- View team information
- Check squad members
- Review payment proof (if applicable)
- Check YouTube proof (if applicable)
- Accept or reject applications
- Delete applications

**Application Details Include**:
- Team name and logo
- Team leader full name and game ID
- WhatsApp contact number
- Squad member list (names and game IDs)
- Registration date
- Payment proof URL
- YouTube proof URL

### 5. Team Management
- Manage official teams on the leaderboard
- Three tabs for team status:

#### Tab 1: Official Teams
- Teams added to the leaderboard
- View team statistics:
  - Name
  - Captain
  - Rank (Unranked, Pro, Elite, Champion)
  - Tournament wins count
- Edit team details
- Delete teams

**Edit Team Details**:
- Team name and logo
- Captain information
- Squad members (with game IDs)
- Rank assignment
- Tournament wins tracking

#### Tab 2: Pending Registrations
- Teams that have registered but not yet added as official teams
- Convert registrations to official teams
- View registration details:
  - Team name
  - Team leader
  - Associated tournament
  - Registration date
- "Add to Teams" button to convert

**Adding Teams from Registrations**:
1. Click "Add to Teams" on a pending registration
2. Review the pre-filled team information
3. Customize team details if needed
4. Confirm and save
5. Team automatically moves to Official Teams

#### Tab 3: Registered Teams (Added)
- Teams that were created from registrations
- View conversion status
- Green "Added" badge indicates successful conversion
- Track which registrations became official teams

## Common Workflows

### Creating a New Tournament

1. Go to **Tournaments** section
2. Click **"Create Tournament"** button
3. Fill in tournament details:
   - Game title
   - Tournament name
   - Date and time
   - Status
   - Prize and fee
   - Max teams
   - Optional game mode/map
4. For scheduled tournaments, set "Auto-Open Date"
5. Click **Save**

### Processing Team Registrations

1. Go to **Applications** → **Pending**
2. Review each application with the eye icon
3. Check team details, payment proof, YouTube proof
4. Click **Approve** to accept or **Reject** to decline
5. If approved, team appears in **Pending Registrations** in Teams section

### Converting Registrations to Official Teams

1. Go to **Teams** → **Pending Registrations**
2. Click **"Add to Teams"** on a registration
3. Form pre-fills with registration data
4. Customize if needed:
   - Adjust squad members if necessary
   - Set initial rank
   - Upload official team logo
5. Click **Save**
6. Team appears in **Official Teams** tab

### Managing Team Roster

1. Go to **Teams** → **Official Teams**
2. Click edit icon on a team
3. Update team information:
   - Squad members (add/remove)
   - Rank status
   - Tournament wins
   - Team logo
4. Save changes

### Removing Duplicate Team Members

**Automatic Handling**: The system automatically prevents team owners from appearing as both captain and squad member:

- During registration: Owner's ID is filtered from squad members
- When creating teams: Owner is deduplicated
- Display: Owner shown separately as "Captain", not in squad list

**Manual Cleanup** (if needed):
1. Edit the team in **Teams** section
2. Review squad members list
3. Remove any duplicates of the captain
4. Save

## Key Admin Features

### Firestore Integration

- **Non-blocking saves**: Changes save asynchronously without page freeze
- **Real-time updates**: Lists update automatically when data changes
- **Batch operations**: Manage multiple items efficiently

### Data Validation

- **Zod schemas**: All form inputs validated client-side
- **Type safety**: TypeScript ensures data integrity
- **Required fields**: Clear validation messages

### Security

- **Staff-only access**: Admin routes protected
- **Merge updates**: Firestore merge prevents data loss
- **Soft deletes**: Confirmations before deletion
- **Activity logging**: All admin actions tracked

## Troubleshooting

### Teams Not Appearing in Pending Applications

**Solution**:
- Check that registrations have `isTeamCreated: false` in Firestore
- Verify teams are in `users/{userId}/registrations` collection
- Clear browser cache and refresh

### Duplicate Team Members

**Solution**:
- Edit the team and manually remove duplicates
- Re-save the team
- Duplicates should not occur in new registrations

### Applications Not Loading

**Solution**:
- Check Firestore connection
- Verify user has staff permissions
- Check browser console for errors
- Refresh the page

### Changes Not Saving

**Solution**:
- Check Firebase connection status
- Verify Firestore rules allow admin writes
- Check browser console for validation errors
- Try the operation again

## Database Structure

### Firestore Collections

```
users/
  {userId}/
    - staff: boolean
    - username: string
    - email: string
    registrations/
      {registrationId}/
        - teamName: string
        - teamLeaderFullName: string
        - squadMembers: SquadMember[]
        - isTeamCreated: boolean
        - ...

events/
  {eventId}/
    - name: string
    - game: string
    - date: string (ISO)
    - status: string
    - prize: number
    - ...

teams/
  {teamId}/
    - name: string
    - captainName: string
    - squadMembers: SquadMember[]
    - rank: string
    - wins: number
    - ...
```

## Performance Tips

1. **Large Datasets**: Admin lists handle hundreds of items efficiently
2. **Real-time Updates**: Changes appear instantly across tabs
3. **Pagination**: Use table scrolling for long lists
4. **Search/Filter**: Use browser find (Ctrl+F) to search lists

## Best Practices

1. **Review Applications Regularly**: Process pending registrations promptly
2. **Verify Payment Proofs**: Always check before approval
3. **Consistent Naming**: Use standardized team names
4. **Rank Management**: Update team ranks based on performance
5. **Regular Backups**: Firestore provides automatic backups
6. **Document Changes**: Keep notes on major admin actions

## Support

For technical issues or feature requests, contact the development team.

---

**Admin Guide for Syndicate ESP** - Professional Tournament Management
