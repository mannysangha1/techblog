const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up meyhod to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compare(loginPw, this.password);
    }
}

// define table columns and configuaration
User.init(
    {
        // define an id column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true    
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        linkedin: {
            type: DataTypes.STRING,
            allowNull: true
        },
        github: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // define an email colum
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // define a password colum
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        }
    },
  {
     hooks: {
         // set up beforeCreate lifecycle "hook" functionality
         async beforeCreate(newUserData) {
             newUserData.password = await bcrypt.hash(newUserData.password,10);
             return newUserData;
         },
         // set up beforeUpdate lifecycle "hook" functionality
         async beforeUpdate(updatedUserData) {
             updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
             return updatedUserData;
         }
     },

     sequelize,
     timestamps: false,
     freezeTableName: true,
     underscored: true,
     modelName: 'user'
  }
);

module.exports = User;