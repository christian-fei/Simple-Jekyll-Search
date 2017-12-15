// This file is taken from Bootstrap and adapted.

/* eslint-env node, es6 */

'use strict'

const path = require('path')

const pkg = require(path.resolve('package.json'))
const year = new Date().getFullYear()

const stampTop =
`/*!
  * Simple-Jekyll-Search v${pkg.version} (${pkg.homepage})
  * Copyright 2015-${year}, Christian Fei
  * Licensed under the MIT License.
  */

`

process.stdout.write(stampTop)
process.stdin.pipe(process.stdout)
