/**
 * @abstract
 *
 * @class IModel
 */
class IModel {
  /**
   * Abstract class constructor
   * @constructor
   */
  constructor() {
    if (this.constructor === IModel) {
      throw new TypeError(
          'Abstract class "IModel" cannot be instantiated directly',
      );
    }
    if (this.find === undefined) {
      throw new TypeError(
          'method find must be implemented',
      );
    }
    if (this.search === undefined) {
      throw new TypeError(
          'method search must be implemented',
      );
    }
    if (this.insert === undefined) {
      throw new TypeError(
          'method insert must be implemented',
      );
    }
    if (this.update === undefined) {
      throw new TypeError(
          'method update must be implemented',
      );
    }
    if (this.delete === undefined) {
      throw new TypeError(
          'method delete must be implemented',
      );
    }
  }
}

module.exports = {IModel};
