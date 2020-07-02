const express = require('express');

const app = express();

app.get('/', (request, response) => response.json({msg: 'Welcome to texans-burger-api...'}));

//Define Routes a.k.a. endpoints

app.use('/api/users', require('./routes/users'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));