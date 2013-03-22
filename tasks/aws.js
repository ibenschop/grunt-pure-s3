// Generated by CoffeeScript 1.6.2
"use strict";
var AWS, AWSTask, fs, glob, path, requiredir, services, _;

glob = require("glob-manifest");

fs = require("fs");

path = require("path");

_ = require("lodash");

requiredir = require("require-dir");

AWS = require("aws-sdk");

services = requiredir("./services");

AWSTask = (function() {
  AWSTask.prototype.defaults = {
    baz: 5
  };

  function AWSTask(grunt, task) {
    this.grunt = grunt;
    this.task = task;
    this.name = this.task.target;
    this.grunt.config.requires(['aws', this.name, 'service']);
    this.grunt.config.requires(['aws', 'options', 'config', 'accessKeyId']);
    this.grunt.config.requires(['aws', 'options', 'config', 'secretAccessKey']);
    this.data = this.task.data;
    this.service = this.task.data.service;
    this.opts = this.task.options();
    this.done = this.task.async();
    this.config();
  }

  AWSTask.prototype.config = function() {
    AWS.config.update(this.opts.config);
    return this.startService();
  };

  AWSTask.prototype.startService = function() {
    var Service, serviceOpts;

    Service = services[this.service];
    if (!Service) {
      this.grunt.fail.fatal("Sorry the '" + this.service + "' service does not exist yet. Please contribute!");
    }
    if (this.opts[this.service]) {
      serviceOpts = this.opts[this.service];
      delete this.opts[this.service];
    }
    this.opts = _.extend({}, this.defaults, Service.prototype.defaults || {}, serviceOpts || {}, this.opts);
    this.grunt.log.writeln("Running service: " + this.service + "...");
    new Service(this.grunt, this.opts, this.data, this.done);
    return null;
  };

  return AWSTask;

})();

module.exports = function(grunt) {
  return grunt.registerMultiTask("aws", "A Grunt interface into the Amazon Node.JS SDK", function() {
    return new AWSTask(grunt, this);
  });
};