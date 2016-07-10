import Vue from 'vue';
import App from './App.vue';
import ws from './assets/js/ws';

var vm = new Vue({
  el: 'body',
  components: {
    App
  },
  data: {
    products: []
  }
});
