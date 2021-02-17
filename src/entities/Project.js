const { UnprocessableEntity } = require('http-errors');
const Joi = require('joi');

/**
 * @class Project
 */
class Project {
  /**
   * @constructor
   * @param {Object} data Data dictionary
   */
  constructor(data) {
    const validData = this._validate(data);
    this.json = validData;
    this._name = validData['name'];
    this._description = validData['description'];
    this._projectDate = validData['projectDate'];
    this._caption = validData['caption'];
    this._gallery = validData['gallery'] || [];
    this._active = validData['active'];
    this._creationDate = validData['creationDate'];
  }

  /**
   * name Getter
   * @return {String} name
   */
  get name() {
    return this._name;
  }

  /**
   * description Getter
   * @return {String} description
   */
  get description() {
    return this._description;
  }

  /**
   * projectDate Getter
   * @return {Date} projectDate
   */
  get projectDate() {
    return this._projectDate;
  }

  /**
   * caption Getter
   * @return {String} caption
   */
  get caption() {
    return this._caption;
  }

  /**
   * gallery Getter
   * @return {Array} gallery
   */
  get gallery() {
    return this._gallery;
  }

  /**
   * active Getter
   * @return {Boolean} active
   */
  get active() {
    return this._active;
  }

  /**
   * creationDate Getter
   * @return {Date} creationDate
   */
  get creationDate() {
    return this._creationDate;
  }

  /**
   * Creates a JSON Representation
   * @return {JSON} Project representation as json
   */
  toJson() {
    return {
      'id': this.json['_id'],
      'name': this.name,
      'description': this.description,
      'projectDate': this.projectDate,
      'caption': this.caption,
      'gallery': this.gallery,
      'active': this.active,
      'creationDate': this.creationDate,
    };
  }

  /**
   * Validates a project object to create
   * @param {*} data Data to validate
   * @return {Boolean} data is valid
   */
  _validate(data) {
    const schema = Joi.object({
      'name': Joi.string()
          .min(3)
          .max(120)
          .required(),
      'description': Joi.string()
          .min(10)
          .max(120)
          .required(),
      'projectDate': [
        Joi.date(),
        Joi.any(),
      ],
      'caption': Joi.string(),
      'gallery': Joi.array(),
      'active': Joi.boolean(),
      'creationDate': Joi.date(),
    }).unknown();
    const {
      value: validData,
      error,
    } = schema.validate(data);
    if (error) {
      throw new UnprocessableEntity(error);
    }
    return validData;
  }
}

module.exports = {Project};
