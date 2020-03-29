import jQuery from "jquery";
import Vue from 'vue';
import axios from 'axios';
window.axios = axios;
import SmartFilter from '../vue-components/SmartFilter.vue';

Vue.component('smart-filter', SmartFilter );

const vue_app = new Vue({
    el: '#app',
});

window.vue_app = vue_app;

jQuery(function() {
  //jQuery("body").css("color", "blue");
});
