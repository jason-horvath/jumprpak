import ActiveModel from '_models/ActiveModel';

class UserSubscription extends ActiveModel {
  protected table: string = 'user_subscriptions';
}

export default UserSubscription;
