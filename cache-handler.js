const { FileSystemCache } = require('next/dist/server/lib/incremental-cache/file-system-cache')

module.exports = class MyFileSystemCache extends FileSystemCache {
  constructor(options) {
    super(options)
  }
} 