# 📡 API DOCUMENTATION

Base URL: `http://localhost:5000/api` (Development)
Production: `https://your-backend.onrender.com/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response: 201 Created
{
  "message": "User created successfully"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@aleen.com",
  "password": "admin123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@aleen.com",
    "name": "Admin"
  }
}
```

---

## 📦 Product Endpoints

### Get All Products
```http
GET /products
Authorization: Bearer <token>

Query Parameters:
- search (optional): Search by product name
- category (optional): Filter by category (Saree, Kurti, Lehenga, etc.)
- lowStock (optional): true/false - Filter low stock items

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Red Silk Saree",
    "category": "Saree",
    "size": "Free Size",
    "color": "Red",
    "costPrice": 1500,
    "sellingPrice": 2500,
    "stock": 10,
    "imageUrl": "https://res.cloudinary.com/...",
    "lowStockAlert": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- name: "Red Silk Saree"
- category: "Saree"
- size: "Free Size"
- color: "Red"
- costPrice: 1500
- sellingPrice: 2500
- stock: 10
- image: <file> (optional)

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Red Silk Saree",
  ...
}
```

### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data: (same as create, all fields optional)

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Red Silk Saree",
  ...
}
```

### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Product deleted"
}
```

---

## 🛒 Sales Endpoints

### Create Sale
```http
POST /sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerName": "Priya Sharma",
  "customerPhone": "+919876543210",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Red Silk Saree",
      "price": 2500,
      "costPrice": 1500,
      "quantity": 2
    }
  ],
  "subtotal": 5000,
  "gstRate": 5,
  "gstAmount": 250,
  "discount": 100,
  "total": 5150
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439012",
  "invoiceNumber": "INV1704067200000",
  "customerName": "Priya Sharma",
  "customerPhone": "+919876543210",
  "items": [...],
  "subtotal": 5000,
  "gstRate": 5,
  "gstAmount": 250,
  "discount": 100,
  "total": 5150,
  "profit": 2000,
  "saleDate": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}

Errors:
- 400: Insufficient stock for product
```

### Get All Sales
```http
GET /sales
Authorization: Bearer <token>

Query Parameters:
- startDate (optional): ISO date string
- endDate (optional): ISO date string

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "invoiceNumber": "INV1704067200000",
    ...
  }
]
```

### Get Sale by ID
```http
GET /sales/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439012",
  "invoiceNumber": "INV1704067200000",
  ...
}
```

---

## 📊 Reports Endpoints

### Get Dashboard Data
```http
GET /reports/dashboard
Authorization: Bearer <token>

Query Parameters:
- startDate (optional): ISO date string
- endDate (optional): ISO date string

Response: 200 OK
{
  "totalSales": 50000,
  "totalProfit": 20000,
  "itemsSold": 45,
  "categoryStats": {
    "Saree": 20,
    "Kurti": 15,
    "Lehenga": 10
  },
  "topProducts": [
    {
      "name": "Red Silk Saree",
      "quantity": 15
    }
  ],
  "lowStockItems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Blue Cotton Kurti",
      "stock": 3,
      "category": "Kurti"
    }
  ],
  "salesData": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "total": 5150,
      "profit": 2000,
      "saleDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message"
}
```

---

## Data Models

### User
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  role: string (default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  name: string,
  category: 'Saree' | 'Kurti' | 'Lehenga' | 'Dupatta' | 'Salwar' | 'Other',
  size: string,
  color: string,
  costPrice: number,
  sellingPrice: number,
  stock: number,
  imageUrl: string,
  lowStockAlert: boolean (auto-calculated: stock < 5),
  createdAt: Date,
  updatedAt: Date
}
```

### Sale
```typescript
{
  _id: ObjectId,
  invoiceNumber: string (unique),
  customerName: string,
  customerPhone: string,
  items: [
    {
      productId: ObjectId,
      name: string,
      quantity: number,
      price: number,
      costPrice: number
    }
  ],
  subtotal: number,
  gstRate: number,
  gstAmount: number,
  discount: number,
  total: number,
  profit: number (auto-calculated),
  saleDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Rate Limiting (Recommended for Production)

Add to server.js:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aleen.com","password":"admin123"}'
```

### Get Products
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Test Saree" \
  -F "category=Saree" \
  -F "size=Free Size" \
  -F "color=Red" \
  -F "costPrice=1000" \
  -F "sellingPrice=2000" \
  -F "stock=10"
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "Aleen Clothing API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@aleen.com\",\"password\":\"admin123\"}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```
