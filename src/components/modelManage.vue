<template>
  <div id="content">
    <myhead></myhead>
    <myfoot></myfoot>
  </div>
</template>

<script>
    import myhead from "./head";
    import myfoot from "./foot";
    import {getCookie} from "../assets/js/cookie";

    export default {
      name: "modelManage",

      components: {
        myhead,
        myfoot
      },
      data() {
        return {
          listmore: [],
          page: 1,
          nologin: true,
          haslogin: false,
          userName: '',
          curTrain: '',
          curImgSet: ''
        }
      },
      mounted() {
        if (getCookie('username')) {
          this.nologin = false;
          this.haslogin = true

        }

        console.log('getCookie(\'username\'):');
        console.log(getCookie('username'));
        this.getTrainData()
      },
      methods: {}
    }
</script>

<style lang="scss">
  @import "static/theme.scss";

</style>
