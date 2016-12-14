"use strict";
var path = require("path");
var classifierCollection = require(path.join(__dirname, "classifier-collection"));

module.exports = {
    error: function(node, msg, err, prefix) {
        var info = JSON.stringify({
            "error": err.message,
            "msg": msg
        });
        var str = prefix + " " + info;
        node.status({
            fill: "red",
            shape: "dot",
            text: str
        });
        node.error(str);
    },
    setRoutes: function(RED) {
        if (!this.routesSetted) {
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
            this.routesSetted = true;
        }
    }
};
