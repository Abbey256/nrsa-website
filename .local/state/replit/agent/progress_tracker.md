[x] 1. Install the required packages
[x] 2. Restart the workflow to see if the project is working
[x] 3. Verify the project is working using the feedback tool
[x] 4. Inform user the import is completed and they can start building, mark the import as completed using the complete_project_import tool
[x] 5. Fix admin portal CRUD operations - standardized to use React Query + Toast
[x] 6. Add Event registration link functionality
[x] 7. Add Media category dropdown with specific options
[x] 8. Remove Contact Club button from frontend
[x] 9. Format backend routes for consistency
[x] 10. Add role-based access system (super-admin vs admin)
[x] 11. Install and configure express-rate-limit for security
[x] 12. Create Manage Admins page with full role-based permissions
[x] 13. Update auth middleware to support role-based permissions
[x] 14. Ensure all secrets are in environment variables for deployment

## Migration Summary

### What Was Fixed:
1. **Dependencies**: Installed all npm packages successfully including express-rate-limit
2. **TypeScript Errors**: Fixed type mismatches in server files (storage.ts, auth.ts, createAdmin.ts)
3. **ES Module Issues**: Fixed require() statements to use proper ES6 imports
4. **Database**: Provisioned PostgreSQL database and pushed schema successfully with role column
5. **Admin Creation**: Implemented automatic super-admin user creation on server startup
6. **Routing**: Fixed 404 errors by flattening route structure in App.tsx
7. **Security**: Removed insecure /api/admin/setup endpoint, added environment variable support
8. **Admin Management**: ✨ Added role-based admin management system with super-admin privileges
9. **Complete CRUD**: ✨ Added missing update/delete operations for Affiliations, Contacts, and Site Settings
10. **Date Handling**: ✨ Fixed event and news schemas to accept ISO date strings from frontend
11. **Code Documentation**: ✨ Added comprehensive comments to auth, upload, and admin management code
12. **Admin Leaders Portal**: ✨✨ Created proper admin Leaders CRUD page following the same pattern as other admin pages
13. **Schema Coercion**: ✨✨ Added proper numeric coercion for 'order' fields in leaders, heroSlides, and affiliations schemas
14. **Admin Login UX**: ✨✨ Improved admin login with proper HTML form element and role storage
15. **Rate Limiting**: ✨✨✨ Added express-rate-limit to protect against brute force attacks (5 login attempts per 15 min, 100 API requests per 15 min)
16. **Role-Based Access Control**: ✨✨✨ Implemented super-admin and admin roles with proper permission enforcement

### Default Admin Credentials:
- Email: admin1@nrsa.com.ng
- Password: adminpassme2$
- Role: super-admin

### Security Improvements:
- JWT authentication with 8-hour token expiry
- Password hashing with bcrypt (10 rounds)
- Environment variable support for production credential override
- All admin routes protected via JWT token check in AdminLayout
- Authorization header automatically included in all API requests
- **NEW:** Rate limiting on login endpoint (5 attempts per 15 min)
- **NEW:** Rate limiting on all API endpoints (100 requests per 15 min)
- **NEW:** Role-based access control (super-admin can manage admins, admin has limited access)
- **NEW:** JWT tokens include role information for authorization

### Backend API Endpoints Working:
- POST /api/admin/login - Admin authentication with rate limiting
- GET /api/admins - List all admin accounts (admin only)
- POST /api/admins - Create new admin accounts (super-admin only)
- DELETE /api/admins/:id - Delete admin accounts (super-admin only, cannot delete self)
- **Complete CRUD operations** for all entities:
  - Events: Create, Read, Update, Delete
  - Players: Create, Read, Update, Delete
  - Clubs: Create, Read, Update, Delete
  - News: Create, Read, Update, Delete
  - Hero Slides: Create, Read, Update, Delete
  - Media: Create, Read, Update, Delete
  - Affiliations: Create, Read, Update, Delete
  - Contacts: Create, Read, Update, Delete
  - Site Settings: Create, Read, Update, Delete
  - Leaders: Create, Read, Update, Delete
  - Admins: Create, Read, Delete (super-admin only)
- POST /api/upload - Image upload with validation (5MB limit, images only)

### Frontend Routes Working:
- /admin/login - Admin login page with role support
- /admin-nrsa-dashboard - Main dashboard
- /admin-nrsa-dashboard/admins - **NEW:** Manage Admins page (super-admin only)
- All admin sub-routes with full CRUD functionality

### Role-Based Permissions:
- **Super Admin**: Full access to all features including admin management
- **Admin**: Access to all content management but cannot create/delete other admins

### Environment Variables for Production:
- DATABASE_URL - PostgreSQL connection string (configured for Render)
- ADMIN_EMAIL - Override default admin email
- ADMIN_PASSWORD - Override default admin password  
- ADMIN_NAME - Override default admin name
- JWT_SECRET - Set custom JWT secret (currently using dev default, should be set in production)

### Deployment Readiness:
- Frontend configured for deployment on Replit
- Backend API configured for deployment on Render (DATABASE_URL points to Render PostgreSQL)
- Custom domain ready: nrsa.com.ng
- All secrets should be configured in production environment
- Rate limiting configured to protect production endpoints
- Role-based access control ensures proper admin management in production
