const mongoose = require('mongoose');

const {ProjectModel} = require('./db/models/ProjectModel');

/**
 * @class DIContainer
 */
class DIContainer {
  /**
   * @constructor
   */
  constructor() {
    // Database config
    this.uri = process.env.MONGODB_CONNECTION_STRING;
    this.mongooseOptions = {
      'useNewUrlParser': true,
    };
    // Dependencies
    this.instances = {};
    this.dependencies = {
      'database': {
        'project': () => (new ProjectModel(this.connection)),
      },
    };
  }

  /**
   * Prepares async dependencies
   */
  async prepare() {
    this.connection = await mongoose.connect(this.uri, this.mongooseOptions);
  }

  /**
   * Generates object with all the dependencies
   * @param {String} dependencyName dependency to fetch
   * @param {String} dependencySection dependency group
   * @return {*} dependency
   */
  get(dependencyName, dependencySection) {
    // Create instance and return it
    if (dependencySection in this.dependencies) {
      const section = this.dependencies[dependencySection];
      if (dependencyName in section) {
        // Check if this dependency has been initialized
        const key = `${dependencySection}.${dependencyName}`;
        if (key in this.instances) {
          return this.instances[key];
        }
        const instance = section[dependencyName]();
        this.instances[key] = instance;
        return instance;
      } else {
        throw new TypeError(`Unknown dependency "${dependencyName}"`);
      }
    } else {
      throw new TypeError(`Unknown dependency section "${dependencySection}"`);
    }
  }
}

module.exports = {DIContainer};
