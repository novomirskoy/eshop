<template>

<modal :show.sync="show" :on-close="close">
    <div class="modal-header">
        <h3>Форма входа</h3>
    </div>

    <div class="modal-body">
        <label class="form-label">
            Адрес электронной почты
            <input v-model="email" type="email" class="form-control">
        </label>
        <label class="form-label">
            Пароль
            <input v-model="password" type="password" class="form-control">
        </label>
    </div>

    <div class="modal-footer text-right">
        <button class="modal-default-button" @click="login()">
            Войти
        </button>
    </div>
</modal>

</template>

<script>

import Modal from './Modal.vue';

export default {
    components: {Modal},
    props: ['show'],
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        close() {
            this.show = false;
            this.email = '';
            this.password = '';
        },
        login() {
            this.close();
        }
    }
}

</script>

<style>

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.text-right {
    text-align: right;
}

.form-label {
    display: block;
    margin-bottom: 1em;
}

.form-label > .form-control {
    margin-top: 0.5em;
}

.form-control {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    line-height: 1.5;
    border: 1px solid #ddd;
}

</style>