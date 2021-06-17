'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { BOOLEAN } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        }
      });
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A first name is required."
        },
        notEmpty: {
          msg: "Please provide a first name."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A last name is required."
        },
        notEmpty: {
          msg: "Please provide a last name."
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email you entered already exists.'
      }, 
      validate: {
        notNull: {
          msg: 'An email is required.'
        },
        isEmail: {
          msg: 'Please provide a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.'
        },
        notEmpty: {
          msg: 'Please provide a password.'
        },
      },
      // Included lenth validation for password in my hashing function below
      set(val) {
        if (val.length < 8 || val.length > 20) {
          throw Error('The password should be between 8 and 20 characters.');
        }
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};