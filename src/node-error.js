"use strict";
module.exports = {
    log: function(node, msg, err, prefix) {
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
    }
};
