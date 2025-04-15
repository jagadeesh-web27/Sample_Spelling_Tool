import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import todoRoutes from './routes/levels';  // Importing the routes correctly

const app: Express = express();
const PORT: string | number = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(todoRoutes);  // Make sure the routes are used here

const uri: string = `mongodb+srv://jagadeeshboya27:Code143@cluster0.vbl7o.mongodb.net/spelling_tool?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    throw error;
  });
