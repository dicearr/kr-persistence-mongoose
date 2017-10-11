class Persistence {
  /**
   * Create a KoaResterPersistence
   * @param  {Object} model The mongoose model
   * @return {Persistence}
   */
  constructor (model) {
    if (!model) throw new Error('A mongoose model is required')
    this.model = model
  }
  /**
   * If id is provided, it tries to get the element with the given id.
   * It will throw an error if no element is found. If no id is provided
   * lists all the stored items.
   *
   * @async
   * @param  {String} id
   * @return {Promise} Resolved with the object or the array of objects or
   * rejected with an error.
   */
  async list (id, json = true) {
    if (id) {
      try {
        const el = await this.model.find({ _id: id }).exec()
        if (!el || el.length === 0) throw new Error()
        if (json) return el.pop().toJSON()
        return el.pop()
      } catch (e) {
        const err = new Error('Resource not found')
        err.status = 404
        err.data = {}
        throw err
      }
    }
    return this.model.find({}).exec()
  }
  /**
   * Creates a new object with the given data.
   *
   * @param  {Object} data
   * @return {Promise} Resolved with the new object or rejected with an error.
   */
  create (data) {
    const Model = this.model
    return (new Model(data)).save()
      .catch((err) => {
        const error = new Error('Invalid data')
        error.status = 400
        error.data = this.format(err.errors)
        throw error
      })
      .then(el => el._id)
  }
  /**
   * Updates an existing object with the given data.
   *
   * @param  {Number}  id - The object id
   * @param  {Object}  data - The fields to be updated
   * @return {Promise} Resolved with the old object or rejected with an error.
   */
  async update (id, data) {
    let el
    try {
      el = await this.list(id)
      await this.model.update({
        _id: id
      }, data, {
        runValidators: true
      }).exec()
      return el
    } catch (err) {
      if (!el) throw err
      const error = new Error('Invalid data')
      error.status = 400
      error.data = {
        [err.path]: err.message
      }
      throw error
    }
  }
  /**
   * Replaces an existing object by a new one created with the given data.
   *
   * @param  {Number}  id - The id of the object to be replaced
   * @param  {Object}  data - The new object data
   * @return {Promise} Resolved with the old object or rejected with an error.
   */
  async replace (id, data) {
    let el
    try {
      el = await this.list(id)
      await this.model.replaceOne({
        _id: id
      }, data, {
        runValidators: true
      }).exec()
      return el
    } catch (err) {
      if (!el) throw err
      const error = new Error('Invalid data')
      error.status = 400
      error.data = {
        [err.path]: err.message
      }
      throw error
    }
  }
  /**
   * Deletes an existing object.
   *
   * @param  {Number}  id - The id of the object to be deleted
   * @return {Promise} Resolved with the removed object or rejected with an error.
   */
  async delete (id) {
    try {
      const el = await this.list(id, false)
      await el.remove()
      return el.toJSON()
    } catch (err) {
      throw err
    }
  }
  format (errors) {
    return Object.keys(errors).reduce((err, prop) => {
      return { ...err, [prop]: errors[prop].message }
    }, {})
  }
}

module.exports = Persistence
