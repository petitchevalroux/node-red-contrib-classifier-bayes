"use strict";
var path = require("path");
var classifierCollection = require(path.join(__dirname, "classifier-collection"));
var nodeUtils = require(path.join(__dirname, "node-utils"));

module.exports = function(RED) {
    nodeUtils.setRoutes(RED);
    RED.nodes.registerType("bayes classifier", function(config) {
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
