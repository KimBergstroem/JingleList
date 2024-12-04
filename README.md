# JingleList

## Table of Contents

- [Description](#description)
- [What is this app?](#what-is-this-app)
- [Technologies](#technologies)
  - [Frontend](#frontend)
  - [Backend & Database](#backend--database)
  - [Development Tools & Quality Assurance](#development-tools--quality-assurance)
- [Security Protocols](#security-protocols)
  - [Authentication & Session Management](#authentication--session-management)
  - [Request Protection](#request-protection)
  - [Database Security](#database-security)
  - [Production Security](#production-security)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Description

JingleList is a Christmas app for sharing and updating wish lists with family and friends, keeping surprises intact. 🎄✨

## What is this app?

This is a simple app for sharing and updating wish lists with family and friends, keeping surprises intact. It's perfect for shopping lists. Check off an item from someone else's list when you've bought it, so others know they don't need to buy it.

## Technologies

### Frontend

- Next.js 15.0
- TypeScript
- TailwindCSS
- DaisyUI (Theme: Sunset)

### Backend & Database

- Supabase (PostgreSQL)
- Prisma ORM
- JWT Authentication
- Server Actions

### Development Tools & Quality Assurance

- **ESLint** - JavaScript/TypeScript linting tool

  - Enforces code quality rules
  - Catches potential errors
  - Maintains consistent coding style

- **Prettier** - Code formatter

  - Automatically formats code
  - Ensures consistent code style
  - Supports multiple file types

- **Husky** - Git hooks made easy

  - Runs scripts before commits
  - Prevents bad commits
  - Automates quality checks

- **lint-staged** - Run linters on git staged files
  - Only lints changed files
  - Speeds up validation process
  - Works with Husky for pre-commit checks

These tools work together to maintain high code quality and consistency throughout the project.

## Security Protocols

### Authentication & Session Management

- JWT (JSON Web Tokens) for secure session handling
- Secure HTTP-only cookies
- Session expiration after 7 days
- Password hashing with bcrypt

### Request Protection

- CSRF (Cross-Site Request Forgery) protection
  - Double submit cookie pattern
  - Secure token validation
- Rate limiting
  - 5 attempts per minute for registration
  - 3 attempts per 5 minutes for login
  - IP-based tracking
  - Progressive delays
- Secure headers
  - HTTP-only cookies
  - Secure flag (HTTPS only)
  - Strict same-site policy

### Database Security

- Supabase PostgreSQL with row-level security
- Prisma ORM for safe database queries
- Environment variables for sensitive data
- Secure connection pooling
- Automated backups

### Production Security

- Vercel deployment with environment protection
- HTTPS enforcement
- Secure cookie handling in production
- Database connection pooling

## Features

- Authentication with JWT
- Database powered by Supabase
- Manage wish lists
  - Add, edit, and remove wish lists
  - Real-time updates
  - Secure data access

## Installation

1. Clone this repo:
   ```bash
   git clone https://github.com/KimBergstroem/jingelist.git
   ```
2. Navigate to the project directory:
   ```bash
   cd jingelist
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```env
   DATABASE_URL=your_supabase_connection_string
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SESSION_SECRET=your_session_secret
   ```

## Usage

### Environment Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your environment variables in `.env`:

   ```env
   # Database (Supabase)
   DATABASE_URL=your_supabase_connection_string

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Session Security
   SESSION_SECRET=your_secure_random_string
   ```

### Development

- Start the development server:
  ```bash
  npm run dev
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser

### Production

- Build for production:
  ```bash
  npm run build
  ```
- Start production server:
  ```bash
  npm start
  ```

### Database

- Push schema changes to database:
  ```bash
  npx prisma db push
  ```
- Update Prisma client:
  ```bash
  npx prisma generate
  ```

## Database Schema

The application uses Supabase PostgreSQL with the following main tables:

- Users (Authentication and profiles)
- Wishlists (User's wish lists)
- WishlistItems (Individual items in lists)

## Contributing

If you want to contribute to the project, please follow these steps:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Send a pull request.

## License

This project is licensed under the MIT license.
