"use strict";
var Promise = require("bluebird");
module.exports = {
    classifiers: {},
    addClassifier: function(key, classifier) {
        var self = this;
        return new Promise(function(resolve) {
            self.classifiers[key] = classifier;
            resolve(self.classifiers[key]);
        });
    },
    getClassifier: function(key) {
        var self = this;
        return new Promise(function(resolve) {
            resolve(typeof(self.classifiers[key]) !==
                "undefined" ? self.classifiers[key] : null);
        });
    },
    getClassifierKeys: function() {
        var self = this;
        return new Promise(function(resolve) {
            resolve(Object.getOwnPropertyNames(self.classifiers));
        });
    }
};
