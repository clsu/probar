const noticias = require('../models/task');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Bienvenido a AGROSEC'
  });
});

router.get('/quienessomos', (req, res) => {
  res.render('quienessomos', {
    title: 'QUIÉNES SOMOS'
  });
});

router.get('/contacto', (req, res) => {
  res.render('contacto', {
    title: 'CONTACTO'
  });
});



module.exports = router;
