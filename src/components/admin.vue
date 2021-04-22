<template>
  <div id="content">
    <myhead></myhead>
    <div class = "buttons">
    <a class="button pull-left " href="/admin/ModelManage" style="background-color:sandybrown" v-if="haslogin">管理模型</a>
    <a class="button pull-left " href="/admin" style="background-color:sandybrown" v-if="haslogin">管理用户</a>
    <a class="button pull-left " href="/admin" style="background-color:sandybrown" v-if="haslogin">管理评论</a>
    <a class="button pull-left " href="/admin/trainManage" style="background-color:sandybrown" v-if="haslogin">管理训练请求</a>
    </div>
    <myfoot></myfoot>
  </div>

</template>

<script>
    import myhead from "./head";
    import myfoot from "./foot";
    import {getCookie} from "../assets/js/cookie";

    export default {
        name: "admin",
      components: {
        myhead,
        myfoot
      },
      data(){
        return {
          listmore:[],
          page:1,
          nologin:true,
          haslogin:false,
        }
      },
      mounted(){
        if(getCookie('username')){
          this.nologin = false;
          this.haslogin = true
        }
        this.getListData()
      },
    }
</script>
<style lang="scss" scoped>
  @import "static/theme.scss";
  #content .buttons {
    margin-bottom: 45px;
    margin-top:10%;
    padding: 0 15px;
    .button {
      display: block;
      width: 48%;
      height: 86px;
      line-height: 86px;
      background-color: rgba($base_color,.8);
      text-align: center;
      color: #fff;
      font-size: 1.6rem;
      position: relative;
      margin: 7px;


    }
    &:after{
      @extend %after_clearfix;
    }
    .logout {
      width: 100%;
      height: 40px;
      line-height: 40px;
    }
  }
  </style>


