This is a simple Blog API built with Node.js, Express, and MongoDB. The API supports user authentication, CRUD operations for blog posts, and a commenting system.

Features
  User registration and authentication
  Create, read, update, and delete (CRUD) operations for blog posts
  Commenting system for posts
  Like and unlike posts
  JWT-based authentication
  
Technologies Used
  Node.js
  Express
  MongoDB
  Mongoose
  JWT (JSON Web Tokens)
  Bcryptjs
  dotenv
  
Getting Started
Prerequisites

Make sure you have the following installed:
Node.js (v18 or higher)
MongoDB (local or cloud-based)

Installation
Clone the repository
nstall the dependencies : npm install
modify .env file :
          PORT=5000
          MONGO_URI=your_mongo_connection_string
          JWT_SECRET=your_jwt_secret
Start the server:  npm run start


API Endpoints

//////////////////////////      Auth     ////////////////////////////////////
Register User:  POST /api/auth/register
                {
                  "name": "prabhat kumar",
                  "email": "prabhatkumar@example.com",
                  "password": "password123"
                }
                
Login User :   POST /api/auth/login
               {
                  "email": "prabhatkumar@example.com",
                  "password": "password123"
                }

Get Authenticated User: GET /api/auth
        headers:{
                  "x-auth-token": "your_jwt_token"
                }

/////////////////////////////////       Posts       /////////////////////////////////////

Create Post:   POST /api/posts
              headers:{
                        "x-auth-token": "your_jwt_token"
                      }
              body:{
                      "title": "Post Title",
                      "content": "Post content goes here"
                    }

Get All Posts:   GET /api/posts

Get Post by ID:  GET /api/posts/:id

Update Post:     PUT /api/posts/:id
              headers:{
                        "x-auth-token": "your_jwt_token"
                      }
              body:{
                      "title": "New Post Title",
                      "content": "New Post content goes here"
                    }
Delete Post:    DELETE /api/posts/:id
              headers:{
                        "x-auth-token": "your_jwt_token"
                      }

Like Post:       PUT /api/posts/like/:id
               headers:{
                        "x-auth-token": "your_jwt_token"
                      }

Unlike Post:     PUT /api/posts/unlike/:id
               headers:{
                        "x-auth-token": "your_jwt_token"
                      }


/////////////////////////////////////       Comments      ///////////////////////////////////
Add Comment:     POST /api/posts/:postId/comments
               headers:{
                          "x-auth-token": "your_jwt_token"
                        }
                body:{
                        "content": "Comment content goes here"
                      }

Delete Comment:   DELETE /api/posts/:postId/comments/:commentId
                  headers:{
                        "x-auth-token": "your_jwt_token"
                      }




//////////////////////////////   PROJECT STRUCTURE //////////////////////////////////////
              ├── .env
              ├── package.json
              ├── server.js
              ├── config
              │   └── db.js
              ├── models
              │   ├── User.js
              │   ├── Post.js
              │   └── Comment.js
              ├── routes
              │   ├── auth.js
              │   ├── posts.js
              │   └── comments.js
              └── middleware
                  └── authMiddleware.js







