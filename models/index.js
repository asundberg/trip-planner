// models
var Sequelize = require('sequelize');
var marked = require('marked');

var dbString = 'tripplanner';

// from wikistack:
// if (process.env.MODE === 'testing') {
//   dbString = 'testingwikistack';
// }

var db = new Sequelize('postgres://localhost:5432/' + dbString, {
  logging: false
});

var Place = db.define('place', {
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    // (lat, lon float array ????)
    type: Sequelize.ARRAY(Sequelize.FLOAT),
    // an array holding values
    allowNull: false
  }
});

var Hotel = db.define('hotel', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  num_stars: {
    type: Sequelize.INTEGER,
    // integer from 1-5
    allowNull: false,
    validate: {
      max: 5,
      min: 1
    },
    amenities: {
      type: Sequelize.TEXT,
      // comma delimited string list
      allowNull: false
    }
  }
});

var Activity = db.define('activity', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age_range: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var Restaurant = db.define('restaurant', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cuisine: {
    type: Sequelize.TEXT,
    // comma delimited string list
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    // integer from 1-5 for how many dollar signs
    allowNull: false
  }
});


Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);

// checkpoint example:
// Article.belongsTo(User, {
//   as: 'author'
// });

module.exports = {
  db: db,
  Place: Place,
  Hotel: Hotel,
  Activity: Activity,
  Restaurant: Restaurant
};
