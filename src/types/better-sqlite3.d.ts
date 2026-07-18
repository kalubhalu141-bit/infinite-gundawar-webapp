declare module 'better-sqlite3' {
  interface Database {
    pragma(source: string): this;
    prepare(sql: string): Statement;
    exec(sql: string): this;
    close(): void;
  }
  interface Statement {
    run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }
  function Database(filename: string, options?: any): Database;
  export default Database;
}
