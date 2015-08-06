
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-pure-s3");

  grunt.initConfig({

    aws: grunt.file.readJSON("aws-credentials.json"),

    staging: {
      options: {
        bucket: "preview.domain.com",
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        region: "us-west-2",
        concurrency: 20,
        gzip:false,
        cache:false,
        headers: {
          CacheControl: 'max-age=300',
          ContentEncoding: "gzip",
          Expires: new Date('2016')
        }
      }
    },

    production: {
      options: {
        bucket: "production.domain.com",
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        region: "us-west-2",
        concurrency: 20,
        cache:false,
        headers: {
          CacheControl: 'max-age=5000',
          ContentEncoding: "gzip",
          Expires: new Date('2016')
        }
      }
    }
  });

  grunt.registerTask("default", ["staging"]);
};