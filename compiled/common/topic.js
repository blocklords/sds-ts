"use strict";
exports.__esModule = true;
exports.Topic = void 0;
/**
 * @description Topic is the identifier of the smartcontract in SeascapeSDS.
 * Topics are:
 * - easy to remember
 * - easy to share
 * - easy to filter (using TopicFilter)
 *
 * *Check the SeascapeSDS documentation about Topics.*
 */
var Topic = /** @class */ (function () {
    /**
     * Create a new Topic
     * @param organization **required**
     * @param project **required**
     * @param network_id
     * @param group
     * @param name
     * @param method
     */
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
    /**
     * Serializes this Topic to the JSON object
     * @returns JSON object
     */
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
    /**
     * Converts Topic into TopicString.
     * The format of the TopicString is: *`<property>:<value>;...`*
     * @param level how many properties it should put into the TopicString.
     * @returns TopicString
     * @example
     *
     * let topic = Topic{
     *    organization: "seascape",
     *    project: "profit-circus",
     *    network_id: "1",
     *    group: "game",
     *    smartcontract: "ProfitCircus"
     * }
     *
     * let topic_string = topic.to_string(2);
     * assert(topic_string == "o:seascape;project:profit-circus");
     */
    Topic.prototype.to_string = function (level) {
        if (level === void 0) { level = 2; }
        if (!Topic.is_valid_level(level)) {
            throw "Invalid ".concat(level, " level parameter was given");
        }
        var str = '';
        if (this.organization.length > 0) {
            str += "o:".concat(this.organization, ";");
        }
        else {
            throw "missing 'organization' parameter";
        }
        if (this.project.length > 0) {
            str += "p:".concat(this.project, ";");
        }
        else {
            throw "missing 'project' parameter";
        }
        // when returning string, remove the ';' at the end.
        if (level == Topic.LEVEL_2) {
            return str.substring(0, str.length - 1);
        }
        if (this.network_id.length > 0) {
            str += "n:".concat(this.network_id, ";");
        }
        else {
            throw "missing 'network_id' parameter";
        }
        if (level == 3) {
            return str.substring(0, str.length - 1);
        }
        if (this.group.length > 0) {
            str += "g:".concat(this.group, ";");
        }
        else {
            throw "missing 'group' parameter";
        }
        if (level == 4) {
            return str.substring(0, str.length - 1);
        }
        if (this.name.length > 0) {
            str += "s:".concat(this.name, ";");
        }
        else {
            throw "missing 'name' parameter";
        }
        if (level == Topic.LEVEL_NAME) {
            return str.substring(0, str.length - 1);
        }
        if (this.method.length == 0 && this.event.length == 0) {
            throw "either 'method' or 'event' should be given. both are missing";
        }
        else if (this.method.length > 0 && this.event.length > 0) {
            throw "either 'method' or 'event' should be given. both are set";
        }
        if (this.method.length > 0) {
            str += "m:".concat(this.method, ";");
        }
        else if (this.event.length > 0) {
            str += "e:".concat(this.event, ";");
        }
        return str.substring(0, str.length - 1);
    };
    /**
     * Checks whether the given level is valid or not.
     * The Valid level is Topic.LEVEL_2 <= level <= Topic.FULL
     * @param level to check against
     */
    Topic.is_valid_level = function (level) {
        return level >= Topic.LEVEL_2 && level <= Topic.LEVEL_FULL;
    };
    /**
     * Returns the topic string level
     * @returns calculated level
     */
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
    /**
     * Creates a Topic from given JSON object.
     * The JSON object should contain atleast organization and project parameters.
     * @param topic_obj JSON object
     * @returns Topic
     * @throws an error in case of missing parameters.
     */
    Topic.parse_json = function (topic_obj) {
        var topic = new Topic(topic_obj["o"], topic_obj["p"]);
        if (topic.level() != Topic.LEVEL_2) {
            throw "missing organization or project parameters";
        }
        if (topic_obj["n"]) {
            topic.network_id = topic_obj["n"];
        }
        if (topic_obj["g"]) {
            topic.group = topic_obj["g"];
        }
        if (topic_obj["s"]) {
            topic.name = topic_obj["s"];
        }
        if (topic_obj["m"]) {
            topic.method = topic_obj["m"];
        }
        if (topic_obj["e"]) {
            if (topic.method.length > 0) {
                throw "both event and method parameters are given. atleast one of them should be set.";
            }
            topic.event = topic_obj["e"];
        }
        return topic;
    };
    /**
     * The reverse of Topic.to_string().
     * It creates the Topic from the given TopicString.
     * @param topic_string TopicString
     * @returns Topic
     */
    Topic.parse_string = function (topic_string) {
        var parts = topic_string.split(';');
        if (Topic.is_valid_level(parts.length)) {
            throw "Topic.is_valid_level() error. TopicString has invalid amount of parts";
        }
        var topic = new Topic("", "");
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            var path = part.split(':');
            if (path[0] == "o") {
                if (topic.organization.length > 0) {
                    throw "duplicate organization parameter";
                }
                topic.organization = path[1];
            }
            else if (path[0] == "p") {
                if (topic.project.length > 0) {
                    throw "duplicate project parameter";
                }
                topic.project = path[1];
            }
            else if (path[0] == "n") {
                if (topic.network_id.length > 0) {
                    throw "duplicate network_id parameter";
                }
                topic.network_id = path[1];
            }
            else if (path[0] == "g") {
                if (topic.group.length > 0) {
                    throw "duplicate group parameter";
                }
                topic.group = path[1];
            }
            else if (path[0] == "s") {
                if (topic.name.length > 0) {
                    throw "duplicate name parameter";
                }
                topic.name = path[1];
            }
            else if (path[0] == "m") {
                if (topic.method.length > 0) {
                    throw "duplicate method parameter";
                }
                else if (topic.event.length > 0) {
                    throw "event parameter was set. Topic could contain either event or method parameter";
                }
                topic.method = path[1];
            }
            else if (path[0] == "e") {
                if (topic.event.length > 0) {
                    throw "duplicate event parameter";
                }
                else if (topic.event.length > 0) {
                    throw "method parameter was set. Topic could contain either event or method parameter";
                }
                topic.event = path[1];
            }
        }
        return topic;
    };
    /**
     * TopicString of the smartcontract with a method or an event parameter.
     */
    Topic.LEVEL_FULL = 6;
    /**
     * TopicString with the smartcontract parameter. Omits event/method parameter.
     */
    Topic.LEVEL_NAME = 5;
    /**
     * TopicString with the project parameters
     */
    Topic.LEVEL_2 = 2;
    return Topic;
}());
exports.Topic = Topic;
//# sourceMappingURL=topic.js.map