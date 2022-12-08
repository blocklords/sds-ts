"use strict";
exports.__esModule = true;
exports.Topic = void 0;
var Topic = /** @class */ (function () {
    function Topic(organization, project, network_id, group, name, method) {
        if (network_id === void 0) { network_id = ''; }
        if (group === void 0) { group = ''; }
        if (name === void 0) { name = ''; }
        if (method === void 0) { method = ''; }
        this.organization = '';
        this.project = '';
        this.network_id = '';
        this.group = '';
        this.name = '';
        this.method = '';
        this.event = '';
        this.organization = organization;
        this.project = project;
        this.network_id = network_id;
        this.group = group;
        this.name = name;
        this.method = method;
    }
    Topic.prototype.to_json = function () {
        return {
            o: this.organization,
            p: this.project,
            n: this.network_id,
            g: this.group,
            s: this.name,
            m: this.method,
            e: this.event
        };
    };
    Topic.prototype.toString = function (level) {
        if (level === void 0) { level = 2; }
        var str = '';
        if (this.organization.length > 0) {
            str += "o:".concat(this.organization, ";");
        }
        if (this.project.length > 0) {
            str += "p:".concat(this.project, ";");
        }
        if (this.network_id.length > 0) {
            str += "n:".concat(this.network_id, ";");
        }
        if (this.group.length > 0) {
            str += "g:".concat(this.group, ";");
        }
        if (this.name.length > 0) {
            str += "s:".concat(this.name, ";");
        }
        if (this.method.length > 0) {
            str += "m:".concat(this.method, ";");
        }
        if (this.event.length > 0) {
            str += "e:".concat(this.event, ";");
        }
        // remove the ';' at the end.
        return str.substring(0, str.length - 1);
    };
    Topic.prototype.level = function () {
        var level = 0;
        if (this.organization) {
            level++;
        }
        if (this.project) {
            level++;
        }
        if (this.network_id) {
            level++;
        }
        if (this.group) {
            level++;
        }
        if (this.name) {
            level++;
        }
        if (this.method) {
            level++;
        }
        return level;
    };
    Topic.parse_json = function (topic_obj) {
        var topic = new Topic(topic_obj.o, topic_obj.p);
        if (topic_obj.n) {
            topic.network_id = topic_obj.n;
        }
        if (topic_obj.g) {
            topic.group = topic_obj.g;
        }
        if (topic_obj.s) {
            topic.name = topic_obj.s;
        }
        if (topic_obj.m) {
            topic.method = topic_obj.m;
        }
        if (topic_obj.e) {
            topic.event = topic_obj.e;
        }
        return topic;
    };
    Topic.parse_string = function (topic_string) {
        var parts = topic_string.split(';');
        if (parts.length < 2) {
            throw "Atleast organization and project should be given";
        }
        var topic = new Topic("", "");
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            var path = part.split(':');
            if (path[0] == "o") {
                topic.organization = path[1];
            }
            else if (path[0] == "p") {
                topic.project = path[1];
            }
            else if (path[0] == "n") {
                topic.network_id = path[1];
            }
            else if (path[0] == "g") {
                topic.group = path[1];
            }
            else if (path[0] == "s") {
                topic.name = path[1];
            }
            else if (path[0] == "m") {
                topic.method = path[1];
            }
            else if (path[0] == "e") {
                topic.event = path[1];
            }
        }
        return topic;
    };
    Topic.LEVEL_FULL = 6; // full topic path, till the method name
    Topic.LEVEL_NAME = 5; // smartcontract level path, till the name of the smartcontract
    Topic.LEVEL_2 = 2; // only organization and project.
    return Topic;
}());
exports.Topic = Topic;
//# sourceMappingURL=topic.js.map