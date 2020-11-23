const Task = require('../models/task');
const router = require('express').Router();
var express = require ('express');
var multer = require('multer');
var path = require('path');

router.use(express.static(__dirname+"./public/"));

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var Storage = multer.diskStorage ({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,Date.now()+path.extname(file.originalname));
    //console.Log(file.originalname);
  }
});

var upload = multer({
  storage:Storage
}).single('filename');

const { ensureAuthentication } = require('../helpers/auth');

router.use((req, res, next) => {
  ensureAuthentication(req, res, next);
});

// ADD: RENDERING VIEW TASK FORM
router.get('/add', (req, res) => {
    res.render('tasks/add');
});

// SAVE A TASK
router.post('/add', upload, async (req, res, next) => {
  let { title, details, filename} = req.body;
  let errors = [];

  if (!title) {
    errors.push({text: 'Agregue un título'});
  }
  if (!details) {
    errors.push({text: 'Agregue detalles a su noticia'});
  }

  if (!req.file.filename) {
    errors.push({text: 'Agregue una imagen'});
  }


  // Rendering Error
  if (errors.length > 0) {
    res.render('tasks/add', {
      errors,
      title,
      details,
      filename
    });
  }
  else { // Saving Task
    const newTask = {
      title: req.body.title,
      details: req.body.details,
      filename: req.file.filename,
      user: req.user.id
    }
    let task = new Task(newTask);
    await task.save();
    req.flash('success_msg', 'Noticia creada.');
    res.redirect('/tasks');
  }
});

// RENDEDERING TASKS
router.get('/', async (req, res) => {
  let tasks = await Task.find({user: req.user.id})
              .sort({date: 'desc'});
  res.render('tasks/index', {
    tasks
  });
});

// RENDERING TASK EDIT
router.get('/edit/:id', async (req, res) => {
  let task = await Task.findById(req.params.id);
  if (task.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/tasks/edit',{task}); //edite
  } else {
    res.render('tasks/edit', {
      task
    });
  }
});

//


// EDITING
router.put('/edit/:id',upload, async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  task.title = req.body.title;
  task.details = req.body.details;
  task.filename = req.file.filename; //para guardar la imagen editada
  await task.save();
  req.flash('success_msg', 'Noticia actualizada.');
  res.redirect('/tasks');
});

// DELETE TASK

router.delete('/delete/:id', async (req, res) => {
  let task = await Task.findById(req.params.id);
  await task.remove();
  req.flash('success_msg', 'Noticia eliminada.');
  res.redirect('/tasks');
});

module.exports = router;
