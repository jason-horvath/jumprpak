import ActiveModel from '_models/ActiveModel';

class JwtRefreshToken extends ActiveModel {
  protected table: string = 'jwt_refresh_tokens';
}

export default JwtRefreshToken;
