const {UnprocessableEntity} = require('http-errors');
const Joi = require('joi');

/**
 * @class Experience
 */
class Experience {
  /**
   * @constructor
   * @param {Object} data Data dictionary
   */
  constructor(data) {
    const validData = this._validate(data);
    this.json = validData;
    this._jobTitle = validData['jobTitle'];
    this._companyName = validData['companyName'];
    this._location = validData['location'];
    this._startDate = validData['startDate'];
    this._endDate = validData['endDate'];
    this._achievements = validData['achievements'] || [];
    this._skills = validData['skills'] || [];
    this._active = validData['active'];
    this._creationDate = validData['creationDate'];
  }

  /**
   * jobTitle Getter
   * @return {String} jobTitle
   */
  get jobTitle() {
    return this._jobTitle;
  }

  /**
   * companyName Getter
   * @return {String} companyName
   */
  get companyName() {
    return this._companyName;
  }

  /**
   * location Getter
   * @return {String} location
   */
  get location() {
    return this._location;
  }

  /**
   * startDate Getter
   * @return {Date} startDate
   */
  get startDate() {
    return this._startDate;
  }

  /**
   * endDate Getter
   * @return {Date} endDate
   */
  get endDate() {
    return this._endDate;
  }

  /**
   * achievements Getter
   * @return {Array} achievements
   */
  get achievements() {
    return this._achievements;
  }

  /**
   * skills Getter
   * @return {Array} skills
   */
  get skills() {
    return this._skills;
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
   * @return {JSON} Experience representation as json
   */
  toJson() {
    return {
      'id': this.json['_id'],
      'jobTitle': this.jobTitle,
      'companyName': this.companyName,
      'location': this.location,
      'startDate': this.startDate,
      'endDate': this.endDate,
      'achievements': this.achievements,
      'skills': this.skills,
      'active': this.active,
      'creationDate': this.creationDate,
    };
  }

  /**
   * Validates a Experience object to create
   * @param {*} data Data to validate
   * @return {Boolean} data is valid
   */
  _validate(data) {
    const schema = Joi.object({
      'jobTitle': Joi.string()
          .min(5)
          .max(120)
          .required(),
      'companyName': Joi.string()
          .min(5)
          .max(120)
          .required(),
      'location': Joi.string()
          .min(5)
          .max(80)
          .required(),
      'startDate': Joi.date()
          .required(),
      'endDate': Joi.date(),
      'achievements': Joi.array(),
      'skills': Joi.array(),
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

module.exports = {Experience};
