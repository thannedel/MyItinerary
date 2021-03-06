const express = require('express');
const connectDB = require('./config/db')
const app = express();

 //const bodyParser = require('body-parser');
/*const methodOverride = require('method-override'); */ 


//Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));



app.get('/', (req, res) => res.send('API Running'));

//app.use('/uploads', express.static('uploads'));
//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/city', require('./routes/api/city'));
app.use('/api/itineraries', require('./routes/api/itineraries'));
//app.use('/api/imgUpload', require('./routes/api/imgUpload'));


 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));