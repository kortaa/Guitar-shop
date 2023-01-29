module.exports = function Cart(oldCart){
  this.items = oldCart.items;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = oldCart.totalPrice;

  this.add = function (item, id){
      var storedItem = this.items[id];
      if(!storedItem){
        storedItem = this.items[id] = {item: item, qty: 0, price: 0};
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQty++;
      this.totalPrice += storedItem.item.price;
  };

  this.reduce = function (id){
      this.items[id].qty--;
      this.items[id].price -= parseFloat(this.items[id].item.price).toFixed(2);
      this.items[id].price = parseFloat(this.items[id].price).toFixed(2);
      this.totalQty--;
      this.totalPrice -= parseFloat(this.items[id].item.price).toFixed(2);
      this.totalPrice -= parseFloat(this.totalPrice).toFixed(2);

      if(this.items[id].qty <= 0 ){
          delete this.items[id];
      }
  };

  this.removeItem = function (id){
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= parseFloat(this.items[id].price).toFixed(2);
    delete this.items[id];
  };

  this.generateArray = function (){
      const arr = [];
      for (let id in this.items){
          arr.push(this.items[id]);
      }
      return arr;
  };
};