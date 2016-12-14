"use strict";
var path = require("path");
var classifierCollection = require(path.join(__dirname, "classifier-collection"));
var nodeUtils = require(path.join(__dirname, "node-utils"));

module.exports = function(RED) {
    // Callback route the visitor is returned from pocket website
    RED.httpAdmin.get("/bayes/classifiers", function(req, res) {
        classifierCollection.getClassifierKeys()
            .then(function(keys) {
                res.setHeader("Content-Type",
                    "application/json");
                res.send(JSON.stringify(keys));
                return keys;
            })
            .catch(function(err) {
                res.status(500)
                    .send(err.message);
            });
    });
    RED.nodes.registerType("bayes classifier node", function(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.classifier = config.classifier;
        var node = this;
        this.on("input", function(msg) {
            node.status({
                fill: "green",
                shape: "ring",
                text: "received message to classify"
            });
            try {
                classifierCollection.getClassifier(node.classifier)
                    .then(function(classifier) {
                        if (classifier === null) {
                            return;
                        }
                        var category = classifier.classify(
                            msg.payload);
                        node.send({
                            "payload": category,
                            "source": msg
                        });
                        node.status({
                            fill: "green",
                            shape: "dot",
                            text: "message classified"
                        });
                        return category;
                    })
                    .catch(function(err) {
                        nodeUtils.error(node, msg, err,
                            "error classify");
                    });

            } catch (err) {
                nodeUtils.error(node, msg, err,
                    "error classify");
            }
        });
    });
};
