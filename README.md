# grunt-pure-s3

A Grunt interface into the Amazon S3 Web Services Node.JS SDK `aws-sdk`
this is inspired from [grunt-aws](https://www.npmjs.com/package/grunt-aws)

## Getting Started
This plugin requires Grunt `0.4.x`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```sh
npm install --save-dev grunt-pure-s3
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pure-s3');
```

-----

### Supported Services

This plugin aims to provide a task for each service on AWS.
Currently however, it only supports:

* [Simple Storage Service `"s3"`](#the-s3-task)


-----

## The "s3" task

### Features

* Fast
* Simple
* Auto Gzip
* Smart Local Caching

### Usage

Target staging to upload 'assets' to bucket `preview.domain.com/staging`:

```
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-pure-s3");

  grunt.initConfig({

    "pure-s3": {
      staging: {
        options: {
          bucket: "preview.domain.com",
          accessKeyId: 'AWS-->accessKeyId',
          secretAccessKey: 'AWS-->secretAccessKey',
          region: "us-west-2",
          concurrency: 20,
          cache: false,
          headers: {
            CacheControl: 'max-age=300',
            ContentEncoding: "gzip",
            Expires: new Date('2016')
          }
        },
        expand:true,
        src: "assets/**",
        dest:"staging"
      }

  });

  grunt.registerTask("default", ["pure-s3:staging"]);
};
```


### Options

#### `accessKeyId` *required* (String) 

Amazon access key id

#### `secretAccessKey` *required* (String) 

Amazon secret access key

#### `bucket` *required* (String)

Bucket name

#### `region` (String)

Default *US Standard*

For all possible values, see [Location constraints](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region).

#### `sslEnabled` (Boolean)

Default `true`

SSL is enabled or not

#### `maxRetries` (Number)

Default `3`

Number of retries for a request

#### `access` (String)

Default `"public-read"`

File permissions, must be one of:

* `"private"`
* `"public-read"`
* `"public-read-write"`
* `"authenticated-read"`
* `"bucket-owner-read"`
* `"bucket-owner-full-control"`

#### `gzip` (Boolean)

Default `true`

Gzips the file before uploading and sets the appropriate headers

 **Note: The default is `true` because this task assumes you're uploading content to be consumed by [browsers developed after 1999](http://schroepl.net/projekte/mod_gzip/browser.htm). On the terminal, you can retrieve a file using `curl --compressed <url>`.**

#### `dryRun` (Boolean)

Default `false`

Performs a preview run displaying what would be modified

#### `concurrency` (Number)

Default `20`

Number of S3 operations that may be performed concurrently

#### `overwrite` (Boolean)

Default `true`

Upload files, whether or not they already exist (set to `false` if you never update existing files).

#### `cache` (Boolean)

Default `true`

Skip uploading files which have already been uploaded (same ETag). Each target has it's
own options cache, so if you change the options object, files
will be forced to reupload.

#### `cacheTTL` (Number)

Default `60*60*1000` (1hr)

Number of milliseconds to wait before retrieving the
object list from S3. If you only modify this bucket
from `grunt-aws` on one machine then it can be `Infinity`
if you like. To disable cache, set it to `0`. 

#### `headers` (Object)

Set HTTP headers, please see the [putObject docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property)

The following are allowed:

* `ContentLength`
* `ContentType` (will override mime type lookups)
* `ContentDisposition`
* `ContentEncoding`
* `CacheControl` (accepts a string or converts numbers into header as `max-age=<num>, public`)
* `Expires` (converts dates to strings with `toUTCString()`)
* `GrantFullControl`
* `GrantRead`
* `GrantReadACP`
* `GrantWriteACP`
* `ServerSideEncryption` (`"AES256"`)
* `StorageClass` (`"STANDARD"` or `"REDUCED_REDUNDANCY"`) 
* `WebsiteRedirectLocation`

The properties not listed are still available as:

* `ACL` - `access` option above
* `Body` - the file to be uploaded
* `Key` - the calculated file path
* `Bucket` - `bucket` option above
* `Metadata` - `meta` option below

#### `meta` (Object)

Set **custom** HTTP headers

All custom headers will be prefixed with `x-amz-meta-`.
For example `{Foo:"42"}` becomes `x-amz-meta-foo:42`.

#### `charset` (String)

Add a charset to your `Content-Type`. For example: `utf-8`.

#### `mime` (Object)

Define your own mime types

This object will be passed into [`mime.define()`](https://github.com/broofa/node-mime#mimedefine)

#### `mimeDefault` (String)

Default `"application/octet-stream"`

The default mime type for when [`mime.lookup()`](https://github.com/broofa/node-mime#mimelookuppath) fails

#### `createBucket` (Boolean)

Default `false`

Create the bucket if it does not exist. Use the `bucket` option to name the bucket. Use the `access` and `region` as parameters when creating the bucket.

#### `enableWeb` (object)

Default `false`

Configure static web hosting for the bucket. Set to `true` to enable the default hosting with the `IndexDocument` set to `index.html`. Otherwise, set the value to be an object that matches the parameters required for `WebsiteConfiguration` in [putBucketWebsite docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property).

### Caching

First run will deploy like:

```
Running "s3:uat" (s3) task
Retrieving list of existing objects...
>> Put 'public/vendor/jquery.rest.js'
>> Put 'index.html'
>> Put 'scripts/app.js'
>> Put 'styles/app.css'
>> Put 'public/img/loader.gif'
>> Put 'public/vendor/verify.notify.js'
>> Put 6 files
```

Subsequent runs should look like:

```
Running "s3:uat" (s3) task
>> No change 'index.html'
>> No change 'public/vendor/jquery.rest.js'
>> No change 'styles/app.css'
>> No change 'scripts/app.js'
>> No change 'public/img/loader.gif'
>> No change 'public/vendor/verify.notify.js'
>> Put 0 files
```

### References

* [S3 AWS SDK API Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)

### Todo


#### MIT License

Copyright &copy; 2015 Ian Benschop &lt;ibenschop@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





