const express = require('express');
const router = express.Router();
const models = require('../models');

// Memesan makanan dan mendapat nomor antrian
router.get('/:id',(req, res)=>{
    models.FoodList.findAll()
    .then(food=>{
        models.Waiter.findAll()
            .then(pelayan=>{
                models.SeatingTable.findById(req.params.id)
                .then(meja=>{
                    res.render('orders',{err_msg:false,data:food,dataWaiter:pelayan,dataMeja:meja})
            })
        })
    })
    .catch(err=>{
        throw err
    }) 
})

router.post('/:id',(req, res)=>{  

    let trueCheck = false
    if(!req.body.FoodListId){
        trueCheck = true
        models.FoodList.findAll()
        .then(food=>{
            models.Waiter.findAll()
                .then(pelayan=>{
                    models.SeatingTable.findById(req.params.id).then(meja=>{
    
                    res.render('orders',{err_msg:true,data:food,dataWaiter:pelayan,dataMeja:meja})
                })
            })
        })
    }
    let antrian = 0;
    models.SeatingTableWaiter.findAll()
    .then(row=>{
        if(!row[row.length-1]){
            antrian = 1
        } else {
            let tanggalLama = row[row.length-1].tanggal.slice(8)
            let tanggalBaru = req.body.Tanggal.slice(8)
            let tglLama     = parseInt(tanggalLama)
            let tglBaru     = parseInt(tanggalBaru)

            if(tglBaru > tglLama){
                antrian = 1
            } else if(tglBaru == tglLama) {
                antrian = row[row.length-1].noAntrian + 1
            }
        }

        if(!trueCheck){
        models.SeatingTableWaiter.create({
            SeatingTableId:req.body.SeatingTableId,
            WaiterId: req.body.WaiterId,
            tanggal: req.body.Tanggal,
            status: req.body.Status,
            noAntrian: antrian,
            FoodListId:req.body.FoodListId
        })
        .then(bener=>{
            res.redirect('/customer')
        })
    }
    }) 
})

module.exports = router;