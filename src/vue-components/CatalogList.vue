<template>
    <div class="catalog-component">
        <loading :active.sync="loading" :is-full-page="false"></loading>
        <div class="sorting-block" v-if="sortParams.length > 0">
          Сортировка
        </div>
        <div class="items-list">
          <catalog-item ref="catalog" v-for="item in items" :key="item.ID" :item="item">
              
          </catalog-item>
        </div>
    </div>
</template>

<script>
import CatalogItem from './CatalogItem'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import History from 'html5-history-api';

export default {
    name: "catalog-list",
    props:[
      'items_json', 
      'ajax_url', 
      'catalog_url',
      'sort_params',
      ],
    data(){
      let res_items = JSON.parse(this.items_json);
      let sort_params = JSON.parse(this.sort_params);

      return{
        items:res_items,
        sortParams: sort_params,
        loading:false,
      }
    },
    components:{
      CatalogItem,
      Loading
    },
    mounted(){
      EventBus.$on('set-filter', this.onSetFilter);
    },
    methods:{
      getRequestParams(){
        let params = "";
        if(location.href.split("?").length > 1){
          params = location.href.split("?")[1];
          params = "?" + params;
        }
        return params;
      },
      onSetFilter(url){
        if(this.loading) return false;

        this.loading = true;
        let ajaxUrl = url.replace(this.catalog_url, this.ajax_url);   
        
        History.pushState(null, null, url + this.getRequestParams());

        axios({
          method: 'get',
          url: ajaxUrl
        })
        .then((response)=>{
          let html = document.createRange().createContextualFragment(response.data);
          let catalogList = html.querySelector('catalog-list');
          let catalogResult = catalogList.getAttribute('items_json');
          this.items = JSON.parse(catalogResult);
          this.loading = false;
        })
        .catch((response)=>{
          this.loading = false;
          console.log('update catalog error');
        }); 

      },
  }
}
</script>

<style>

</style>