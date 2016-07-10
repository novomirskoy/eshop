<template>
    <div id="app">

        <modal :show.sync="showLoginModal">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">Форма входа</h4>
            </div>
            <div slot="modal-body" class="modal-body">

                <div class="alert alert-danger" role="alert" v-show="authError" transition="fade">
                    Неверный email или пароль
                </div>

                <label class="form-label">
                    Адрес электронной почты
                    <input
                        v-model="creds.email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        class="form-control">
                </label>
                <label class="form-label">
                    Пароль
                    <input
                        v-model="creds.password"
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        required
                        class="form-control">
                </label>
            </div>

            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click='showLoginModal = false'>Закрыть</button>
                <button type="button" class="btn btn-success" @click='login()'>Войти</button>
            </div>
        </modal>

        <modal :show.sync="showRegisterModal">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">Форма регистрации</h4>
            </div>

            <div slot="modal-body" class="modal-body">

                <div class="alert alert-danger" role="alert" v-show="registerError" transition="fade">
                    Такой пользователь уже существует
                </div>

                <label class="form-label">
                    Адрес электронной почты
                    <input
                            v-model="user.email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            class="form-control">
                </label>
                <label class="form-label">
                    Пароль
                    <input
                            v-model="user.password"
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            required
                            class="form-control">
                </label>
            </div>

            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click='showRegisterModal = false'>Закрыть</button>
                <button type="button" class="btn btn-success" @click='register()'>Зерегистрировать</button>
            </div>
        </modal>

        <alert
            :show.sync="orderFormationSuccess"
            :duration="3000"
            type="success"
            width="400px"
            placement="top-left"
            dismissable>
            <span class="icon-ok-circled alert-icon-float-left"></span>
            <strong>Поздравляем</strong>
            <p>Уведомление о заказе отправлено на почту</p>
        </alert>

        <div class="col-md-3">
            <p class="lead">Корзина</p>

            <div v-if="showLoginAndRegisterButtons" class="login-or-register">
                <div class="btn-group " role="group">
                    <button type="button" @click="showLoginModal = true" class="btn btn-info">Войти</button>
                    <button type="button" @click="showRegisterModal = true" class="btn btn-success">Зарегистрироваться</button>
                </div>
            </div>

            <div v-if="cartEmpty">
                Корзина пуста
            </div>
            <div v-else class="add-to-cart">
                <button v-on:click="formation()" type="button" class="btn btn-primary btn-sm">
                    <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Оформить заказ
                </button>
            </div>

            <cart
                v-for="item in cart"
                :item="item"
                track-by="id">
            </cart>
        </div>

        <div class="col-md-9">
            <div class="row">
                <div class="products">
                    <product
                            v-for="product in products"
                            :product="product"
                            track-by="id">
                    </product>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Product from './components/Product.vue';
import Cart from './components/Cart.vue';
import ws from './assets/js/ws';
import CartProduct from './services/Cart.js';
import LoginModal from './components/LoginModal.vue';
import {modal, alert} from 'vue-strap';
import auth from './services/Auth.js';

export default {
    components: {
        Product,
        Cart,
        LoginModal,
        modal,
        alert
    },
    data () {
        return {
            msg: 'Hello Vue!',
            products: [],
            cart: [],
            cartEmpty: true,
            session: '',
            showLoginModal: false,
            showRegisterModal: false,
            show: false,
            creds: {
                email: '',
                password: ''
            },
            user: {
                email: '',
                password: ''
            },
            showLoginAndRegisterButtons: false,
            authError: false,
            registerError: false,
            orderFormationSuccess: false
        }
    },
    ready () {
        let self = this;

        ws.on("socket/connect", function (session) {
            self.session = session;

            self.$dispatch("products");
        });

        ws.on("socket/disconnect", function (error) {
            self.session = '';
            console.log("Disconnected for " + error.reason + " with code " + error.code);
        });
    },
    events: {
        "products": function () {
            let self = this;

            this.session.subscribe("product/channel", function (uri, payload) {
                self.products = payload.products;
            });
        },
        "addToCart": function (product) {
            let cartItem = {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "image": product.image,
                "quantity": 1,
                "quantityMin": 0,
                "quantityMax": product.quantity
            };

            this.cart.push(cartItem);
        },
        "removeFromCart": function (item) {
            console.log("remove from cart item ", item.id);

            this.cart = this.cart.filter(function (value) {
                if (value.id !== item.id) {
                    return true;
                }
            });
        }
    },
    methods: {
        formation () {
            let self = this;

            console.log("Оформить заказ", this.cart);

            if (auth.checkAuth()) {
                console.log('Оформляем заказ', this.cart, auth.user.email);

                this.session.call("order/formation", {"email": auth.user.email, "cart": this.cart}).then(
                    function (result) {
                        self.orderFormationSuccess = true;
                        self.cart = [];

                        console.log('Заказ обработан, уведомления отправлены');
                    },
                    function (error, desc) {
                        console.log('Заказ не обработан', error, desc);
                    }
                );
            } else {
                this.showLoginAndRegisterButtons = true;
                console.log('Войти или зарегистрироваться и войти чтобы оформить заказ');
            }
        },
        login () {
            auth.login(this, this.creds);
            this.creds = {email: '', password: ''};
        },
        register () {
            auth.register(this, {
                "email": this.user.email,
                "password": this.user.password
            });

            this.user.email = '';
            this.user.password = '';
        },
        logout () {
            auth.logout();
        },
        showAuthError () {
            this.authError = true;
        },
        hideAuthError () {
            this.authError = false;
        },
        showRegisterError () {
            this.registerError = true;
        },
        hideRegisterError () {
            this.registerError = false;
        }
    },
    watch: {
        "cart": function (val) {
            this.cartEmpty = this.cart.length <= 0;
        }
    }
}
</script>

<style>
    body {
        font-family: Helvetica, sans-serif;
    }

    .login-or-register {
        margin: 0 0 10px;
        text-align: center;
    }
</style>
