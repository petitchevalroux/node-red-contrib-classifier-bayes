"use strict";
var path = require("path");
var classifierCollection = require(path.join(__dirname, "classifier-collection"));
var nodeUtils = require(path.join(__dirname, "node-utils"));

module.exports = function(RED) {
    nodeUtils.setRoutes(RED);
    RED.nodes.registerType("bayes evaluator node", function(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.classifier = config.classifier;
        var node = this;
        node.total = 0;
        node.success = 0;
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
                    text: "received message for evaluation"
                });
                classifierCollection.getClassifier(node.classifier)
                    .then(function(classifier) {
                        if (classifier === null) {
                            throw new Error(
                                "classifier not found"
                            );
                        }
                        return classifier;
                    })
                    .then(function(classifier) {
                        var category = classifier
                            .classify(
                                msg.payload.content
                            );
                        node.total++;
                        if (category === msg.payload.category) {
                            node.success++;
                        }
                        node.status({
                            fill: "green",
                            shape: "dot",
                            text: "success rate: " +
                                Math.round((
                                    node.success /
                                    node.total *
                                    100)) +
                                "% " +
                                "(total: " +
                                node.total +
                                ")"
                        });
                        return classifier;
                    })
                    .catch(function(err) {
                        nodeUtils.error(node, msg, err,
                            "error evaluating");
                    });
            } catch (err) {
                nodeUtils.error(node, msg, err,
                    "error evaluating");
            }
        });
    });
};
