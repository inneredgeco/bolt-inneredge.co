# Admin Authentication Setup

## Overview

Your site now has a secure authentication system using Supabase Auth. The admin panel at `inneredge.co/admin` is protected and requires login.

## Admin Credentials

An admin user has already been created with a password:

**Email:** `admin@inneredge.co`
**Password:** `innerwork2024`

⚠️ **IMPORTANT:** Change this password immediately after your first login for security reasons.

## Changing Your Password

To change your password after logging in:

1. Log into your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Find the user with email `admin@inneredge.co`
5. Click on the user
6. Update the password to something secure and unique

Or you can ask me to update the password directly.

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
