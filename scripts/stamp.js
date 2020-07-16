// This file is taken from Bootstrap and adapted.

/* eslint-env node, es6 */

'use strict'

const year = new Date().getFullYear()

const stampTop =
`/*!
  * Simple-Jekyll-Search
  * Copyright 2015-${year}, Christian Fei
  * Licensed under the MIT License.
  */

`

process.stdout.write(stampTop)
process.stdin.pipe(process.stdout)
