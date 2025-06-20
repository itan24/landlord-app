# API Documentation

This document provides detailed information about all API endpoints in the Landlord Management App.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All API endpoints require authentication unless specified otherwise. Include the session token in your requests.

## Endpoints

### Authentication

#### GET `/api/auth/[...nextauth]`
NextAuth.js authentication endpoints for login, logout, and session management.

**Available Routes:**
- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get current session
- `/api/auth/csrf` - CSRF token

### Profiles

#### GET `/api/profiles`
Get all tenant profiles.

**Response:**
```json
{
  "profiles": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "propertyAddress": "123 Main St",
      "rentAmount": 1500,
      "leaseStartDate": "2024-01-01",
      "leaseEndDate": "2024-12-31",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/profiles`
Create a new tenant profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "propertyAddress": "123 Main St",
  "rentAmount": 1500,
  "leaseStartDate": "2024-01-01",
  "leaseEndDate": "2024-12-31"
}
```

**Response:**
```json
{
  "profile": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "propertyAddress": "123 Main St",
    "rentAmount": 1500,
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2024-12-31",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/profiles/[id]`
Get a specific tenant profile by ID.

**Parameters:**
- `id` (string) - Profile ID

**Response:**
```json
{
  "profile": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "propertyAddress": "123 Main St",
    "rentAmount": 1500,
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2024-12-31",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT `/api/profiles/[id]`
Update a tenant profile.

**Parameters:**
- `id` (string) - Profile ID

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "propertyAddress": "123 Main St",
  "rentAmount": 1600,
  "leaseStartDate": "2024-01-01",
  "leaseEndDate": "2024-12-31"
}
```

**Response:**
```json
{
  "profile": {
    "id": "1",
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567890",
    "propertyAddress": "123 Main St",
    "rentAmount": 1600,
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2024-12-31",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE `/api/profiles/[id]`
Delete a tenant profile.

**Parameters:**
- `id` (string) - Profile ID

**Response:**
```json
{
  "message": "Profile deleted successfully"
}
```

### Bills

#### GET `/api/bills`
Get all bills.

**Response:**
```json
{
  "bills": [
    {
      "id": "1",
      "profileId": "1",
      "amount": 1500,
      "dueDate": "2024-01-15",
      "description": "January Rent",
      "isPaid": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "profile": {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### POST `/api/bills`
Create a new bill.

**Request Body:**
```json
{
  "profileId": "1",
  "amount": 1500,
  "dueDate": "2024-01-15",
  "description": "January Rent"
}
```

**Response:**
```json
{
  "bill": {
    "id": "1",
    "profileId": "1",
    "amount": 1500,
    "dueDate": "2024-01-15",
    "description": "January Rent",
    "isPaid": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/bills/[id]`
Get a specific bill by ID.

**Parameters:**
- `id` (string) - Bill ID

**Response:**
```json
{
  "bill": {
    "id": "1",
    "profileId": "1",
    "amount": 1500,
    "dueDate": "2024-01-15",
    "description": "January Rent",
    "isPaid": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "profile": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### PUT `/api/bills/[id]`
Update a bill.

**Parameters:**
- `id` (string) - Bill ID

**Request Body:**
```json
{
  "profileId": "1",
  "amount": 1600,
  "dueDate": "2024-01-15",
  "description": "January Rent Updated",
  "isPaid": true
}
```

**Response:**
```json
{
  "bill": {
    "id": "1",
    "profileId": "1",
    "amount": 1600,
    "dueDate": "2024-01-15",
    "description": "January Rent Updated",
    "isPaid": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE `/api/bills/[id]`
Delete a bill.

**Parameters:**
- `id` (string) - Bill ID

**Response:**
```json
{
  "message": "Bill deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Data Models

### Profile
```typescript
interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  rentAmount: number;
  leaseStartDate: string;
  leaseEndDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### Bill
```typescript
interface Bill {
  id: string;
  profileId: string;
  amount: number;
  dueDate: string;
  description: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per user session

## CORS

CORS is enabled for the following origins:
- `http://localhost:3000` (development)
- `https://your-domain.com` (production)

## Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Example curl commands

```bash
# Get all profiles
curl -X GET http://localhost:3000/api/profiles

# Create a new profile
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "propertyAddress": "123 Main St",
    "rentAmount": 1500,
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2024-12-31"
  }'

# Get a specific profile
curl -X GET http://localhost:3000/api/profiles/1

# Update a profile
curl -X PUT http://localhost:3000/api/profiles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567890",
    "propertyAddress": "123 Main St",
    "rentAmount": 1600,
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2024-12-31"
  }'

# Delete a profile
curl -X DELETE http://localhost:3000/api/profiles/1
``` 