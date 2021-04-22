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
        训练模型
      </span>
      <a href="/mine" class="go">
        <em class="glyphicon-edit" ></em>
        编辑
      </a>
    </div>
    <div class="modal fade" id="ModelModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="text-align: left">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">注意事项</h4>

          </div>
          <div class="modal-body">
            <p>一、因为模型训练功能涉及到对GPU性能的消耗，因此训练模型前清仔细核对上传的图片与参数</p>
            <p>二、所有图片训练的请求都<span style="color: red">将会被管理员审核</span>，从而防止恶意训练导致不必要的GPU性能占用</p>
            <p>三、训练结果与图片训练集有着巨大的关联，因此你所选的图片训练集将会极大地影响您的模型性能</p>
          </div>
          <div class="modal-footer" >
            <button type="button" class="btn btn-danger" v-on:click="$router.go(-1)">返回</button>
            <button type="button" class="btn btn-primary"   data-dismiss="modal">我已知晓</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal -->

    </div>
    <div id="mainpara" class="select" style="text-align: center">

      <h3>训练模型请求</h3>
      <p>模型名称</p><input type="text" id="modelName" class="form-control" placeholder="不少于1个字符">
图片裁剪程度<input type="text" id="picCut" class="form-control" placeholder="请输入大于0小于1的小数(例:0.3)">
      <p>一次训练所选取的样本数(BatchSize)</p><input  id="batchsize" type="text" class="form-control" placeholder="请输入大于0的整数(例:200)">
      <p>单次训练迭代次数(Epochs)</p><input  id="epoch" type="text" class="form-control" placeholder="请输入大于0的整数(例:1000)">

      <p>从本地选择图片训练集</p>
      <input type="file" id="pic_selector"  @change="fileOutput" multiple style="margin: 0 auto;" /> <!--multiple，可选择多张图片-->
      <p id="error" style="color: red" v-if="hasError"></p>

      <div class="pictureUp" v-if="uploading">
      <div class="progress progress-striped active">
        <div class="progress-bar progress-bar-success" role="progressbar"
             aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
             style="width: 30%;">
        </div>
      </div>
      <p>正在上传第{{ this.uploadAtten}}文件</p>
      </div>

      <button class="btn btn-primary" @click="checkPara()">提交</button>
    </div>
    <div id="copyright"><p>©2015 lagou.com, all right reserved </p><div class="copyright-item"><span class="phone active">移动版&nbsp;·&nbsp;</span><span class="computer">电脑版&nbsp;·&nbsp;</span><a href="#header">回顶部</a></div></div>

    <myfoot></myfoot>

  </div>
</template>

<script>
  import myhead from './head'
  import myfoot from './foot'
  import {getCookie} from "../assets/js/cookie";
    export default {
        name: "train",
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
          pictureSet:'',
          hasError:false,
          uploading:false,
          uploadAtten:0
        }
      },
      mounted(){
        //$('#ModelModal').modal('show');  // 这个页面配置完了记得把这句话取消注释了！！！
        if(getCookie('username')) {
          this.nologin = false;
          this.haslogin = true

        }
      },
      methods:{
        fileOutput(e){
          console.log(e.target.files)
          this.pictureSet = e.target.files
        },
        checkPara(){
          let modelName = document.getElementById("modelName").value;
          let cutSize = document.getElementById("picCut").value;
          let batchSize = document.getElementById("batchsize").value;
          let epoch = document.getElementById("epoch").value;

          if(!modelName || modelName.length<=0)
          {
            $("#error").text('请输入有效的模型名称');
            this.hasError = true;
          }
          else if(!cutSize)
          {
            $("#error").text('请输入图片剪裁程度');
            this.hasError = true;
            //console.log("请输入图片剪裁程度");
          }
          else if(isNaN(cutSize))
          {
            $("#error").text('请输入有效的数字');
            this.hasError = true;
            console.log('请输入有效的数字')
          }
          else if(cutSize>1 || cutSize<=0)
          {
            $("#error").text('请输入在有效范围内的数字');
            this.hasError = true;
            console.log('请输入在有效范围内的数字');
          }
          else if(!batchSize)
          {
            $("#error").text('请输入batchsize');
            this.hasError = true;
            console.log('请输入batchsize');
          }
          else if(isNaN((batchSize)))
          {
            $("#error").text('请输入有效的数字');
            this.hasError = true;
            console.log('请输入有效的数字');
          }
          else if(!epoch)
          {
            $("#error").text('请输入epoch');
            this.hasError = true;
            console.log('请输入epoch');
          }
          else if(isNaN((epoch)))
          {
            $("#error").text('请输入有效的数字');
            this.hasError = true;
            console.log('请输入有效的数字');
          }
          else if(this.pictureSet=='' || this.pictureSet.length ==0)
          {
            $("#error").text('请选择训练集');
            this.hasError = true;
          }
          else{
            this.hasError = false;
            this.uploading = true;
            let pictureSet = this.pictureSet;
            let trainRequestTime = Date.now();
            for(let i =0;i< pictureSet.length; i++)
            {
              this.uploadAtten = i+1;

              console.log(pictureSet[i]);
              this.simplePictureUp(pictureSet[i],trainRequestTime, i+1);
            }


            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var Hours = date.getHours();
            var Minutes = date.getMinutes();
            var Seconds = date.getSeconds();
            if (month < 10) {
              month = "0" + month;
            }
            if (day < 10) {
              day = "0" + day;
            }
            let whenToColor =year + '-' + month + '-' + day + ' ' + Hours + ':' + Minutes + ':' + Seconds;
            //let timeCost = this.timeSpend;



            let msg = {'user': getCookie('username'), 'modelName': modelName, 'cutSize': cutSize, 'batchSize': batchSize,'epoch':epoch, 'trainSetSize':pictureSet.length, 'date': whenToColor, 'trainId':'train'+trainRequestTime};
            this.$http.post('api/user/trainReq',msg).then((response) =>{
              console.log(response);

            });

          }
        },
        simplePictureUp(files,date,i){
          let reader = new FileReader()
          //let trans = '';
          reader.readAsDataURL(files) // 文件转换
          let totalthis = this;
          reader.onloadend = function () {
           let trans = this.result;
            var arr = trans.split(','), mime = arr[0].match(/:(.*?);/)[1],
              // bstr = atob(arr[1]);
              bstr = new Buffer(arr[1]);
            bstr = bstr.toString('base64');
            totalthis.targetImgId = "train_" +date +"_"+i+".png";
            console.log(totalthis.targetImgId);
            let msg = {'user': getCookie('username'), 'picData': bstr, 'pictureName': totalthis.targetImgId, trainId: "train"+date};
            console.log(msg);
            totalthis.$http.post('/api/user/trainSup', msg).then((response) => {
              console.log('response');
              console.log(response.data);
            })
          }

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
<style>
  #mainpara{
    width: 50%;
    height: 60%;
    margin: 0 auto;
    position: absolute;
    left: 25%;
    top: 20%;
    background-color: #00b38a;
    padding: 10px;
  }
  .form-control{
    width: 40%;
    margin: 0 auto;
  }
</style>
