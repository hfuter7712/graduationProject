<template>
  <div id="content">

    <myhead></myhead>

    <!--未登录-->
    <div class="custom-info" v-if="nologin">
        <span class="info">
          充分对你的老照片进行上色修复， 训练自己喜欢的模型
        </span>
      <a  href="/login"
          class="go"
          @click="jump(s='/user')"
      >
        去登录
      </a>
    </div>

    <!--已登录-->
    <div class="custom-info" v-if="haslogin">
      <span class="info">
        您的收藏
      </span>
      <a href="/mine" class="go">
        <em class="glyphicon-edit" ></em>
        编辑
      </a>
    </div>

    <!--公司列表-->
    <ul class="list">
      <li class="list-item"
          v-for="l in listmore"
      >
        <img v-bind:src=l.modelLocation class="item-logo">

        <div class="item-desc">
          <a v-on:click="RouteJump(l)"><h2 class="item-title">{{l.modelName}}</h2></a>
          <p class="item-info">
            <span class="item-pos">
              {{l.modelDetail}}{{'['+l.modelTab+']'}}
            </span>
            <span class="item-salary">
              {{l.modelRate}}
            </span>
          </p>
          <p class="item-time">{{l.modelTime}}</p>
        </div>
      </li>
      <li class="list-more" v-on:click="getMore">加载更多</li>
    </ul>


    <div id="copyright"><p>©2015 lagou.com, all right reserved </p><div class="copyright-item"><span class="phone active">移动版&nbsp;·&nbsp;</span><span class="computer">电脑版&nbsp;·&nbsp;</span><a href="#header">回顶部</a></div></div>

    <myfoot></myfoot>

  </div>
</template>

<script>
  import myhead from './head'
  import myfoot from './foot'
  import {getCookie} from "../assets/js/cookie";
    export default {
        name: "collectModel",
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
          userName: ''
        }
      },
      mounted(){
        if(getCookie('username')) {
          this.nologin = false;
          this.haslogin = true

        }

        console.log('getCookie(\'username\'):');
        console.log(getCookie('username'));
        this.getCollectListData()
      },
      methods:{
        getCollectListData(){
          /*
          this.$http.get('/api/list/more?pageSize=15&pageNo='+this.page)
            .then((response)=>{
              this.listmore = [...this.listmore,...response.data.content.data.page.result]
              console.log('超级输出:');
              console.log(this.listmore);
            })
            */

          this.$http.get('/api/list/getCollectModelList?author='+ getCookie('username')).then((response)=>{
            console.log('response:');
            console.log(response);
            this.listmore = [...this.listmore,...response.data];
            console.log('超级输出:');
            console.log(this.listmore);
          })
        },
        getMore(){
          this.page+=1;
          return this. getCollectListData()
        },
        RouteJump(modelInfo)
        {
          var id = modelInfo.modelId;
          console.log('modelInfo:');
          console.log(modelInfo);
          console.log('id');
          var nextPath = '/model/id=' + id;
          this.$router.push(
            {
              path:  nextPath,
              query: {
                id: id,
              }
            }
          )
        },
      }
    }
</script>

<style lang="scss">
  @import "static/theme.scss";
  .custom-info {
    border-bottom: 1px solid $border_color;
    height: 43px;
    line-height: 43px;
    padding: 0 15px;
    color: #555;
    font-size: 1.4rem;
    position: relative;
    .info {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      margin-right: 100px;
      height: 100%;
      position: relative;
    }
    a.go {
      position: absolute;
      right: 15px;
      top: 0;
      display: block;
      float: right;
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      margin-top: 6px;
      border-radius: 15px;
      background-color: $dim_bg_color;
      color:$base_color;
    }
  }

  .glyphicon-edit{
    width: 10px;
    height: 20px;
    @include foot_icon(-88px,7px);
    display: inline-block;
  }

  //-------copyright-------
  #copyright {
    text-align: center;
    font-size: 1rem;
    margin-top: 30px;
    padding-bottom: 40px;
    color: #333;
    .copyright-item {
      height: 32px;
      line-height: 32px;
      span.active {color: #999;}
      a {color: #333;&:visited{color: #333;}}
    }
  }

</style>
