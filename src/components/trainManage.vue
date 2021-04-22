<template>
    <div id="content">
      <myhead></myhead>
      <div class="custom-info" v-if="nologin">
        <span class="info">
         训练请求管理
        </span>
        <a  href="/login"
            class="go"
            @click="jump(s='/user')"
        >
          去登录
        </a>
      </div>
      <div class="custom-info" v-if="haslogin">
      <span class="info">
        训练请求管理
      </span>
        <a href="/mine" class="go">
          <em class="glyphicon-edit" ></em>
          编辑
        </a>
      </div>

      <ul class="list">
        <li class="list-item"
            v-for="l in listmore"
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

            <div class="modal fade" id="ModelModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="text-align: left">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header" style="font-size: 18px">
                  模型训练请求处理
                  </div>
                  <div class="modal-body">
                   模型请求名称:  {{curTrain.batchSize}}<br>
                    训练id:{{curTrain.trainId}}<br>
                    作者:{{curTrain.user}}<br>
                    Epoch: {{curTrain.Epoch}}<br>
                    batchSize:{{curTrain.batchSize}}<br>
                    cutSize: {{curTrain.cutSize}}<br>
                    当前状态: {{curTrain.status}}<br>
                    请求日期:{{curTrain.reqDate}}<br>
                    训练集大小:{{curTrain.trainSetSize}}<br>
                    <button class="btn" @click="trainSetLoad()">查看训练集</button>

                  </div>
                  <div class="modal-footer" >
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-success"  @click="trainJudge('yes')">通过</button>
                    <button type="button" class="btn btn-danger"  @click="trainJudge('no')">驳回</button>
                  </div>
                </div><!-- /.modal-content -->
              </div><!-- /.modal -->
            </div>

            作者：{{l.user}}    <button @click="trainDetail(l)">查看详情</button>
          </div>
        </li>
        <li class="list-more" v-on:click="getMore">加载更多</li>
      </ul>



      <myfoot></myfoot>
    </div>

</template>

<script>
      import myhead from './head'
      import myfoot from './foot'
      import {getCookie} from "../assets/js/cookie";
    export default {
      name: "trainManage",
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
          userName: '',
          curTrain:'',
          curImgSet:''
        }
      },
      mounted(){
        if(getCookie('username')) {
          this.nologin = false;
          this.haslogin = true

        }

        console.log('getCookie(\'username\'):');
        console.log(getCookie('username'));
        this.getTrainData()
      },
      methods:{
        getTrainData(){
          /*
          this.$http.get('/api/list/more?pageSize=15&pageNo='+this.page)
            .then((response)=>{
              this.listmore = [...this.listmore,...response.data.content.data.page.result]
              console.log('超级输出:');
              console.log(this.listmore);
            })
            */
          this.$http.get('/api/list/getTrainList').then((response)=>{
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
          return this.getTrainData()
        },
        trainDetail(l){
          this.curTrain = l;
          this.curImgSet = '';
          let Id = this.curTrain.trainId;
          let reURL = '/api/list/getSimpleTrainSet'+'?id='+Id;
          this.$http.get(reURL).then((response)=>{

          });
          $('#ModelModal').modal('show');
        },
        trainJudge(info){
          let Id = this.curTrain.trainId;
          $('#ModelModal').modal('hide');
          this.$router.go(0);
          $(".modal-backdrop").remove();
          let reURL = '/api/user/statusChange'+'?trainId='+Id+"&status="+info;
         console.log(reURL);
          this.$http.get(reURL).then((response)=>{

          });
        },
        trainSetLoad(){

        }
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
