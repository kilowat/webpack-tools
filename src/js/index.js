import jQuery from "jquery";
import Vue from 'vue';
import axios from 'axios';
import PrettyCheckbox from 'pretty-checkbox-vue';
import SmartFilter from '../vue-components/SmartFilter.vue';

window.axios = axios;

Vue.use(PrettyCheckbox);

Vue.component('smart-filter', SmartFilter );

const vue_app = new Vue({
    el: '#app',
});

window.vue_app = vue_app;

jQuery(function() {
  //jQuery("body").css("color", "blue");
});
