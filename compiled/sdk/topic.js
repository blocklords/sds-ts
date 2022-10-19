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
        this.organization = organization;
        this.project = project;
        this.network_id = network_id;
        this.group = group;
        this.name = name;
        this.method = method;
    }
    Topic.prototype.to_json = function () {
        return {
            organization: this.organization,
            project: this.project,
            network_id: this.network_id,
            group: this.group,
            name: this.name,
            method: this.method
        };
    };
    Topic.prototype.toString = function (level) {
        if (level === void 0) { level = 2; }
        if (level < 1 || level > 6) {
            return '';
        }
        if (level == 1) {
            return this.organization;
        }
        if (level == 2) {
            return "".concat(this.organization, ".").concat(this.project);
        }
        if (level == 3) {
            return "".concat(this.organization, ".").concat(this.project, ".").concat(this.network_id);
        }
        if (level == 4) {
            return "".concat(this.organization, ".").concat(this.project, ".").concat(this.network_id, ".").concat(this.group);
        }
        if (level == 5) {
            return "".concat(this.organization, ".").concat(this.project, ".").concat(this.network_id, ".").concat(this.group, ".").concat(this.name);
        }
        // full level
        return "".concat(this.organization, ".").concat(this.project, ".").concat(this.network_id, ".").concat(this.group, ".").concat(this.name, ".").concat(this.method);
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
        var topic = new Topic(topic_obj.organization, topic_obj.project);
        if (topic_obj.network_id) {
            topic.network_id = topic_obj.network_id;
        }
        if (topic_obj.group) {
            topic.group = topic_obj.group;
        }
        if (topic_obj.name) {
            topic.name = topic_obj.name;
        }
        if (topic_obj.method) {
            topic.method = topic_obj.method;
        }
        return topic;
    };
    Topic.parse_string = function (topic_string) {
        var parts = topic_string.split('.');
        if (parts.length < 2) {
            throw "Atleast organization and project should be given";
        }
        if (parts.length > 6) {
            throw "At most topic shuld be 6 level";
        }
        var topic = new Topic(parts[0], parts[1]);
        if (parts.length > 2) {
            topic.network_id = parts[2];
        }
        if (parts.length > 3) {
            topic.group = parts[3];
        }
        if (parts.length > 4) {
            topic.name = parts[4];
        }
        if (parts.length > 5) {
            topic.method = parts[5];
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