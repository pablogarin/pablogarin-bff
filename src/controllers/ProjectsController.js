const {DBInterface} = require('../interfaces/DBInterface');

/**
 * @class ProjectsController
 */
class ProjectsController {
  /**
   * ProjectsController constructor
   * @param {DBInterface} dbInterface Database Object
   */
  constructor(dbInterface) {
    if (dbInterface instanceof DBInterface) {
      this.dbInterface = dbInterface;
    } else {
      throw new TypeError(
          'ProjectsController takes one argument of type "DBInterface"',
      );
    }
  }

  /**
   * Get all active projects
   * @param {int} page Current page
   * @param {int} limit Num of elements per page
   * @return {Array} list of projects
   */
  async getAll(page, limit) {
    const projects = await this.dbInterface.search(
        {'active': true},
        page,
        limit,
    );
    return projects.map((project) => project.toJson());
  }

  /**
   * Get Project by ID
   * @param {String} id ID of the project
   * @return {JSON} data
   */
  async getById(id) {
    const project = await this.dbInterface.find(id);
    return project.toJson();
  }

  /**
   * Create new Project
   * @param {*} data Project data
   * @return {JSON} project created
   */
  async createProject(data) {
    const project = await this.dbInterface.insert(data);
    return project.toJson();
  }

  /**
   * Updates a Project
   * @param {String} id ID of project to update
   * @param {JSON} data fields to update
   */
  async updateProject(id, data) {
    const updatedProject = await this.dbInterface.update(id, data);
    return updatedProject.toJson();
  }

  /**
   * Disables a project
   * @param {String} id ID of project to disable
   */
  async disableProject(id) {
    const hasDisabledProject = await this.dbInterface.delete(id);
    if (hasDisabledProject) return 'DELETED';
  }
}

module.exports = {ProjectsController};
