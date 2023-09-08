import ActiveModel from '_models/ActiveModel';

class Product extends ActiveModel {
  protected table: string = 'products';
}

export default Product;
