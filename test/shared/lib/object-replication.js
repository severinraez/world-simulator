'use strict'

let expect = require('chai').expect
let replication = require('app/shared/lib/object-replication.js')

describe('object replication', () => {
    before(function() {
    })
    describe('diff applying', function() {
	before(function() {
	    this.before = { foo: 'bar', toRemove: 'present' }
	    this.delta = { added: 'added', toRemove: undefined, foo: 'changed' }
	    this.after = replication.apply(this.delta, before)
	})

	it('should add keys', function() {
	    expect(this.after).to.include.keys('added')
	})
	it('should remove keys', function () {
	    expect(this.after).to.not.include.keys('toRemove')
	})
	it('should update keys', function() {
	    expect(this.after).to.include.keys('foo')
	    expect(this.after.foo).to.equal('changed')
	})
    })
})
