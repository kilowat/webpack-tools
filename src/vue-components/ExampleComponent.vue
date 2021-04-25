<template>
    <div class="example-component">
      <div class="example-component-name">
        Component name
      </div>
      ExampleComponent
    </div>
</template>

<script>

export default {
    name: "example-component",
    mounted(){
      console.log('example mounted');
    },
}
</script>

<style lang="scss">
  .example-component-name{
    color: green;
  }
</style>