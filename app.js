var express = require('express');
var app = express();
var models = require('./models');
var Promise = require('bluebird');

var morgan = require('morgan');
var bodyParser = require('body-parser');

var swig = require('swig');
// require('./filters')(swig);

var path = require('path');
// built-in node module that adjusts our paths to 'platform agnostic' so our path works whether it's windows or OSX using our app

module.exports = app;

// all the 'app.' things are coming from Express

app.set('views', path.join(__dirname, './views'));
// __dirname is the absolute path to the directory this script lives in - it's transferable, so that if someone clones my repo it will be their path
// 'views' makes it look in the views folder when we call res.render

app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({ cache: false });


app.use(morgan('dev'));
// 'dev' here just means it's for developer purposes
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// the below is from wikistack and I need to adjust it to this workshop
// app.use('/wiki', require('./routes/wiki'));
// app.use('/users', require('./routes/users'));

// // from wikistack:
// router.get('/', function (req, res, next) {

//   Page.findAll({})
//   .then(function (pages) {
//     res.render('index', {pages: pages});
//   })
//   .catch(next);

// });

// // trying w Promise.all and .spread
// app.get('/', function (req, res, next) {
//   Promise.all([
//     models.Hotel.findAll({}),
//     models.Activity.findAll({}),
//     models.Restaurant.findAll({})
//   ])
//   .spread(function (hotels, activities, restaurants) {
//     console.log('THIS IS IT: ', hotels, activities, restaurants);
//     res.render('index', {
//       hotels: hotels,
//       activities: activities,
//       restaurants: restaurants
//     });
//   })
//   // knows to steer to /views/index.html because we set app to 'views' and the view engine to html
//   .catch(next);
// });

app.get('/', function (req, res, next) {
  models.Hotel.findAll({}).then(function (dbHotels) {
    models.Restaurant.findAll({}).then(function (dbRestaurants) {
      models.Activity.findAll({}).then(function (dbActivities) {
        res.render('index', {
          hotels: dbHotels,
          restaurants: dbRestaurants,
          activities: dbActivities
        });
      }).then(null, next);
    }).then(null, next);
  }).then(null, next);
 // knows to steer to /views/index.html because we set app to 'views' and the view engine to html
});

// // from wikistack:
// router.get('/', function (req, res, next) {
//     User.findAll({})
//         .then(function (users) {
//             res.render('userlist', {users: users});
//         })
//         .catch(next);
// });


// error handling:
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle all errors (anything passed into `next()`)
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err);
  res.render(
    // ... fill in this part
    'error'
  );
});


// SERVER:

Promise.all([
  models.Place.sync({}),
  models.Hotel.sync({}),
  models.Activity.sync({}),
  models.Restaurant.sync({})
])
.then(function () {
  app.listen(3001, function () {
    console.log('Server is listening on port 3001!');
  });
})
.catch(console.error);
