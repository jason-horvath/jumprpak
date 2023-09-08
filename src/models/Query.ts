class Query {
  protected sql: string = '';

  public select(): this {
    this.sql = 'SELECT';

    return this;
  }

  public fields(fields: Array<string>): this {
    this.sql = `${this.sql} ${fields.join(', ')}`;

    return this;
  }

  public from(table: string): this {
    this.sql = `${this.sql} FROM ${table}`;

    return this;
  }

  public where(field: string): this {
    this.sql = `${this.sql} WHERE ${field} = ?`;

    return this;
  }

  public whereNot(field: string): this {
    this.sql = `${this.sql} WHERE ${field} != ?`;

    return this;
  }

  public and(field: string): this {
    this.sql = `${this.sql} AND ${field} = ?`;

    return this;
  }

  public andNot(field: string): this {
    this.sql = `${this.sql} AND ${field} != ?`;

    return this;
  }

  public or(field: string): this {
    this.sql = `${this.sql} OR WHERE ${field} = ?`;

    return this;
  }

  public orNot(field: string): this {
    this.sql = `${this.sql} OR ${field} != ?`;

    return this;
  }

  public getSql(): string {
    return `${this.sql};`;
  }
}

export default Query;
