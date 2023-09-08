import Model from './Model';
import { FindOneResult, UpdateResult } from './model.types';
import { RowDataPacket } from 'mysql2/promise';

class ActiveModel extends Model {
  public async findActiveByField(field: string, value: string | number): Promise<FindOneResult | Error> {
    return await this.findByFieldAndActive(field, value, 1);
  }

  public async findActiveById(id: string): Promise<FindOneResult | Error> {
    return await this.findByFieldAndActive(this.primaryKey, id, 1);
  }

  public async findInactiveById(id: string): Promise<FindOneResult | Error> {
    return await this.findByFieldAndActive(this.primaryKey, id, 0);
  }

  public async findByFieldAndActive(field: string, value: string | number, active: number): Promise<FindOneResult | Error> {
    try {
      const sql: string = `SELECT * FROM ${this.table} WHERE ${field} = ? AND active = ?`;
      const [activeRecord] = await this.database.execute<RowDataPacket[]>(sql, [value, active]);
      const record = activeRecord.length > 0 ? activeRecord[0] : {};
      
      return record as FindOneResult;
    } catch (error: any) {
      console.error(error);
      return error as Error;
    }
  }

  public async activate(id: number): Promise<UpdateResult | Error> {
    return await this.updateFieldById(id, 'active', 1);
  }

  public async deactivate(id: number): Promise<UpdateResult | Error> {
    return await this.updateFieldById(id, 'active', 0);
  }
}

export default ActiveModel;
