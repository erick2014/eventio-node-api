import express from 'express';
import * as dotenv from 'dotenv'
dotenv.config()
import routes from './src/routes/index.js';
import initDb from './config/db/setup.js';

const app = express();
// initialize db connection
await initDb();

// Register the routes
app.use('/', routes);

// Start the server
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});