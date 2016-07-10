<template>
    <div class="product">
        <div class="col-sm-4 col-lg-4 col-md-4">
            <div class="thumbnail">
                <img v-bind:src="product.image" alt="">
                <div class="caption">
                    <h4 class="pull-right">&#8381;{{ product.price }}</h4>
                    <h4><a href="#">{{ product.name }}</a>
                    </h4>
                    <p>{{ product.description }}</p>
                    <p>Количество: {{ product.quantity }}</p>
                </div>

                <div class="add-to-cart">
                    <button v-on:click="addToCart()" type="button" class="btn btn-primary btn-sm">
                        <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> В корзину
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'product'
    ],
    methods: {
        addToCart() {
            this.$dispatch('addToCart', this.product);
        }
    }
}
</script>

<style>

    .caption {
        height: 180px;
    }

    .add-to-cart {
        margin: 0 0 10px;
        text-align: center;
    }

    .thumbnail {
        padding: 0;
    }

    .thumbnail .caption-full {
        padding: 9px;
        color: #333;
    }

    .thumbnail img {
        width: 320px;
        height: 150px;
    }

</style>