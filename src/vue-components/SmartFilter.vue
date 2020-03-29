<template>
  <div class="smart-filter">
    <form name="smart-filter" id="filter-form" ref="form" :action="arResult.FORM_ACTION" method="get" class="smart-filter-form">
      <input type="hidden" v-for="input in arResult.HIDDEN" 
        :key="input.ID" 
        :name="input.CONTROL_NAME"
        :id="input.CONTROL_ID"
        :value="input.HTML_VALUE">
      <div class="filter-items-list">
        <!--price-->
        <div class="filter-item">
          <div class="filter-item-wrapper">
            <div class="filter-row item-name">Цена:</div>
            <div class="filter-row price-row" v-if="price">
              <div class="price-input left-input">
                <input type="text" :name="price.VALUES.MIN.CONTROL_NAME" v-model="valuePrice[0]" @change="updateData()">
              </div>
              <div class="price-slider">
                <vue-slider 
                  v-model="valuePrice"
                  @drag-end="updateData"
                  @error="onPriceError" 
                  :min="minPriceRange" 
                  :max="maxPriceRange"
                  :marks="false">
                </vue-slider>
              </div>
              <div class="price-input right-input">
                <input type="text" :name="price.VALUES.MAX.CONTROL_NAME" v-model="valuePrice[1]" @change="updateData()">
              </div>
            </div>
          </div>
        </div>
        <!--end price-->
        <div class="filter-item" v-for="item in arResult.ITEMS" :key="item.ID">
          <div v-if="item.DISPLAY_TYPE == 'A'"><!--//NUMBERS_WITH_SLIDER-->

          </div>
          <div v-else-if="item.DISPLAY_TYPE == 'B'"><!--//NUMBERS-->

          </div>
          <div 
            class="filter-item-wrapper checkboxes-with-picture" 
            v-bind:class="{hidden_item : item.DISPLAY_EXPANDED == 'Y'}"
            v-else-if="item.DISPLAY_TYPE == 'G'"><!--//CHECKBOXES_WITH_PICTURES-->
            <div class="filter-row item-name">
              <span class="toggle-link" @click="toggleProp($event)">{{ item.NAME }}</span>
            </div>
            <div class="filter-value-list drop-down">
              <div class="filter-row checkbox-row" v-for="propItem in item.VALUES" :key="propItem.CONTROL_ID">
                <input
                      type="checkbox"
                      :value="propItem.HTML_VALUE"
                      :name="propItem.CONTROL_NAME"
                      :id="propItem.CONTROL_ID"
                      :checked="propItem.CHECKED"
                      @change="updateData()"
                    />
                <label
                  :class="{ active : propItem.CHECKED }"
                  :disabled="propItem.DISABLED" 
                  :for="propItem.CONTROL_ID"
                  :data-role="'label_'+propItem.CONTROL_ID"
                  >
                  <span class="filter-input-picture">
                    <span class="filter-param-btn color-sl">
                      <!--if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"]))-->
                      <span v-if="propItem.FILE != undefined && propItem.FILE.SRC.length > 0" class="filter-btn-color-icon" :style="'background-image:url('+propItem.FILE.SRC+');'"></span>
                    </span>                   
                  </span>
                  <span class="item-count" v-if="arParams.DISPLAY_ELEMENT_COUNT !== 'N' && propItem.ELEMENT_COUNT != undefined">
                      ({{ propItem.ELEMENT_COUNT }})
                    </span>
                </label>
              </div>
            </div>
          </div>
          <div v-else-if="item.DISPLAY_TYPE == 'H'"><!--//CHECKBOXES_WITH_PICTURES_AND_LABELS-->

          </div>
          <div v-else-if="item.DISPLAY_TYPE == 'P'"><!--//DROPDOWN-->

          </div>
          <div v-else-if="item.DISPLAY_TYPE == 'R'"><!--//DROPDOWN_WITH_PICTURES_AND_LABELS-->

          </div>
          <div v-else-if="item.DISPLAY_TYPE == 'K'"><!--//RADIO_BUTTONS-->

          </div>     
          <div v-else-if="item.DISPLAY_TYPE == 'U'"><!--//CALENDAR-->

          </div>        
          <div 
            class="filter-item-wrapper checkboxes"
            v-bind:class="{hidden_item : item.DISPLAY_EXPANDED == 'Y'}" 
            v-else-if="item.VALUES.length !== 0"> <!--//CHECKBOXES-->
            <div class="filter-row item-name">
              <span class="toggle-link" @click="toggleProp($event)">{{ item.NAME }}</span>
            </div>
            <div class="filter-value-list drop-down">
              <div class="filter-row checkbox-row" v-for="propItem in item.VALUES" :key="propItem.CONTROL_ID">
                <label
                  :disabled="propItem.DISABLED" 
                  :for="propItem.CONTROL_ID"
                  :data-role="'label_'+propItem.CONTROL_ID"
                  >
                  <span class="filter-input-checkbox">
                    <p-check
                      type="checkbox"
                      color="success"
                      :value="propItem.HTML_VALUE"
                      :name="propItem.CONTROL_NAME"
                      :id="propItem.CONTROL_ID"
                      :checked="propItem.CHECKED"
                      @change="updateData()"
                    />
                    <span class="filter-param-text" :title="propItem.VALUE" v-html="propItem.VALUE"></span>
                    <span class="item-count" v-if="arParams.DISPLAY_ELEMENT_COUNT !== 'N' && propItem.ELEMENT_COUNT != undefined">
                      ({{ propItem.ELEMENT_COUNT }})
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-row">
        <button type="button" v-bind:disabled="loading" name="setFilter" @click="setFilter">Применить</button>
      </div>
    </form>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: 'smart-filter',
  data(){
    let price = false;
    let res = JSON.parse(this.result_json);
    let params = JSON.parse(this.param_json);

    for(let index in res.ITEMS){
      if(res.ITEMS[index].PRICE != undefined)
      {
        price = res.ITEMS[index];
        break;
      }
    }
    let curMinPrice = price.VALUES.MIN.HTML_VALUE ? parseInt(price.VALUES.MIN.HTML_VALUE) : price.VALUES.MIN.VALUE;
    let curMaxPrice = price.VALUES.MAX.HTML_VALUE ? parseInt(price.VALUES.MAX.HTML_VALUE) : price.VALUES.MAX.VALUE;
    curMinPrice = 400;
    return {
      arResult:res,
      arParams: params,
      price: price,
      valuePrice: [curMinPrice, curMaxPrice],
      loading: false,
    }
  },
  props: ['result_json', 'param_json'],
  components: {
    VueSlider,    
  },
  created(){
    console.log(this.arResult);
  },
  computed:{
    minPriceRange(){
      return parseInt(this.price.VALUES.MIN.VALUE);
    },
    maxPriceRange(){
      return parseInt(this.price.VALUES.MAX.VALUE);
    },
    priceRangeInterval(){
      return (this.maxPriceRange - this.minPriceRange) / 4;
    },
    marks(){
      let markArr = [];
      for(let i=1; i<5; i++){
        markArr.push(this.priceRangeInterval * i);
      }
      return markArr;
    }
  },
  mounted(){
  
  },
  watch: {

  },
  methods:{
    dragStart(){
      this.selectedMinPrice = this.$refs.slider.currentValue[0]
      this.selectedMaxPrice = this.$refs.slider.currentValue[1]
      console.log(this.$refs.slider.currentValue);
    },
    onPriceError(type, message){
      if(type == 3 || type == 4)
      {
        this.valuePrice[0] = this.minPriceRange;
        this.valuePrice[1] = this.maxPriceRange;
      }
    },
    setFilter(){
      location.href = this.arResult.FILTER_URL;
    },
    updateData(){
      let formData = new FormData(document.getElementById('filter-form'));
      let params = "?ajax=y";

      formData.forEach((value, name)=>{
        params+="&"+name+"="+value;
      });

      this.loading = true;

      axios({
        method: 'get',
        url: this.arResult.FILTER_AJAX_URL + params,
      })
      .then((response)=>{
          this.arResult = response.data;
          this.loading = false;
      })
      .catch((response)=>{
          console.log(response);
          this.loading = false;
      }); 
    },
    toggleProp(e){
      let $el = $(e.target);
      $el.parent().next().slideToggle();
    }
  }
};

