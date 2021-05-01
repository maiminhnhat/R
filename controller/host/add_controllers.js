const express = require('express');
const router = express.Router();
var fs = require('fs');
var Property = require('../../models/Property');
var Category = require("../../models/Category");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { MulterError } = require('multer');
//multer 
const multer = require('multer');
//Display in map
router.get('/api/properties', async(req, res) => {
    try {
        const property = await Property.find();
        return res.status(200).json({
            success: true,
            count: property.length,
            data: property
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
});
router.get('/api/property', async(req, res) => {
    try {
        const property = await Property.find({ _id: req.query.idproperty });
        return res.status(200).json({
            success: true,
            count: property.length,
            data: property
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
});
router.get('/add', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'add/add';
    Category.find()
    .exec(function(err,data){
        res.render('host/index', { main: main, url: url, data:data })
    })

});
router.get('/edit/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    Property.find({ _id: req.params.id })
        .exec((err, data) => {
            Category.find()
            .exec(function(err,cate){
                var main = 'add/edit';
                res.render('host/index', { main: main, url: url, data:data,cate:cate})
            })
        
        
       

        });

});



// cấu hình lưu file và ktra file
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
//add property
const upload = multer({ storage: storage }).array('input-pd[]', 10);
router.post('/uploadFile', (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            res.send(err);
        } else if (err) {
            res.send(err);
        } else {
            res.send(req.files);
        }

    });

});
router.get('/delete/:id', (req, res) => {
        
        var url = req.originalUrl.split('/');
        Property.findByIdAndDelete({ _id: ObjectId(req.params.id)  }, (err, data) => {
            if (err) console.log(err)
            Category.updateOne({name: data.category.cate_name},{ 
                "$pull": { "propertyId": data._id}
            },function(err, data) {
                    if (err) throw err;
                })  
            res.redirect('back')
  
   

    });
});
router.post('/api/properties', async (req, res) => {
var iduser = req.body._id;
Property.findOne({_id: iduser})

Category.findOne({name:req.body.category})
.exec(async function(err, data){
    var obj_insert = {
        'title': req.body.title,
        'address': req.body.address,
        'category':{
            'id':data._id,
            'cate_name': req.body.category
        },
        'description': req.body.description,
        'price': req.body.price,
        'image': req.body.image
    };
    if (iduser == '') {
        try {
            const property = await Property.create(obj_insert,(err,Data)=>{
                Category.updateOne({name:req.body.category},{ 
                    "$push": { "propertyId": Data._id }
                },function(err, data) {
                        if (err) throw err;
                    })
            });
     
           
            return res.status(201).json({
                success: true,
                data: property
            });
            
        } catch (err) {
            console.error(err);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'This property already exists' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        try {
            const property = await Property.findOneAndUpdate({ _id: req.body._id }, {
                $set: obj_insert
            },{returnNewDocument: false},function(err, data){
                if(err) throw err;
                Category.updateOne({name: data.category.cate_name},{ 
                    "$pull": { "propertyId": data._id}
                },function(err, data) {
                        if (err) throw err;
                    })
            });
                Category.updateOne({name: req.body.category},{ 
                    "$push": { "propertyId": req.body._id}
                },function(err, data) {
                        if (err) throw err;
                    })
          
            return res.status(201).json({
                success: true,
                data: property
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
})
});
//get all Property
router.get('/list(/:page)?', async(req, res) => {
    var url = req.originalUrl.split('/');
    var limit, skip, totalData, page;

    totalData = await Property.find();
    totalData = totalData.length;
    limit = 3;
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    // lấy toàn bộ property
    Property.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
        .populate('category')
        .exec((err, data) => {
            if (err) {
                res.send({ kq: 0, err, err });
            } else {
                // tổng số trang
                var totalPage = Math.ceil(totalData / limit);
                var str = '';
                data.forEach(e => {
                  
                    str += `
                    <li>
                        <small>` + e.category.cate_name + `</small>
                        <h4>` + e.title + `</h4>
                        <p>` + e.description + `</p>
                        <div class="modal fade" role="dialog" tabindex="-1" id="MyModal">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title">ATTENTION!!!!</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Are you sure?</p>
                                    </div>
                                    <div class="modal-footer"><button class="btn btn-light" type="button" data-dismiss="modal">No</button>
                                    <a href="delete/` + e._id + `" class="btn btn-primary">Delete</a></div>
                                   
                                </div>
                            </div>
                        </div>
                        <div class="btn" style="display: flex;"><p> <button class="btn_1 gray" type="button" data-toggle="modal" data-target="#MyModal"><i class="fa fa-trash-o"></i>Delete item</button></p>
                        <p><a href="edit/` + e._id + `" class="btn_1 gray"><i class="fa fa-fw fa-plus"></i> Edit item</a></p></div>

                    </li>
                `;

                });

                // views
                var main = 'listing/listing';
                res.render('host/index', { main: main, url: url, str: str, page: page, totalPage: totalPage});
            }
        })
});
module.exports = router;