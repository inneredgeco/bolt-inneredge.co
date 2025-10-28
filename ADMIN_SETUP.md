# Admin Authentication Setup

## Overview

Your site now has a secure authentication system using Supabase Auth. The admin panel at `inneredge.co/admin` is protected and requires login.

## Admin User

An admin user has already been created in your Supabase database:

**Email:** `admin@inner-edge.com`

## Setting the Admin Password

You need to set a password for the admin user. You can do this in two ways:

### Option 1: Through Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Find the user with email `admin@inner-edge.com`
5. Click on the user
6. Click **"Reset Password"** and set a new password

### Option 2: Create a New Admin User

If you prefer to use a different email, you can create a new admin user:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"**
4. Enter your preferred email and password
5. Enable **"Auto Confirm User"** to skip email verification

## How to Access Admin Panel

1. Visit: `https://inneredge.co/login`
2. Enter your admin email and password
3. Click **Login**
4. You'll be redirected to the admin panel at `/admin`

## Security Features

✅ **Supabase Auth** - Industry-standard authentication
✅ **Protected Routes** - Unauthorized users are redirected to login
✅ **Persistent Sessions** - Stay logged in across browser sessions
✅ **Secure Logout** - Properly clears authentication state

## Logout

To logout, simply click the **"Logout"** button in the top-right corner of the admin panel.

## Troubleshooting

### "Invalid email or password" error

- Double-check your email and password
- Make sure you've set a password for the user in Supabase Dashboard
- Verify the user is confirmed (not pending email verification)

### Redirected to login page when accessing /admin

This is expected behavior if you're not logged in. Simply login at `/login` first.

### Session expires

Sessions are managed by Supabase and last for a configurable time. If your session expires, you'll need to login again.
