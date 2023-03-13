/**
 * @description Topic is the identifier of the smartcontract in SeascapeSDS.
 * Topics are:
 * - easy to remember
 * - easy to share
 * - easy to filter (using TopicFilter)
 * 
 * *Check the SeascapeSDS documentation about Topics.*
 */
export class Topic {
    organization: string = '';
    project: string = '';
    network_id: string = '';
    group: string = '';
    name: string = '';
    method: string = '';
    event: string = '';
      
    /**
     * Create a new Topic
     * @param organization **required** 
     * @param project **required**
     * @param network_id 
     * @param group 
     * @param name 
     * @param method 
     */
    constructor(organization: string, project: string, network_id = '', group = '', name = '', method = '') {
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
    public to_json(): object {
      return {
        o: this.organization,
        p: this.project,
        n: this.network_id,
        g: this.group,
        s: this.name,
        m: this.method,
        e: this.event,
      }
    }
  
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
    public to_string(level: Number = 2): string {
      let str: string = '';
      if (this.organization.length > 0) {
        str += `o:${this.organization};`
      }
      if (this.project.length > 0) {
        str += `p:${this.project};`
      }
      if (this.network_id.length > 0) {
        str += `n:${this.network_id};`
      }
      if (this.group.length > 0) {
        str += `g:${this.group};`
      }
      if (this.name.length > 0) {
        str += `s:${this.name};`
      }
      if (this.method.length > 0) {
        str += `m:${this.method};`
      }
      if (this.event.length > 0) {
        str += `e:${this.event};`
      }

      // remove the ';' at the end.
      return str.substring(0, str.length - 1)
    }
  
    level() {
      let level =0;
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
    }
  
    static parse_json(topic_obj): Topic {
      let topic = new Topic(topic_obj.o, topic_obj.p);
      
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
    }
  
    static parse_string(topic_string: string): Topic {
      let parts = topic_string.split(';');
      if (parts.length < 2) {
        throw `Atleast organization and project should be given`;
      }
  
      let topic = new Topic("", "");
      for (var part of parts) {
        let path = part.split(':');

        if (path[0] == "o") {
          topic.organization = path[1];
        } else if (path[0] == "p") {
          topic.project = path[1];
        } else if (path[0] == "n") {
          topic.network_id = path[1];
        } else if (path[0] == "g") {
          topic.group = path[1];
        } else if (path[0] == "s") {
          topic.name = path[1];
        } else if (path[0] == "m") {
          topic.method = path[1];
        } else if (path[0] == "e") {
          topic.event = path[1];
        }
      }
  
      return topic;
    }
  
    static LEVEL_FULL = 6;      // full topic path, till the method name
    static LEVEL_NAME = 5;      // smartcontract level path, till the name of the smartcontract
    static LEVEL_2 = 2;         // only organization and project.
}
  