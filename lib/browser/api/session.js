const {EventEmitter} = require('events')
const {app} = require('electron')
const {fromPartition, _setWrapSession} = process.atomBinding('session')

const PERSIST_PREFIX = 'persist:'

// Returns the Session from |partition| string.
exports.fromPartition = function (partition = '') {
  if (partition === '') return exports.defaultSession

  if (partition.startsWith(PERSIST_PREFIX)) {
    return fromPartition(partition.substr(PERSIST_PREFIX.length), false)
  } else {
    return fromPartition(partition, true)
  }
}

// Returns the default session.
Object.defineProperty(exports, 'defaultSession', {
  enumerable: true,
  get: function () {
    return fromPartition('', false)
  }
})

// Wraps native Session class.
_setWrapSession(function (session) {
  // Session is an EventEmitter.
  Object.setPrototypeOf(session, EventEmitter.prototype)
  app.emit('session-created', session)
})
