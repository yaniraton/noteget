const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const sheet = require('./models/sheet');
const fs = require('fs');
require('dotenv').config();
const uuid = require('uuid');
const sheet_request = require('./models/Request_sheets')
const multerS3 = require('multer-s3');
const PORT = process.env.PORT || 3000;

// express app
const app = express();
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

// connect to mongodb & listen for requests
const dbURI = process.env.mongodb_string;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(PORT, () => console.log("start",PORT)))
  .catch(err => console.log(err));
// register view engine
app.set('view engine', 'ejs');


// const upload = multer({
//   storage: multerS3({
//       s3,
//       bucket: 'noteget',
//       metadata: (req, file, cb) => {
//         console.log(req.body);
//           cb(null, { fieldName: file.fieldname });
//       },
//       key: (req, file, cb) => {
//           const ext = path.extname(file.originalname);
//           cb(null, `${file.originalname}${ext}`);
//       }
//   })
// });


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'sheets')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    global.filePath_ = `${file.originalname}`;
    cb(null, filePath_);
  }
})
const upload = multer({ storage })
const cpUpload = upload.fields([{ name: 'mainfile', maxCount: 1 }, { name: 'eazyfile', maxCount: 1 }]);


// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });


// routes
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// sheet routes
app.get('/sheet/create', (req, res) => {
  res.render('create', { title: 'Request a sheet' });
});

app.get('/home', (req, res) => {
  sheet.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { sheet: result, title: 'home page' });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/404');
    });
});

app.get('/up', (req, res) => {
  res.render('uploder', { title: 'uploder'})
});

app.post('/sheets', (req, res) => {
  console.log(req.body);
  const sheet = new sheet_request(req.body);

  sheet.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/404');
    });
});
app.post('/upload',cpUpload, (req, res) => {
  console.log(req);
  if (req.body.haseazy == "on"){
    var haseazy_ = true;
  }else{
    var haseazy_ = false;
  }
  if (req.body.hashard == "on"){
    var hashard_ = true;
  }else{
    var hashard_ = false;
  }
  const filePath = `./sheets/${filePath_}`
  const new_sheet = new sheet({
    name:req.body.name,
    songauthor:req.body.songauthor,
    file:filePath,
    haseazy: haseazy_,
    hashard: hashard_,
    widget: req.body.widget
  });
  new_sheet.save()
    .then(result => {
      return res.json({ status: 'OK' });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/404');
    });
});

app.get('/sheet/:id', (req, res) => {
  const id = req.params.id;
  sheet.findById(id)
    .then(result => {
      res.render('details', { sheet: result, title: 'sheet Details' });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/404');
    });
});
app.get('/get/:id/:lev', (req, res) => {
  const id = req.params.id;
  const lev = req.params.lev;
  sheet.findById(id)
    .then(result => {
      if (lev == 'ragular') {
        var data = fs.readFileSync(result.file);
        res.contentType("application/pdf");
        res.send(data);
      } else if (lev == 'eazy'&& result.haseazy == true) {
        var data = fs.readFileSync(result.eazyfile);
        res.contentType("application/pdf");
        res.send(data);
      }else if (lev == 'hard'&& result.hashard == true){
        var data = fs.readFileSync(result.hardfile);
        res.contentType("application/pdf");
        res.send(data);
      }
    })
    .catch(err => {
      console.log(err);
      res.redirect('/404');
    });



});
// app.get('/test', (req, res) => {
//   const test = new sheet({
//     name: 'bones',
//     songauthor: 'imagine dragons',
//     file: './sheets/warriors/bones_ragular.pdf',
//     haseazy: 'false',
//     hashard: 'false',
//     widget: 'https://open.spotify.com/embed/track/0HqZX76SFLDz2aW8aiqi7G?utm_source=generator'

//   })
//   test.save()
//     .then(result => {
//       res.redirect('/');
//     })
//     .catch(err => {
//       console.log(err);
//       res.redirect('/404');
//     });

// })

app.get('/search', (req, res) => {
  const name = req.query.searcher;
  sheet.find({
    // $or: [
    //   {name: {$search: name, $caseSensitive: false}},
    //   {songauthor: name}
    // ]
    $text: {$search: name, $caseSensitive: false}
  })
  .limit(10)
  .exec((err,dov) => {
    console.log(dov);
    res.render('search', { label: name, sheet: dov, title: 'Result Details' });
  })
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});