</script>

<style scoped >
  .item-name{
    font-weight:600;
    margin-bottom:5px;
  }
  .filter-item-wrapper {
    margin-bottom: 5px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid #ccc;
  }
  .filter-row.price-row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 10px;
  }
  .price-input input{
    width: 50px;
  }
  .price-input.left-input{
    margin-right: 10px;
  }
  .price-input.right-input{
    margin-left: 15px;
  }
  .price-slider{
    width: calc(100% - 125px);
  }
  .filter-btn-color-icon {
    width: 24px;
    height: 24px;
    display: inline-block;
    background-position: center;
    background-size: cover;
    border: 1px solid #ccc;
  }
  .filter-input-picture {
    height: 28px;
    display: inline-block;
  }
  .checkboxes-with-picture label .filter-input-picture{
    border: 2px solid #ccc;
    cursor: pointer;
  }
  .checkboxes-with-picture label.active .filter-input-picture{
    border: 2px solid red;
  }
  .checkboxes-with-picture input{
    display: none;
  }
  .item-count {
    font-size: 14px;
    color: gray;
  }
  .toggle-link {
    border-bottom: 1px dashed;
    cursor: pointer;
  }
  .toggle-link:hover{
    color: blue;
  }
  .drop-down{
    display: none;;
  }
    /* always present */
  .expand-transition {
    transition: all .3s ease;
    height: 30px;
    padding: 10px;
    background-color: #eee;
    overflow: hidden;
  }
  /* .expand-enter defines the starting state for entering */
  /* .expand-leave defines the ending state for leaving */
  .expand-enter, .expand-leave {
    height: 0;
    padding: 0 10px;
    opacity: 0;
  }
</style>
