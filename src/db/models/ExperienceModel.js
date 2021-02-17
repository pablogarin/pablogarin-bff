const {IModel} = require('../../interfaces/IModel');
const {Experience} = require('../../entities/Experience');
const {NotFound, InternalServerError} = require('http-errors');

const MAX_ELEMENTS = 10;

/**
 * @class ExperienceModel
 */
class ExperienceModel extends IModel {
  /**
   * @constructor
   * @param {*} mongoose connection to DB
   */
  constructor(mongoose) {
    super();
    this.mongoose = mongoose;
    this.modelInstance = ExperienceModel.getExperienceModel(this.mongoose);
  }
  /**
   * Creates a model if it doesn't exists
   * @param {Mongoose} mongoose database instance
   * @return {ExperienceModel}
   */
  static getExperienceModel(mongoose) {
    if (ExperienceModel.model !== undefined) {
      return ExperienceModel.model;
    }
    const {Schema} = mongoose;
    const ExperienceSchema = new Schema({
      jobTitle: {
        type: String,
        required: true,
      },
      companyName: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
      },
      achievements: {
        type: [String],
        default: [],
      },
      skills: {
        type: [String],
        default: [],
      },
      active: {
        type: Boolean,
        default: true,
      },
      creationDate: {
        type: Date,
        default: new Date(),
      },
    });
    ExperienceModel.model = mongoose.model('Experience', ExperienceSchema);
    return ExperienceModel.model;
  };

  /**
   * Find a Experience by ID
   * @param {int} id The id to fetch
   * @return {Experience} result
   */
  async find(id) {
    const experience = await this.modelInstance
        .findOne({'_id': id})
        .lean();
    if (!experience) {
      throw new NotFound(`Experience with id ${id} was not found`);
    }
    return new Experience(experience);
  }

  /**
   * Search Experiences
   * @param {*} query query object
   * @param {int} page query object
   * @param {int} limit query object
   * @return {Array} search result
   */
  async search(query, page, limit=MAX_ELEMENTS) {
    const offset = (page - 1) * limit;
    const experiences = await this.modelInstance
        .find(query)
        .skip(offset)
        .limit(limit)
        .lean();
    return experiences.map((experience) => new Experience(experience));
  }

  /**
   * Insert a new Experience
   * @param {*} data The Experience to insert
   * @return {Experience} Experience object
   */
  async insert(data) {
    const experienceObject = new Experience(data);
    const experience = await new Promise((resolve, reject) => {
      this.modelInstance
          .create({...experienceObject.toJson()}, (err, experience) => {
            if (err) {
              return reject(new InternalServerError(err));
            }
            resolve(experience);
          });
    });
    return new Experience(experience);
  }

  /**
   * Update a Experience by ID
   * @param {int} id ID of the Experience to update
   * @param {Object} data Object with the fields to update
   * @return {Experience} Experience object
   */
  async update(id, data) {
    const experience = await new Promise((resolve, reject) => {
      this.modelInstance
          .findOneAndUpdate(
              {'_id': id},
              {...data},
              {
                'new': true,
                'useFindAndModify': false,
              },
              (err, experience) => {
                if (err) {
                  return reject(new InternalServerError(err));
                }
                return resolve(experience);
              });
    });
    if (!experience) {
      throw new NotFound(`Experience with id ${id} was not found`);
    }
    return new Experience(experience);
  }

  /**
   * Delete a Experience
   * @param {int} id ID of the Experience to delete
   * @return {Boolean} operation result
   */
  async delete(id) {
    const deletedExperience = await this.update(id, {'active': false});
    if (!deletedExperience.active) return true;
    throw new InternalServerError(
        `Experience not updated. Data: ${deletedExperience}`);
  }
}

module.exports = {ExperienceModel};
