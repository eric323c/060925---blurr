Replit setup

1. Add the following secrets in Replit:
   - JWT_SECRET: a random string
2. Replit will run `npm run replit:start` which builds the frontend (next export)
   and starts the backend server which serves the static frontend and the API.

Note: For production, rotate any PATs and do not commit sqlite DB files to git.
