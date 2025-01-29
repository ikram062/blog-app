
const express = require('express');
const morgan = require('morgan');//middleware
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();//express app

//connect to mongodb
const dbURI = 'mongodb+srv://ikramghala:ikram2006@blogapp.3quwx.mongodb.net/blogapp?retryWrites=true&w=majority&appName=blogapp';
mongoose.connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');


app.use(express.static('public'));
//middleware to accept form data (readable)
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));



app.get('/', (req, res) => {
  res.redirect('/blogs');//index view (index.ejs)
});

app.get('/about', (req, res) => {

  res.render('about', {title: 'About'});
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({createdAt: -1})
  .then((result) => {
    res.render('index', {title: 'All Blogs', blogs: result});
  })
  .catch((err) => {
    console.log(err);
  })
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);

  blog.save()
  .then((result) => {
    res.redirect('/blogs');
  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .then((result) => {
    res.render('details', {blog: result, title: 'Blog Details'});
  })
  .catch((err) => console.log(err));
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({redirect: '/blogs'});
  })
  .catch(err => console.log(err));
})

app.get('/blogs/create', (req, res) => {
  res.render('create', {title: 'Create Blog'});
})

//404 page
app.use((req, res) =>  {
  res.status(404).render('404', {title: '404'});
});