# Full-Stack-Restaurant-App
This README provides an overview of the E-commerce Website project, its features, and instructions for setting up and running the application.

### => [ Check It Out ](https://drab-deer-garb.cyclic.app)

# Introduction
- I have created restaurant app which is single vendor app. <br>
- It has four categories of food Chinese, Desi, Fast Food and Italian.<br>
- It also contains Sweets and Beverage.<br>

## User Roles

### Guest

- Unauthenticated visitors who can browse products.

### User

- Authenticated customers who can:
  - Add products to a cart
  - Place orders
  - Track orders

### Admin

- Authenticated administrators with access to:
  - Product management
  - Order tracking

## Authentication

- User registration and login are implemented using JWT for secure authentication.
- Passwords are securely hashed and salted before storing them in the database for enhanced security.

## Product Management

- A user-friendly interface allows for:
  - Adding
  - Editing
  - Deleting products.
- Categories and brands are used to organize products.
- Sorting and filtering options are provided for an improved user experience.

## Image Uploading

- Firebase is integrated for image storage.
- Image uploading is supported for brands, categories, and products.
- Multiple image uploads are implemented for products.

## Order Placement

- Users can:
  - Add products to their cart
  - Place orders
  - A unique tracking ID is generated for each order.
  - Order details are stored in the database for future reference.

## Email Notifications

- Admins are notified via email when an order is placed, including the tracking ID.
- Nodemailer or a similar service is used to send emails.

## User Order Tracking

- Users can track their orders using the provided tracking ID.
- A user-friendly interface is implemented to display order status and progress.


# E-commerce App Technical Implementation
## Frontend (React.js)

- Components have been created for:
  - User registration
  - User login
  - Product listing
  - Cart management
  - Order placement
  - Order tracking

- Routing is utilized to manage different user roles and navigation within the application.

- Firebase SDK is integrated for image uploading, enabling users to upload product images easily.

## Backend (Node.js and Express.js)

- RESTful APIs have been developed for various functionalities:
  - User authentication
  - Product management
  - Order placement
  - Order tracking

- JWT (JSON Web Tokens) are used for token-based authentication, enhancing security.

## Database (MongoDB)

- The database schema has been designed for key entities, including:
  - Users
  - Menu
  - Orders
  - Categories

## Firebase Integration

- A Firebase project has been set up to handle image storage.

- Firebase SDK is integrated into the backend to manage image uploads seamlessly.

## Email Notification

- Nodemailer or a similar library is used to send email notifications to admin and users.

- Templates for order confirmation and tracking emails have been created, ensuring effective communication with users.


