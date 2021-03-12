const express = require('express');
const router = express.Router();
var Property = require('../../models/Property');
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
    } catch (error) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
});
router.get('/add', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'add/add';
    res.render('host/index', { main: main, url: url })
});
router.get('/edit/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    Property.find({ _id: req.params.id })
        .exec((err, data) => {
            // views
            var main = 'add/edit';
            res.render('host/index', { main: main, url: url, data: data });

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
router.post('/api/properties', async(req, res) => {
    var iduser = req.body._id
    console.log(iduser)
    console.log(req.body);
    var obj_insert = {
        'propertyId': req.body.propertyId,
        'title': req.body.title,
        'address': req.body.address,
        'category': req.body.category,
        'description': req.body.description,
        'price': req.body.price,
        'image': req.body.image
    };
    if (iduser == '') {
        try {
            const property = await Property.create(obj_insert);
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
            const property = await Property.updateMany({ _id: req.body._id }, {
                $set: req.body
            });
            return res.status(201).json({
                success: true,
                data: property
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }




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
    // lấy toàn bộ user
    Property.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, data) => {
            if (err) {
                res.send({ kq: 0, err, err });
            } else {
                // view pagination
                var pa = '';

                // tổng số trang
                var totalPage = Math.ceil(totalData / limit);

                for (let i = 1; i <= totalPage; i++) {
                    //console.log(page);

                    // active
                    (page == undefined) ? xd = 1: xd = page;

                    (i == xd) ? active = 'active': active = '';

                    pa += `
                    <li class="page-item ` + active + `">
                        <a class="page-link" href="list/` + i + `">
                            ` + i + `
                        </a>
                    </li>
                `;
                }

                var str = '';

                data.forEach(e => {
                    var arr = e.category;
                    var type
                    switch (arr[0]) {
                        case "1":
                            type = "Flat"
                            break;
                        case "2":
                            type = "Hotel"
                            break;
                        case "3":
                            type = "House"
                            break;
                        case "4":
                            type = "Unique Stay"
                            break;
                    }
                    str += `
                    <li>
                        <figure><img src="/img/` + e.image[0] + `" alt=""></figure>
                        <small>` + type + `</small>
                        <h4>` + e.title + `</h4>
                        <p>` + e.description + `</p>
                        <div class="btn" style="
                        display: flex;"> <p><a href="#0"  class="btn_1 gray"><i class="fa fa-fw fa-eye"></i> View item</a></p>
                        <p><a href="edit/` + e._id + `" class="btn_1 gray"><i class="fa fa-fw fa-plus"></i> Edit item</a></p></div>

                    </li>
                `;

                });

                // views
                var main = 'listing/listing';
                res.render('host/index', { main: main, url: url, str: str, pa: pa });
            }
        })
});
module.exports = router;