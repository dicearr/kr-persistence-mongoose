# kr-persistence-mongoose

[![Build Status](https://travis-ci.org/dicearr/kr-persistence-mongoose.svg?branch=master)](https://travis-ci.org/dicearr/kr-persistence-mongoose) [![Coverage Status](https://coveralls.io/repos/github/dicearr/kr-persistence-mongoose/badge.svg?branch=master)](https://coveralls.io/github/dicearr/kr-persistence-mongoose?branch=master)

> [koa-rester](https://github.com/dicearr/koa-rester) module for adding Mongo persistence using mongoose.

<a name="Persistence"></a>

## Persistence
**Kind**: global class  

* [Persistence](#Persistence)
    * [new Persistence(model)](#new_Persistence_new)
    * [.list(id)](#Persistence+list) ⇒ <code>Promise</code>
    * [.create(data)](#Persistence+create) ⇒ <code>Promise</code>
    * [.update(id, data)](#Persistence+update) ⇒ <code>Promise</code>
    * [.replace(id, data)](#Persistence+replace) ⇒ <code>Promise</code>
    * [.delete(id)](#Persistence+delete) ⇒ <code>Promise</code>

<a name="new_Persistence_new"></a>

### new Persistence(model)
Create a KoaResterPersistence


| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The mongoose model |

<a name="Persistence+list"></a>

### persistence.list(id) ⇒ <code>Promise</code>
If id is provided, it tries to get the element with the given id.
It will throw an error if no element is found. If no id is provided
lists all the stored items.

**Kind**: instance method of [<code>Persistence</code>](#Persistence)  
**Returns**: <code>Promise</code> - Resolved with the object or the array of objects or
rejected with an error.  
**Async**:   

| Param | Type |
| --- | --- |
| id | <code>String</code> |

<a name="Persistence+create"></a>

### persistence.create(data) ⇒ <code>Promise</code>
Creates a new object with the given data.

**Kind**: instance method of [<code>Persistence</code>](#Persistence)  
**Returns**: <code>Promise</code> - Resolved with the new object or rejected with an error.  

| Param | Type |
| --- | --- |
| data | <code>Object</code> |

<a name="Persistence+update"></a>

### persistence.update(id, data) ⇒ <code>Promise</code>
Updates an existing object with the given data.

**Kind**: instance method of [<code>Persistence</code>](#Persistence)  
**Returns**: <code>Promise</code> - Resolved with the old object or rejected with an error.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The object id |
| data | <code>Object</code> | The fields to be updated |

<a name="Persistence+replace"></a>

### persistence.replace(id, data) ⇒ <code>Promise</code>
Replaces an existing object by a new one created with the given data.

**Kind**: instance method of [<code>Persistence</code>](#Persistence)  
**Returns**: <code>Promise</code> - Resolved with the old object or rejected with an error.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The id of the object to be replaced |
| data | <code>Object</code> | The new object data |

<a name="Persistence+delete"></a>

### persistence.delete(id) ⇒ <code>Promise</code>
Deletes an existing object.

**Kind**: instance method of [<code>Persistence</code>](#Persistence)  
**Returns**: <code>Promise</code> - Resolved with the removed object or rejected with an error.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The id of the object to be deleted |
