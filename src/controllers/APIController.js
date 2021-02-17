const {IModel} = require('../interfaces/IModel');

/**
 * @class APIController
 */
class APIController {
  /**
   * APIController constructor
   * @param {IModel} dbInterface Database Object
   */
  constructor(dbInterface) {
    if (dbInterface instanceof IModel) {
      this.dbInterface = dbInterface;
    } else {
      throw new TypeError(
          'APIController takes one argument of type "IModel"',
      );
    }
  }

  /**
   * Get all active Resources
   * @param {int} page Current page
   * @param {int} limit Num of elements per page
   * @return {Array} list of Resources
   */
  async getAll(page, limit) {
    const resources = await this.dbInterface.search(
        {'active': true},
        page,
        limit,
    );
    return resources.map((resource) => resource.toJson());
  }

  /**
   * Get Resource by ID
   * @param {String} id ID of the Resource
   * @return {JSON} data
   */
  async getById(id) {
    const resource = await this.dbInterface.find(id);
    return resource.toJson();
  }

  /**
   * Create new Resource
   * @param {*} data Resource data
   * @return {JSON} Resource created
   */
  async createResource(data) {
    const resource = await this.dbInterface.insert(data);
    return resource.toJson();
  }

  /**
   * Updates a Resource
   * @param {String} id ID of Resource to update
   * @param {JSON} data fields to update
   */
  async updateResource(id, data) {
    const updatedResource = await this.dbInterface.update(id, data);
    return updatedResource.toJson();
  }

  /**
   * Disables a Resource
   * @param {String} id ID of Resource to disable
   */
  async disableResource(id) {
    const hasDisabledResource = await this.dbInterface.delete(id);
    if (hasDisabledResource) return 'DELETED';
  }
}

module.exports = {APIController};
