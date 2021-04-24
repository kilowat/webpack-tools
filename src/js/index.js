import Vue from 'vue';
import Axios from 'axios';
import PrettyCheckbox from 'pretty-checkbox-vue';
import ExampleComponent from '../vue-components/ExampleComponent.vue';


window.Axios = Axios;
window.EventBus = new Vue();

Vue.use(PrettyCheckbox);

Vue.component('example-component', ExampleComponent );

const vue_app = new Vue({
    el: '#app',
});

window.vue_app = vue_app;
