const { modelName } = require('../models/task');
const Notic = require('../models/task');
const router = require('express').Router();

//RENDERING TASK
router.get('/', async(req, res) => {
    let noticias = await Notic.find()
            .sort({date: 'desc'});
res.render('noticias' , {
    noticias
});
});
module.exports = router;