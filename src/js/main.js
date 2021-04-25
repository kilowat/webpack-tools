import Vue from 'vue';
import lazyLoadComponent from '../vue-components/utils/lazy-load-components';
import ExampleSkeletonBox from '../vue-components/ExampleComponentSkeletonBox.vue';

window.EventBus = new Vue();

Vue.component(
  'example-component', 
  lazyLoadComponent({
    componentFactory: () => import('../vue-components/ExampleComponent.vue'),
    loading: ExampleSkeletonBox,
  })
);


const vue_app = new Vue({
  el: '#app',

});

window.vue_app = vue_app;
