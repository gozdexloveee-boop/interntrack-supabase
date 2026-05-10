# InternTrack

InternTrack is a full-stack internship application tracking dashboard built for students to manage internship applications, deadlines, interviews, offers, rejections, and follow-ups in one organized place.

## Live Demo

https://interntrack-supabase.vercel.app

## Features

- User signup and login with Supabase Auth
- Email confirmation for new users
- User-specific private internship records
- Add, edit, and delete internship applications
- Track application status such as Applied, Shortlisted, Interview Scheduled, Rejected, and Offer Received
- Search applications by company, role, or location
- Filter applications by status
- Sort applications by newest, deadline, or company
- Dashboard overview with application statistics
- Analytics charts for application status and weekly activity
- Recent activity timeline
- Clean and responsive SaaS-style UI
- Deployed on Vercel

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Supabase
- Supabase Auth
- Supabase PostgreSQL Database
- Row Level Security
- Recharts
- Framer Motion
- Lucide React
- Vercel

## How It Works

InternTrack uses Supabase Authentication for signup, login, logout, and email confirmation.

Each internship application is stored in a Supabase database table with a user_id. Row Level Security makes sure that each user can only access their own application data.

The React frontend communicates with Supabase using the Supabase JavaScript client. The application data is used to update the dashboard cards, charts, application table, and recent activity section.

## Main Pages

- Overview
- Applications
- Analytics
- Activity

## Core Functionalities

- Authentication
- Email confirmation
- Create application
- View applications
- Edit application
- Delete application
- Search applications
- Filter applications
- Sort applications
- View analytics
- Track recent activity

## Security

The project uses Supabase Row Level Security so that:

- Users can only view their own applications
- Users can only insert their own applications
- Users can only update their own applications
- Users can only delete their own applications

## What I Learned

While building this project, I learned how to:

- Create a React project using Vite
- Build a clean dashboard UI using Tailwind CSS
- Connect React with Supabase
- Implement authentication and email confirmation
- Store and manage data using Supabase PostgreSQL
- Use Row Level Security for private user data
- Build CRUD functionality
- Add charts using Recharts
- Add routing using React Router DOM
- Deploy a React project on Vercel
- Manage environment variables securely

## Future Improvements

- Add resume upload tracking
- Add deadline reminders
- Add profile settings
- Add password reset flow
- Add export to CSV
- Add better mobile responsiveness
- Add notification reminders for follow-ups

## Author

Built by Harshini.

GitHub: https://github.com/gozdexloveee-boop  
Live Project: https://interntrack-supabase.vercel.app
