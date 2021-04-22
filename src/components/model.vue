<template>
    <div id="content">
      <myhead></myhead>

      <div id = "md" >
        <p class = 'detailText'>模型名称: {{modelDetail.modelName}}</p>
        <div id="md-left" style="width:120px;float:left;">
          <img v-bind:src = modelDetail.modelLocation class = "model-pic">
        </div>

        <div id="md-right" style="width:360px;float:right;">
          <p class = 'detailText'>模型作者：<router-link tag="a" target="_blank" :to="{path:'/userProfile?user='+modelDetail.modelAuthor}">{{modelDetail.modelAuthor}}</router-link>
          </p>
          <p class = 'detailText' id="modelRateId">模型评价:</p>
          <p class = 'detailText'>模型上传时间： {{modelDetail.modelTime}}</p>
          <p class = 'detailText' id="detailTextId">模型标签： </p>

        </div>


      </div>

      <myfoot></myfoot>
    </div>

</template>


<script>
  import myhead from './head'
  import myfoot from './foot'
    import {getCookie} from "../assets/js/cookie";

    export default {
      props:[],
        name: "model",
      components:{
          myhead,
          myfoot
      },
      data(){
          return{
            nologin:true,
            haslogin:false,
            modelDetail:{},
            ratePic:'',
            modelLabel:'',
            haveRate: false
          }
      },
      created(){


      },
      mounted(){
        if(getCookie('username')){
          this.nologin = false;
          this.haslogin = true;
        }
        this.modelDetail = this.$route.query.modelParams;
        let searchId = this.$route.query.id;
        console.log('searchId'+ searchId);
        this.$http.get('../api/list/UserModel?id='+searchId ).then((response)=>{
          console.log('response');
          console.log(response.data);
          this.modelDetail = response.data[0];
          console.log('第一次战术输出');
          console.log(this.modelDetail);
          if(!this.haveRate){
            this.haveRate = true;
            for(var i = 0; i<this.modelDetail.modelRate; i++)
              this.ratePic += '<span class=\'fa fa-star\'></span>';
            for(var i = 0; i<5-this.modelDetail.modelRate; i++)
              this.ratePic += '<span class=\'fa fa-star-o\'></span>';
            this.modelLabel += "<span class=\"label label-info\">";
            this.modelLabel += this.modelDetail.modelTab;
            this.modelLabel += "</span>";
            console.log('是不是异步呢');
          }
          console.log('第二次尝试');
          console.log(this.modelDetail);


          document.getElementById("modelRateId").innerHTML+=this.ratePic;
          document.getElementById("detailTextId").innerHTML+=this.modelLabel;
        })

        //console.log('开局输出:');
        //console.log($parent.$data);
        //this.modelDetail = $parent.$data;

      },

      methods:{

      }
    }
</script>


<style lang="scss">
  @import "static/theme.scss";
</style>
<style>
 #md{
   width: 50%;
   height: 50%;
   margin: 0 auto;
   position: absolute;
   left: 25%;
   top: 20%;
   background-color: #00b38a;
   padding: 10px;
 }
  .detailText{
    padding: 10px;
  }
</style>
