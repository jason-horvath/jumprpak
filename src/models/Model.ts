import database from '_config/database';
import { PoolConnection as PromisePoolConnection, RowDataPacket } from 'mysql2/promise'
import { FindOneResult, FindManyResult, InsertData, InsertFields, InsertResult, InsertValues, UpdateResult, DeleteResult } from './model.types';

class Model {
  
  protected table: string = '';
  protected primaryKey: string = 'id';
  protected database: PromisePoolConnection;

  constructor() {
    this.database = database;
  }

  public getTable(): string {
    return this.table;
  }

  public getPrimaryKey(): string {
    return this.primaryKey;
  }

  public async findAll(): Promise<FindManyResult | Error> {
    try {
      const sql = `SELECT * FROM ${this.table}`;
      const [rows] = await this.database.execute<RowDataPacket[]>(sql);

      return rows;
    } catch (error: any) {
      console.error('findALL Error:', error.message);
      return error as Error;
    }
  }

  public async findByField(field: string, value: string | number): Promise<FindManyResult | Error> {
    try { 
      const sql = this.getFindByFieldSql(field);
      const [rows] = await this.database.execute<RowDataPacket[]>(sql, [value]);
      
      return rows;
    } catch (error: any) {
      console.error('findByField Error:', error.message );
      return error as Error;
    }
    
  }

  public async findById(id: number): Promise<FindOneResult | Error>  {
    try {
      return await this.findFirstByField(this.primaryKey, id);
    } catch (error) {
      console.error('findById Error:', error);
      return error as Error;
    }
    
  }

  public async findFirstByField(field: string, value: string | number): Promise<FindOneResult | Error> {
    try {
      const sql = this.getFindByFieldSql(field);
      const [rows] = await this.database.execute<RowDataPacket[]>(sql, [value]); 
      const record = rows.length > 0 ? rows[0] : {};

      return record as FindOneResult;
    } catch (error) {
      console.error(`Error: Find query on ${this.table}.${field} = ${value} failed.`, error);
      return error as Error;
    }
  }

  public async findOne(sql: string, data: Array<string | number>): Promise<FindOneResult> {
      const [rows] = await this.database.execute<RowDataPacket[]>(sql, data); 
      const record = rows.length > 0 ? rows[0] : {};

      return record as FindOneResult;
  }

  protected getFindByFieldSql(field: string): string {
    return `SELECT * FROM ${this.table} WHERE ${field} = ?`;
  }

  protected getFindByFieldsSql(fields: Array<string>): string {
    const fieldString: string = fields.map(field => `${field} = ?`).join(' AND ');

    return `SELECT * FROM ${this.table} WHERE ${fieldString}`;
  }

  public async insert(data: InsertData): Promise<InsertResult | Error> {
    try {
      const [fields, values] = this.getInsertFieldValueArrays(data);
      const fieldsString = this.getInsertFieldNames(fields);
      const placeholders = this.getInsertValuePlaceholders(values);
      const sql: string = `INSERT INTO ${this.table} (${fieldsString}) VALUES (${placeholders});`;
      const [result] = await this.database.execute<InsertResult>(sql, values);
      
      return result;
;   } catch (error) {
      console.error('Error inserting:', error)
      return error as Error;
    }
  }

  protected getInsertFieldValueArrays(data: InsertData): [InsertFields, InsertValues] {
     const fields = this.getInsertFieldsArray(data);
     const values = this.getInsertValuesArray(data);
     
     return [fields, values];
  }

  protected getInsertFieldsArray(data: InsertData): InsertFields {
    const fields: InsertFields = Array.from(data.keys());

    return fields;
  }

  protected getInsertValuesArray(data: InsertData): InsertValues {
    const values: Array<string | number | null> = Array.from(data.values());

    return values.map((value) => value ?? null);
  }

  protected getInsertFieldNames(fields: InsertFields): string {
    return fields.join(', ')
  }

  protected getInsertValuePlaceholders(values: InsertValues): string {
    return values.map(() => '?').join(', ');
  }

  public async updateFieldById(id: number, field: string, value: string | number): Promise<UpdateResult | Error> {
    try {
      const sql = `UPDATE ${this.table} SET ${field} = ? WHERE ${this.primaryKey} = ?`;
      const [update] = await this.database.execute<UpdateResult>(sql, [value, id]);

      return update;
    } catch(error) {
      console.error(error);
      return error as Error;
    }
  }

  public async deleteById(id: string): Promise<DeleteResult | Error> {
    return await this.deleteWhere(this.primaryKey, id);
  }

  public async deleteWhere(field: string, value: string | number): Promise<DeleteResult | Error> {
    try {
      const sql: string = `DELETE FROM ${this.table} WHERE ${field} = ?`;
      const [deleteResult] = await this.database.execute<DeleteResult>(sql, [value]);

      return deleteResult;
    } catch (error: any) {
      console.error(error);
      return error as Error;
    }
  }
}

export default Model;
