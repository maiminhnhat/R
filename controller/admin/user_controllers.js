const express = require('express');
const router = express.Router();
var User = require('../../models/User');
var Type = require("../../models/User_type");
var handlebars = require('handlebars');
var fs = require('fs');
var crypto = require('crypto');
// gọi thư viện bcrypt
const bcrypt = require('bcrypt');
// độ băm
const saltRounds = 10;

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply8421@gmail.com',
        pass: 'zgmfx19a'
    }
});
// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

router.get('/api/user', async(req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({
            success: true,
            count: user.length,
            data: user
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
});
router.get('/deleteUser/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    User.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) console.log(err)
        Type.updateOne({type:data.role},{ 
            "$pull": { "UserId": data._id}
        },function(err, data) {
                if (err) throw err;
            })
        
        res.redirect('back')

    });
});
router.get('/editUser/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    Type.find()
    .exec(function(err,Data){
        User.find({ _id: req.params.id })
        .exec((err, data) => {
            // views
            var main = 'add_user/edit_user';
            res.render('admin/index', { main: main, url: url, data: data,Data:Data });

        });
    })
   

});
router.get('/addUser',(req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'add_user/add_user';
    Type.find()
    .exec(function(err,data){
        res.render('admin/index', { main: main, url: url, data:data })
    })
    
})

router.post('/api/ProccessAddStaffs',async(req,res)=>{
    var iduser = req.body.iduser;
    const password = req.body.password;
    if(iduser == ''){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                var obj_insert = {
                    'name': req.body.name,
                    'email':req.body.email,
                    'password':hash,
                    'role':req.body.type,
                    'active':1
                
                }
                const user = await User.create(obj_insert,(err,data)=>{
                    Type.updateOne({type:data.role},{ 
                        "$push": { "UserId": data._id}
                    },function(err, Data) {
                            if (err) throw err;
                            
                        })
                    res.send({kq:1})
                });
            });
        });
    }else{
                obj_update = {
                    'name': req.body.name,
                    'email':req.body.email,
                    'role':req.body.type,
                };
                User.findOneAndUpdate({ _id: req.body.iduser }, { $set: obj_update },{returnNewDocument: false}, (err, data) => {
                    if (err) res.send({ kq: 0, err: err })
                    Type.updateOne({type:data.role},{ 
                        "$pull": { "UserId": data._id}
                    },function(err, data) {
                            if (err) throw err;
                        })
                    res.send({ kq: 1 })
                });
        
    }
  
});
router.get('/viewUser(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var limit, skip, totalData, page;
    totalData = await User.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
      // lấy toàn bộ property
      User.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip)
      .exec((err, data) => {
          if (err) {
              res.send({ kq: 0, err, err });
          } else {
              // tổng số trang
              var totalPage = Math.ceil(totalData / limit);
              var str = '';
              data.forEach(e => {
                  str += `
                  <tr>
                  <td>`+e.name+`</td>
                  <td>`+e.role+`</td>
                  <td>`+e.email+`</td>   
                  <td>`+e.active+`</td>
                  <td>
                  <div class="modal fade" role="dialog" tabindex="-1" id="MyModal">
                      <div class="modal-dialog" role="document">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <h4 class="modal-title">ATTENTION!!!!</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                              </div>
                              <div class="modal-body">
                                  <p>Are you sure?</p>
                              </div>
                              <div class="modal-footer"><button class="btn btn-light" type="button" data-dismiss="modal">No</button><a href="deleteUser/` + e._id + `" class="btn btn-primary">Delete</a></div></div>
                          </div>
                      </div>
                  </div><a class="btn btn-primary" href="editUser/` + e._id + `" role="button" style="background: var(--teal);"><i class="fa fa-plus"></i>&nbsp;Update</a>&nbsp; &nbsp;<button class="btn btn-primary" type="button" style="background: var(--danger);"
                      data-toggle="modal" data-target="#MyModal"><i class="fa fa-trash-o"></i>&nbsp;Delete</button>
              </td>
                  </tr>
                  `;

              });

              // views
              var main = 'add_user/view_user';
              res.render('admin/index', { main: main, url: url, str: str, page: page, totalPage: totalPage});
          }
      })
  
})

module.exports = router;