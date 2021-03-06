const express = require('express');
const router  = express.Router();
const models = require('../models');

router.get('/',(req, res)=>{
    models.SeatingTable.findAll({
        order:[['id','ASC']]
    }).then(bla=>{
      res.render('seatingTable',{data:bla,err_msg:false, pageTitle: 'Restaurant Magic'})
    })
    .catch(err=>{
      throw err.toString()
    })
  })


//   ADD Table
  router.post('/', (req, res)=>{

    models.SeatingTable.create({
                        tableName:`${req.body.tableName}`,
                        capasity: req.body.capasity
                      })
    .then(()=>{
        res.redirect('/admin/seatingTable')
    })
    .catch(err=>{
        models.SeatingTable.findAll({
            order:[['id','ASC']]
        }).then(bla=>{
          res.render('seatingTable',{data:bla,err_msg:err.errors[0].message,pageTitle: 'Restaurant Magic'})
        })
    })
    
})

// DELETE Table
router.get('/delete/:id', (req, res)=>{
    models.SeatingTable.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(()=>{
        res.redirect('/admin/seatingTable')
    })
    .catch(err=>{
        res.send(err)
    })
})

// EDIT Table
router.get('/edit/:id', (req, res)=> {
    models.SeatingTable.findAll({
        where : {
            id : req.params.id
        }
    })
    .then(rows =>{
        res.render('seatingTable-edit', {data:rows[0],pageTitle: 'Restaurant Magic'})
    }) 
    .catch(err =>{
        res.send(err)
    })
})

router.post('/edit/:id', (req, res)=>{
    models.SeatingTable.update({
        tableName:`${req.body.tableName}`, 
        capasity:`${req.body.capasity}`
    },{
        where:{
            id : req.params.id
        }
    })
    .then((r)=>{
        res.redirect('/admin/seatingTable')
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router;
