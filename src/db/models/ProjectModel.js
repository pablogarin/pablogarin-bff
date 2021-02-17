const {DBInterface} = require('../../interfaces/DBInterface');
const {Project} = require('../../entities/Project');

const MAX_ELEMENTS = 10;

/**
 * @class ProjectModel
 */
class ProjectModel extends DBInterface {
  /**
   * @constructor
   * @param {*} mongoose connection to DB
   */
  constructor(mongoose) {
    super();
    this.mongoose = mongoose;
    this.modelInstance = ProjectModel.getProjectModel(this.mongoose);
  }
  /**
   * Creates a model if it doesn't exists
   * @param {Mongoose} mongoose database instance
   * @return {ProjectModel}
   */
  static getProjectModel(mongoose) {
    if (ProjectModel.model !== undefined) {
      return ProjectModel.model;
    }
    const {Schema} = mongoose;
    const ProjectSchema = new Schema({
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      projectDate: {
        type: Date,
        default: null,
      },
      caption: {
        type: String,
        required: true,
      },
      gallery: {
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
    ProjectModel.model = mongoose.model('Project', ProjectSchema);
    return ProjectModel.model;
  };

  /**
   * Find a project by ID
   * @param {int} id The id to fetch
   * @return {Project} result
   */
  async find(id) {
    const projectData = await this.modelInstance
        .findOne({'_id': id})
        .lean();
    return new Project(projectData);
  }

  /**
   * Search projects
   * @param {*} query query object
   * @param {int} page query object
   * @param {int} limit query object
   * @return {Array} search result
   */
  async search(query, page, limit=MAX_ELEMENTS) {
    const offset = (page - 1) * limit;
    const projects = await this.modelInstance
        .find(query)
        .skip(offset)
        .limit(limit)
        .lean();
    return projects.map((project) => new Project(project));
  }

  /**
   * Insert a new Project
   * @param {*} data The project to insert
   * @return {Project} project object
   */
  async insert(data) {
    const projectObject = new Project(data);
    const project = await new Promise((resolve, reject) => {
      this.modelInstance
          .create({...projectObject.toJson()}, (err, project) => {
            if (err) {
              return reject(new Error(err));
            }
            resolve(project);
          });
    });
    return new Project(project);
  }

  /**
   * Update a project by ID
   * @param {int} id ID of the project to update
   * @param {Object} data Object with the fields to update
   * @return {Project} project object
   */
  async update(id, data) {
    const project = await new Promise((resolve, reject) => {
      this.modelInstance
          .findOneAndUpdate(
              {'_id': id},
              {...data},
              {
                'new': true,
                'useFindAndModify': false,
              },
              (err, project) => {
                if (err) {
                  return reject(new Error(err));
                }
                return resolve(project);
              });
    });
    return new Project(project);
  }

  /**
   * Delete a Project
   * @param {int} id ID of the project to delete
   * @return {Boolean} operation result
   */
  async delete(id) {
    const deletedProject = await this.update(id, {'active': false});
    if (!deletedProject.active) return true;
    throw new Error(`Project not updated. Data: ${deletedProject}`);
  }
}

module.exports = {ProjectModel};
