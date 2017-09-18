#!/usr/bin/env babel-node --optional es7.asyncFunctions

/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 */

/**
 * 可以重新生成schema.graphql和schema.json。
 * 运行npm run update-schema 命令可以重新生成这2个文件。
 * schema.graphql 直观的展示了全部的type scheme查询类型，通过这个文件我们可以轻松地理解整个服务器的数据结构
 * schema.json graphiql.js控制台第一次访问会请求schema.json，用于查询框智能语法提示
 */

'use strict';

import fs from 'fs';
import path from 'path';
import { Schema } from './schema';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
	var result = await (graphql(Schema, introspectionQuery));
	if (result.errors) {
		console.error(
			'ERROR introspecting schema: ',
			JSON.stringify(result.errors, null, 2)
		);
	} else {
		fs.writeFileSync(
			path.join(__dirname, './schema.json'),
			JSON.stringify(result, null, 2)
		);
	}
})();

// Save user readable type system shorthand of schema
fs.writeFileSync(
	path.join(__dirname, './schema.graphql'),
	printSchema(Schema)
);

console.log('Done. Restart React Native packager using: \n');
console.log('  react-native start --reset-cache\n');
