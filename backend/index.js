import  express  from "express";
// index.js
import dotenv from 'dotenv'; // Make sure dotenv is imported
dotenv.config();  // This should be at the very top of your file

import mysql from 'mysql2';  // Then import mysql2 after dotenv

// Log environment variables to make sure they are loaded correctly
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// MySQL connection code
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Database connected successfully!');
});


// Perform any queries or start your app logic here...



const app = express()

app.get("/",(req,res)=>{
res.json("hello this is the backend!")
});
app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.json({ error: err.message }); // Provide proper error message
        return res.json(data);
    });
})

const PORT = process.env.PORT || 3200; // Change 8800 to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});