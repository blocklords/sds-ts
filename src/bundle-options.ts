export class BundleOptions {
  pool_limit: number;
  pool_expire_seconds: number;
  length_argument_name: string;
  
  constructor(pool_limit: number = 100, length_argument_name: string = "", pool_expire_seconds: number = 3600) {
    this.pool_limit = pool_limit;
    this.pool_expire_seconds = pool_expire_seconds;
    this.length_argument_name = length_argument_name;
  }

  toJSON(): any {
    return {
      pool_limit: this.pool_limit,
      pool_expire_seconds: this.pool_expire_seconds,
      length_argument_name: this.length_argument_name,
    }
  }
}
