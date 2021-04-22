<template>

<div id="content">
  <myhead></myhead>
  <div id="'mainW" style="width: 80%; margin-top:1% ">


    <div class="modal fade" id="ModelModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="text-align: left">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">上色记录:{{this.modalShow.recordId}}</h4>
          </div>
          <div class="modal-body">
          记录Id: {{this.modalShow.recordId}}<br>
            上色时间   :  {{this.modalShow.time}}<br>
            使用模型:{{this.modalShow.model}} <router-link tag="a" target="_blank" :to="{path:'/model/id='+this.modalShow.model,query:{id:this.modalShow.model}}">了解详情</router-link>
           <br>
            <div>
            <img :src="rawPic" width="40%" height="35%"> <p>→</p>
            <img :src="resPic" width="40%" height="35%">
            </div>
          </div>
          <div class="modal-footer" >
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal -->
    </div>




    <span style=" margin-left:45% ">
        <el-radio-group v-model="radioButton" @onchange="changeStatus" size="medium" >
            <el-radio-button label="first" >图片上色记录</el-radio-button>
            <el-radio-button label="second">模型训练请求</el-radio-button>
           <el-radio-button label="myComment">发表评论</el-radio-button>
        </el-radio-group>
    </span>
  <div class="divShow" v-show="radioButton=='first'">
    <div>
      <ul class="list">
        <li class="list-item"
            v-for="l in listmore"
        >
          <img v-bind:src="staticImg1" class="item-logo">

          <div class="item-desc">
            <a v-on:click="RouteJump(l)"><h2 class="item-title">{{l.modelName}}</h2></a>
            <p class="item-info">
            <span class="item-pos">
              {{l.recordId}}
            </span>
              <span class="item-salary">
              {{l.modelRate}}
            </span>
            </p>
            <p class="item-time">使用模型Id： {{l.model}} <button class="btn" @click="colorDetail(l)">查看详情</button></p>

          </div>
        </li>
        <li class="list-more" v-on:click="getMore">加载更多</li>
      </ul>


    </div>
  </div>
  <div  class="divShow" v-show="radioButton=='second'">

    <ul class="list">
      <li class="list-item"
          v-for="l in listmore2"
      >
        <img v-bind:src=l.modelLocation class="item-logo">

        <div class="item-desc">
          <a v-on:click="RouteJump(l)"><h2 class="item-title">{{l.name}}</h2></a>
          <p class="item-info">
            <span class="item-pos">
              Epoch:{{l.Epoch}} || batchSize:{{l.batchSize}} || cutSize:{{l.cutSize}}

            </span>
            <span class="check-salary" style="float: right">

            <span style="color: orange" v-if="l.status=='waiting'"> 待审核</span>
                <span style="color: red" v-if="l.status=='no'"> 已驳回</span>
                <span style="color: green" v-if="l.status=='yes'"> 通过</span>
            </span>


          </p>


          作者：{{l.user}}
        </div>
      </li>
      <li class="list-more" v-on:click="getMore2">加载更多</li>
    </ul>

    <div>

    </div>
  </div>
  <div class="divShow" v-show="radioButton=='myComment'">
    <div>

    </div>
  </div>
  </div>

<!--
弃用el-tabs标签，会引起浏览器卡死
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
-->
  <myfoot></myfoot>
</div>

</template>

<script>
    import myhead from "./head";
    import myfoot from "./foot";
    import {getCookie} from "../assets/js/cookie";

    export default {
        name: "record",

      components: {
        myhead,
        myfoot
      },
      data() {
        return {
          listmore: [],
          listmore2:[],
          page: 1,
          nologin: true,
          haslogin: false,
          userName: '',
          curTrain: '',
          curImgSet: '',
          radioButton:'first',
          staticImg1:"/static/recordA.jpg",
          modalShow:'',
          rawPic:'',
          resPic:''

        }
      },
      mounted() {
        if (getCookie('username')) {
          this.nologin = false;
          this.haslogin = true

        }

        console.log('getCookie(\'username\'):');
        console.log(getCookie('username'));
       this.getListData()
        this.getRecordData()
      },
      methods: {
        changeStatus(val){
          console.log(val);
        },

        getListData(){
          /*
          this.$http.get('/api/list/more?pageSize=15&pageNo='+this.page)
            .then((response)=>{
              this.listmore = [...this.listmore,...response.data.content.data.page.result]
              console.log('超级输出:');
              console.log(this.listmore);
            })
            */
          this.$http.get('/api/list/getRecord?user='+getCookie('username')).then((response)=>{
            console.log('response:');
            console.log(response);
            this.listmore = [...this.listmore,...response.data];
            console.log('超级输出:');
            console.log(this.listmore);
          })
        },


        // 加载更多
        getMore(){
          this.page+=1;
          return this.getListData()
        },

        getRecordData(){
          this.$http.get('/api/list/getTrainRecord?user='+getCookie('username')).then((response)=>{
            console.log('response:');
            console.log(response);
            this.listmore2 = [...this.listmore2,...response.data];
            console.log('超级输出:');
            console.log(this.listmore2);
          })
        },
        getMore2(){
          this.page+=1;
          return this.getRecordData()
        },
        colorDetail(l){
          this.modalShow = l;
          this.$http.get('/api/list/getPicSrc?recordId='+l.recordId).then((response)=>{
            console.log(response);
            this.resPic = response.data.resPic;
            this.rawPic = response.data.rawPic;
            $("#ModelModal").modal("show");
          });

        },





      }
    }



</script>

<style lang="scss">
  @import "static/theme.scss";
.divShow{
  margin-left: 20%;
}
</style>

