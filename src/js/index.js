import jQuery from "jquery";
import Vue from 'vue';
import axios from 'axios';
import PrettyCheckbox from 'pretty-checkbox-vue';
import ExampleComponent from '../vue-components/ExampleComponent.vue';


window.axios = axios;
window.EventBus = new Vue();

Vue.use(PrettyCheckbox);

Vue.component('example-component', ExampleComponent );

const vue_app = new Vue({
    el: '#app',
});

window.vue_app = vue_app;

jQuery(function() {
  //jQuery("body").css("color", "blue");
});
