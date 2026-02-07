# Inventory Management System - Frontend

A modern, responsive React frontend for the Inventory Management System.

## Features

### 🔐 Authentication & Authorization
- Role-based access control (Master Admin, Admin, Employee)
- JWT token-based authentication
- Protected routes

### 👥 Master Admin Features
- User management (Create, View, Delete, Restore users)
- User summary dashboard
- Role-based user filtering

### 📦 Admin Features
- Product management (CRUD operations)
- Stock In/Out operations
- Inventory reports and analytics
- Category-wise analysis
- Low stock alerts
- Employee management

### 👷 Employee Features
- View products
- Stock In/Out operations
- Transaction history with filters
- Inventory summary reports
- Low stock alerts

## Tech Stack

- **React 18** - UI Library
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **React Icons** - Icon Library
- **React Toastify** - Notifications
- **Vite** - Build Tool

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   └── PrivateRoute.jsx
│   ├── pages/            # Page components
│   │   ├── MasterAdmin/  # Master Admin pages
│   │   ├── Admin/        # Admin pages
│   │   ├── Employee/     # Employee pages
│   │   └── Login.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   ├── App.jsx           # Main App component
│   ├── App.css           # Global styles
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Integration

The frontend connects to the backend API running on `http://localhost:8080`. The API base URL can be configured in `vite.config.js`.

### API Endpoints Used

#### Authentication
- `POST /api/auth/login` - User login

#### Master Admin
- `GET /api/master-admin/users` - Get all users
- `POST /api/master-admin/users` - Create user
- `DELETE /api/master-admin/users/{id}` - Delete user
- `POST /api/master-admin/users/{id}/restore` - Restore user
- `GET /api/master-admin/users/summary` - User summary

#### Admin
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `POST /api/admin/stock/in` - Stock in
- `POST /api/admin/stock/out` - Stock out
- `GET /api/admin/reports/*` - Various reports

#### Employee
- `GET /api/employee/products` - View products
- `POST /api/employee/stock/in` - Stock in
- `POST /api/employee/stock/out` - Stock out
- `GET /api/employee/transactions` - View transactions
- `GET /api/employee/reports/*` - View reports

## Features in Detail

### Dashboard Overview
- Real-time statistics
- Visual data representations
- Quick access to important metrics

### Product Management
- Add new products with SKU generation
- Update product information
- Soft delete with restore capability
- Search and filter functionality

### Stock Management
- Intuitive stock in/out interface
- Product search with autocomplete
- Real-time stock updates
- Transaction notes

### Reports & Analytics
- Bar charts for category distribution
- Pie charts for value analysis
- Low stock alerts
- Category-wise summaries

### User Management
- Create users with auto-generated passwords
- Role assignment
- User status tracking
- Soft delete functionality

## Styling

The application uses a modern, gradient-based design with:
- Responsive layout
- Smooth animations
- Intuitive color coding
- Mobile-friendly interface

## Security

- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Automatic logout on 401 responses
- Role-based route protection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test thoroughly before committing

## License

This project is part of the Inventory Management System.
