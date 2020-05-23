<template>
  <div>
      <div class="nodata" v-if="!$store.state.app.loading">
        <img src="@/assets/img/nodata_white.png" alt="" v-if="!theme" />
        <img src="@/assets/img/nodata_dark.png" alt="" v-if="theme" />
        <p>{{$t('list.nodata')}}</p>
      </div>
  </div>
</template>

<script>
  export default {
      props:{
        
      },
      computed:{
        theme(){
          return this.$store.state.app.theme;
        }
      },
      methods:{

      }
  }
</script>

<style lang="scss" scoped>
  
</style>