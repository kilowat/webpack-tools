import jQuery from "jquery";
import Vue from 'vue';
import axios from 'axios';
import PrettyCheckbox from 'pretty-checkbox-vue';
import SmartFilter from '../vue-components/SmartFilter.vue';
import CatalogList from '../vue-components/CatalogList.vue';


window.axios = axios;
window.EventBus = new Vue();

Vue.use(PrettyCheckbox);

Vue.component('smart-filter', SmartFilter );
Vue.component('catalog-list', CatalogList );

const vue_app = new Vue({
    el: '#app',
});

window.vue_app = vue_app;

jQuery(function() {
  //jQuery("body").css("color", "blue");
});
