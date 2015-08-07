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
    }

  });

  grunt.registerTask("default", ["pure-s3:staging"]);
};