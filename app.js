
const express = require('express');
const morgan = require('morgan');//middleware
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes')

const app = express();//creates an express app

//connect to mongodb
const dbURI = 'mongodb+srv://ikramghala:ikram2006@blogapp.3quwx.mongodb.net/blogapp?retryWrites=true&w=majority&appName=blogapp';
mongoose.connect(dbURI)
  .then((result) => app.listen(3000))//starts server on port 3000
  .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');


app.use(express.static('public'));
//middleware to accept form data (readable)
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));



app.get('/', (req, res) => {//(path, callback)
  res.redirect('/blogs');//index view (index.ejs)
});

app.get('/about', (req, res) => {

  res.render('about', {title: 'About'});
});

app.use('/blogs', blogRoutes);

//404 page
app.use((req, res) =>  {
  res.status(404).render('404', {title: '404'});
});