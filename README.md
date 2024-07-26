# Forum Website Backend

This is the backend for a forum website, built with Node.js, Express, and MongoDB. It provides RESTful APIs for user management, discussions, and chat functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/forum-website-backend.git
   cd forum-website-backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and add your environment variables:

   ```sh
   cp .env.example .env
   ```

4. Build the project:
   ```sh
   npm run build
   ```

## Usage

### Development

To start the server in development mode:

```sh
npm run dev
```

### Production

To start the server in production mode:

### Docker

To build and run the Docker container:

```sh
docker-compose up --build
```

## API Endpoints

### User Routes

`GET /externalApi/user/` - Retrieve all users
`GET /externalApi/user/:id` - Retrieve a user by ID
`PUT /externalApi/user/:id` - Update a user by ID

### Discussion Routes

`GET /externalApi/discussion/` - Retrieve all discussions
`POST /externalApi/discussion/` - Create a new discussion

### Chat Routes

`GET /externalApi/chat/` - Retrieve all chat messages
`POST /externalApi/chat/` - Send a new chat message
