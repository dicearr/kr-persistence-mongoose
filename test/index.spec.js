const mongoose = require('mongoose')

const Persistence = require('../')
const Model = require('./model')

mongoose.Promise = Promise

describe('Persistence', () => {
  beforeAll(() => {
    mongoose.connect('mongodb://localhost/test', {
      useMongoClient: true
    })
  })

  afterEach(() => Model.remove({}))

  afterAll(() => {
    mongoose.disconnect()
  })

  describe('.constructor', () => {
    it('should throw an error if no model is provided', () => {
      expect(() => {
        new Persistence() // eslint-disable-line no-new
      }).toThrow()
    })
    it('should throw an error if no model is provided', () => {
      const p = new Persistence(Model)
      expect(p).toBeTruthy()
      expect(p).toBeInstanceOf(Persistence)
    })
  })

  describe('.list', () => {
    let p
    beforeEach(() => {
      p = new Persistence(Model)
    })
    it('should throw a 404 error with a not existent id', async (done) => {
      try {
        await p.list('asdf')
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        expect(e.message).toBe('Resource not found')
        done()
      }
    })
    it('should return an array if collection is empty', async () => {
      const list = await p.list()
      expect(list).toBeInstanceOf(Array)
    })
    it('should return an array if there are elements', async () => {
      await (new Model({ title: 'foo', description: 'bar' })).save()
      const list = await p.list()
      expect(list).toBeInstanceOf(Array)
      expect(list.length).toBe(1)
      const res = list[0].toJSON()
      expect(res.title).toBe('foo')
      expect(res.description).toBe('bar')
    })
  })
  describe('.create', () => {
    let p
    beforeEach(() => {
      p = new Persistence(Model)
    })
    it('should throw a 400 error with invalid data', async (done) => {
      try {
        await p.create({ description: 'bar' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(400)
        expect(e.data).toEqual({
          title: 'Path `title` is required.'
        })
        done()
      }
    })
    it('should return the created object id with valid data', async () => {
      const id = await p.create({ title: 'foo', description: 'bar' })
      expect(mongoose.Types.ObjectId.isValid(id)).toBe(true)
    })
  })
  describe('.update', () => {
    let p
    beforeEach(() => {
      p = new Persistence(Model)
    })
    it('should throw a 404 error with invalid id', async (done) => {
      try {
        await p.update('asd', { title: 'foo', description: 'bar' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
    it('should throw a 404 error with not existing id', async (done) => {
      try {
        const id = mongoose.Types.ObjectId()
        await p.update(id, { title: 'foo', description: 'bar' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
    it('should throw a 400 error with wrong data', async (done) => {
      try {
        const el = await p.create({ title: 'foo', description: 'bar' })
        await p.update(el._id, { value: 'asdf' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(400)
        expect(e.data).toEqual({
          value: 'Cast to number failed for value "asdf" at path "value"'
        })
        done()
      }
    })
    it('should modify the original with valid data', async () => {
      const id = await p.create({ title: 'foo', description: 'bar' })
      const old = await p.update(id, { value: 1 })
      const n = await p.list(id)
      expect(old.value).toBeFalsy()
      expect(n.value).toBe(1)
    })
  })
  describe('.replace', () => {
    let p
    beforeEach(() => {
      p = new Persistence(Model)
    })
    it('should throw a 404 error with invalid id', async (done) => {
      try {
        await p.replace('asd', { title: 'foo', description: 'bar' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
    it('should throw a 404 error with not existing id', async (done) => {
      try {
        const id = mongoose.Types.ObjectId()
        await p.replace(id, { title: 'foo', description: 'bar' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
    it('should throw a 400 error with wrong data', async (done) => {
      try {
        const el = await p.create({ title: 'foo', description: 'bar' })
        await p.replace(el._id, { value: 'asdf' })
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(400)
        expect(e.data).toEqual({
          value: 'Cast to number failed for value "asdf" at path "value"'
        })
        done()
      }
    })
    it('should modify the original with valid data', async () => {
      const id = await p.create({ title: 'foo', description: 'bar' })
      const old = await p.replace(id, { title: 'foo', description: 'bar', value: 1 })
      const n = await p.list(id)
      expect(old.value).toBeFalsy()
      expect(n.value).toBe(1)
    })
  })
  describe('.delete', () => {
    let p
    beforeEach(() => {
      p = new Persistence(Model)
    })
    it('should throw a 404 error with invalid id', async (done) => {
      try {
        await p.delete('asd')
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
    it('should throw a 404 error with not existing id', async (done) => {
      try {
        const id = mongoose.Types.ObjectId()
        await p.delete(id)
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
    it('should delete the original with valid id', async (done) => {
      const id = await p.create({ title: 'foo', description: 'bar' })
      await p.delete(id)
      try {
        await p.list(id)
        done.fail()
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e.status).toBe(404)
        done()
      }
    })
  })
})
