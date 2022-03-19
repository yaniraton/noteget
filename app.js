const express = require('express');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const sheet = require('./models/sheet');
const fs = require('fs');
require('dotenv').config();
const uuid = require('uuid');
const sheet_request = require('./models/Request_sheets')
const PORT = process.env.PORT || 4000;

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = process.env.mongodb_string;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(PORT, () => console.log("start",PORT)))
  .catch(err => console.log(err));
// register view engine
app.set('view engine', 'ejs');

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

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });
const upload = multer({ storage }); // or simply { dest: 'uploads/' }


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
    });
});

app.get('/up', (req, res) => {
  res.render('uploder', { title: ''})
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
    });
});
app.post('/upload',upload.single("avatar"), (req, res) => {
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
      req.redirect('/404')
    });



});
app.get('/test', (req, res) => {
  const test = new sheet({
    name: 'warriors',
    songauthor: 'imagine dragons',
    file: './sheets/warriors/warriors_ragular.pdf',
    hardfile: './sheets/warriors/warriors_Hard.pdf',
    haseazy: 'false',
    hashard: 'true',
    widget: 'https://open.spotify.com/embed/track/1lgN0A2Vki2FTON5PYq42m'

  })

})

app.get('/search', (req, res) => {
  const name = req.query.searcher;
  sheet.find({$text: {$search: name}})
  .limit(10)
  .exec((err,dov) => {
    res.render('search', { label: name, sheet: dov, title: 'Result Details' });
  })
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});