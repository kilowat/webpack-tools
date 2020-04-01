<template>
    <div class="catalog-component">
        <slot name="catalog-item">
            <catalog-item v-for="item in items" :key="item.ID" :item="item">
                
            </catalog-item>
        </slot>
    </div>
</template>

<script>
import CatalogItem from './CatalogItem'

export default {
    name: "catalog-list",
    props:['items_json', 'ajax_url', 'catalog_url'],
    data(){
      let res_items = JSON.parse(this.items_json);
      return{
        items:res_items,
        loading:false,
      }
    },
    components:{
      CatalogItem,
    },
    mounted(){
      EventBus.$on('set-filter', this.onSetFilter);
    },
    methods:{
      onSetFilter(url){
        console.log(url);
        url = url.replace(this.catalog_url, this.ajax_url);

        axios({
          method: 'get',
          url: url
        })
        .then((response)=>{
            let html = document.createRange().createContextualFragment(response.data);
            let catalogList = html.querySelector('catalog-list');
            let catalogResult = catalogList.getAttribute('items_json');
            this.items = JSON.parse(catalogResult);
            console.log(this.items);
            this.loading = false;
        })
        .catch((response)=>{
            console.log(response);
            this.loading = false;
        }); 

      },
  }
}
</script>

<style>

</style>