const express = require('express');
const router = express.Router();
var Property = require("../../models/Property");
var User = require("../../models/User");
var Type = require("../../models/User_type");
router.get('/api/add_type', async function(req, res){
    try {
        const category = await Type.find();
        return res.status(200).json({
            success: true,
            count: category.length,
            data: category
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
})
router.get('/deleteType/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    Type.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) console.log(err)
        // data.propertyId.forEach(e=>{
        //     User.deleteMany({_id: e},function(err, Data) {
        //         if (err) throw err;
        //         console.log(Data)
        //     })
        // })
        
        res.redirect('back')

    });
});
router.get('/editType/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    Type.find({ _id: req.params.id })
        .exec((err, data) => {
            // views
            var main = 'add_type/edit_type';
            res.render('admin/index', { main: main, url: url, data: data });

        });

});
router.get('/addType', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'add_type/add_type';
    res.render('admin/index', { main: main, url: url })
});
router.post('/api/add_type', async(req, res) => {
    var iduser = req.body.iduser;
    var obj_insert ={
        'type':req.body.name
    }
   if (iduser == '') {
    try {
        const type = await Type.create(obj_insert);
        return res.status(201).json({
            success: true,
            data: type
        });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'This Type already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
   }else{
       try {
        const type = await Type.updateMany({_id: req.body.iduser},{
            $set: obj_insert
         },function(err,data){
             if (err) throw err
            
         })
         return res.status(201).json({
            success: true,
            data: type
        });
       } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
           
       }
     
   }


});
router.get('/viewType(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var url = req.originalUrl.split('/');
    var limit, skip, totalData, page;
    totalData = await Type.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
      // lấy toàn bộ property
      Type.find()
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
                  <td>`+e.type+`</td>
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
                              <div class="modal-footer"><button class="btn btn-light" type="button" data-dismiss="modal">No</button><a href="deleteType/` + e._id + `" class="btn btn-primary">Delete</a></div></div>
                          </div>
                      </div>
                  </div><a class="btn btn-primary" href="editType/` + e._id + `" role="button" style="background: var(--teal);"><i class="fa fa-plus"></i>&nbsp;Update</a>&nbsp; &nbsp;<button class="btn btn-primary" type="button" style="background: var(--danger);"
                      data-toggle="modal" data-target="#MyModal"><i class="fa fa-trash-o"></i>&nbsp;Delete</button>
              </td>
                  </tr>
                  `;

              });

              // views
              var main = 'add_type/view_type';
              res.render('admin/index', { main: main, url: url, str: str, page: page, totalPage: totalPage});
          }
      })
  
})

module.exports = router;