import { ActiveModel } from '_models';
import { FindOneResult } from '_models/model.types';
import { UserRecord } from './account.schema';

class User extends ActiveModel {
  protected table: string = 'users';

  public async findByEmail(email: string): Promise<UserRecord | Error>  {
    const userRecord: FindOneResult | Error = await this.findFirstByField('email', email);

    return userRecord as UserRecord;
  }

  public async findActiveByEmail(email: string): Promise<UserRecord | Error>  {
    const userRecord: FindOneResult | Error = await this.findActiveByField('email', email);

    return userRecord as UserRecord;
  }
}

export default User;
