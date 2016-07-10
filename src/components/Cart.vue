<template>

    <div class="col-sm-12 col-lg-12 col-md-12">
        <div class="thumbnail">
            <img v-bind:src="item.image" alt="">
            <div class="cart__item__caption">
                <h4 class="pull-right">&#8381;{{ item.price }}</h4>
                <h4>
                    <a href="#">{{ item.name }}</a>
                </h4>
            </div>
            <div class="center">
                <div class="input-group">
                      <span class="input-group-btn">
                          <button v-on:click.stop.prevent="minus" type="button" class="btn btn-danger btn-number">
                            <span class="glyphicon glyphicon-minus"> </span>
                          </button>
                      </span>
                    <input type="text" name="quant" class="form-control input-number" value="{{ item.quantity }}">
                    <span class="input-group-btn">
                      <button v-on:click.stop.prevent="plus" type="button" class="btn btn-success btn-number">
                          <span class="glyphicon glyphicon-plus"> </span>
                      </button>
                    </span>
                </div>
            </div>
            <div class="remove-from-cart">
                <button v-on:click="removeFromCart()" type="button" class="btn btn-primary btn-sm">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Убрать из корзины
                </button>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    props: [
        'item'
    ],
    methods: {
        plus (event) {
            if (this.item.quantity < this.item.quantityMax) {
                this.item.quantity++;
            }
        },
        minus (event) {
            if (this.item.quantity > this.item.quantityMin) {
                this.item.quantity--;
            }
        },
        removeFromCart() {
            this.$dispatch("removeFromCart", this.item);
        }
    }
}

</script>

<style>

.center{
    width: 150px;
    margin: 40px auto;
}

.cart__item__caption {
    height: 30px;
}

.remove-from-cart {
    margin: 0 0 10px;
    text-align: center;
}

</style>