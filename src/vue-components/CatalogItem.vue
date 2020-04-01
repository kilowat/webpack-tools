<template>
    <div class="catalog-item">
        <div class="item-name">
            <slot name="item-name">
                <a :href="item.DETAIL_PAGE_URL" :title="item.NAME"> {{item.NAME}} </a>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "catalog-item",
    props:['item']
}
</script>

<style>

</style>