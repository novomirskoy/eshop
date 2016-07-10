export default {
    cart: {

    },
    add(data) {
      let key = data["id"];

      this.cart[key] = data;
    },
    remove(id) {
        if (this.cart.hasOwnProperty(id)) {
            delete this.cart[id];
        }
    }
}