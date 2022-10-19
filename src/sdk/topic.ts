export class Topic {
    organization: string = '';
    project: string = '';
    network_id: string = '';
    group: string = '';
    name: string = '';
    method: string = '';
      
    constructor(organization, project, network_id = '', group = '', name = '', method = '') {
      this.organization = organization;
      this.project = project;
      this.network_id = network_id;
      this.group = group;
      this.name = name;
      this.method = method;
    }
  
    to_json(): any {
      return {
        organization: this.organization,
        project: this.project,
        network_id: this.network_id,
        group: this.group,
        name: this.name,
        method: this.method
      }
    }
  
    toString(level = 2): string {
      if (level < 1 || level > 6) {
        return '';
      }
      if (level == 1) {
        return this.organization;
      }
      if (level == 2) {
        return `${this.organization}.${this.project}`;
      }
      if (level == 3) {
        return `${this.organization}.${this.project}.${this.network_id}`;
      }
      if (level == 4) {
        return `${this.organization}.${this.project}.${this.network_id}.${this.group}`;
      }
      if (level == 5) {
        return `${this.organization}.${this.project}.${this.network_id}.${this.group}.${this.name}`;
      }
  
      // full level
      return `${this.organization}.${this.project}.${this.network_id}.${this.group}.${this.name}.${this.method}`;
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
      let topic = new Topic(topic_obj.organization, topic_obj.project);
      
      if (topic_obj.network_id) {
        topic.network_id =topic_obj.network_id;
      }
      
      if (topic_obj.group) {
        topic.group =topic_obj.group;
      }
  
      if (topic_obj.name) {
        topic.name =topic_obj.name;
      }
  
      if (topic_obj.method) {
        topic.method =topic_obj.method;
      }
  
      return topic;
    }
  
    static parse_string(topic_string: string): Topic {
      let parts = topic_string.split('.');
      if (parts.length < 2) {
        throw `Atleast organization and project should be given`;
      }
  
      if (parts.length > 6) {
        throw `At most topic shuld be 6 level`;
      }
  
      let topic = new Topic(parts[0], parts[1]);
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
    }
  
    static LEVEL_FULL = 6;      // full topic path, till the method name
    static LEVEL_NAME = 5;      // smartcontract level path, till the name of the smartcontract
    static LEVEL_2 = 2;         // only organization and project.
}
  