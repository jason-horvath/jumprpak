import ActiveModel from "_models/ActiveModel";
import { FindOneResult } from "_models/model.types";

class PasswordResetToken extends ActiveModel {
  protected table: string = 'password_reset_tokens';

  public async findbyActiveToken(token: string): Promise<FindOneResult | Error> {
    return this.findActiveByField('reset_token', token);
  }
}

export default PasswordResetToken;
