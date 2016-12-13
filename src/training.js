"use strict";
var classifierModule = require("classifier");
var path = require("path");
var classifierCollection = require(path.join(__dirname, "classifier-collection"));
var nodeError = require(path.join(__dirname, "node-error"));

module.exports = function(RED) {
    RED.nodes.registerType("bayes training node", function(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        var node = this;
        this.on("input", function(msg) {
            try {
                if (!node.name) {
                    throw new Error("Missing node name");
                }
                if (!msg.payload) {
                    throw new Error(
                        "Missing message.payload");
                }
                if (!msg.payload.category) {
                    throw new Error(
                        "Missing message.payload.category"
                    );
                }
                if (!msg.payload.content) {
                    throw new Error(
                        "Missing message.payload.content"
                    );
                }
                node.status({
                    fill: "green",
                    shape: "ring",
                    text: "received message for training"
                });
                classifierCollection.getClassifier(node.name)
                    .then(function(classifier) {
                        if (classifier === null) {
                            return classifierCollection
                                .addClassifier(
                                    node.name,
                                    new classifierModule
                                    .Bayesian({})
                                );
                        }
                        return classifier;
                    })
                    .then(function(classifier) {
                        classifier
                            .train(
                                msg.payload.content,
                                msg.payload.category
                            );
                        node.status({
                            fill: "green",
                            shape: "dot",
                            text: "trained"
                        });
                        return classifier;
                    })
                    .catch(function(err) {
                        nodeError.log(node, msg, err,
                            "error training");
                    });
            } catch (err) {
                nodeError.log(node, msg, err,
                    "error training");
            }
        });
    });
};
