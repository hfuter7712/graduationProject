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
        图片上色
      </span>
      <a href="/mine" class="go">
        <em class="glyphicon-edit" ></em>
        编辑
      </a>
    </div>
    <div>
      <div id = "imgArea">
  <img src = ""/>

        <img src=""/>

      </div>
      <div id="mainpic" class="select" style="text-align: center">

        <p>
          <img :src="src" width="40%" height="35%" @click="selectImg()" >
          <button class="btn btn-primary" data-toggle = "modal" data-target="#ModelModal">选择模型</button>

          <img :src="srcTarget" width="40%" height="35%"/>
        </p>
        <div class="modal fade" id="ModelModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="text-align: left">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">模型选择</h4>
              </div>
              <div class="modal-body">
                是否为灰色图片？
                <input type="radio" name="wgrey" value="gray_yes" />是
                <input type="radio" name="wgrey" value="gray_no" />否
                <p>请在下列列表中选择模型</p>
                <select class="selectpicker" data-live-search="true" @change="Selectprocess()" id = 'modelType'>
                  <option value="all">全部</option>
                  <option value="nature">自然</option>
                  <option value="people">人像</option>
                  <option value="oldBuilding">古建筑</option>
                </select>
                <button class="btn btn-info" @click="userNumSort()">使用人数(降序)</button>
                <button class="btn btn-info" @click="rateSort()">评分(降序)</button>


                <div class="model-show">
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
              <input name ="modelSelect" type="radio" :value="l.modelId">
            </span>
                      </p>
                      <p>{{l.useNum}}人使用过  <router-link tag="a" target="_blank" :to="{path:'/model/id='+l.modelId,query:{id:l.modelId}}">了解详情</router-link>
                      </p>

                    </div>
                  </li>
                  <li class="list-more" v-on:click="getMore">加载更多</li>
                </ul>
                </div>
              </div>
              <div class="modal-footer" >
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary"  @click="paramsSubmmit()">提交</button>
              </div>
            </div><!-- /.modal-content -->
          </div><!-- /.modal -->
        </div>

        <input type="file" id="filed" hidden="" @change="filePreview" >
        <p v-if="error1" style="color: red">请选择要上传的图片</p>
        <p v-if="error2" style="color: red">请选择模型</p>
        <p v-if="onprogress">图片正在进行上色，可能需要十几秒时间，请稍候...</p>

        <button @click="fileUpload()" class="btn btn-primary">上传</button>
        <button @click="startColor()" class="btn btn-info">开始上色</button>
        <button @click="download()" class="btn btn-warning" v-if="whetherDown">存储记录&下载</button>
      </div>
      <!--
      <form name="imgForm" id="imgForm" enctype="multipart/form-data" action="图片上传接口" method='post'>
        <input class="input-loc-img"  name="imgLocal" id="imgLocal" type='file' accept="image/*" @change="selectImg" />
      </form>
      -->
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
      name: "color",
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
          src: '/static/noupload.PNG',
          textHide: true,
          curentModelType: 'all',
          selectSort: 1,
          whetherGrey : false,
          selectModel : null,
          targetImgId : "",
          srcTarget:"/",
          onprogress:false,
          targetDir:"",
          timeSpend:'',
          whenToColor:'',
          whetherDown:false,
          error1:false,
          error2:false

        }
      },
      mounted() {
        if (getCookie('username')) {
          this.nologin = false;
          this.haslogin = true,
            this.getListData('all')
        }
      },
      methods: {
        /*
        selectImg(){
          let form=document.getElementById('imgLocal');
          form.submit();
        }
        */
        selectImg: function () {
          document.getElementById('filed').click()
        },
        filePreview(e) {
          let _this = this
          var files = e.target.files[0]
          if (!e || !window.FileReader) return  // 判断是否支持FileReader
          this.error1 = false;
          let reader = new FileReader()
          reader.readAsDataURL(files) // 文件转换
          reader.onloadend = function () {
            console.log('this.result:');
            console.log(this.result);
            _this.src = this.result
            _this.textHide = false;
          }
        },
        fileUpload() {
          var src = this.src;
          if(src == '/static/noupload.PNG'){
            this.error1 = true;
          }
          else{

          var arr = src.split(','), mime = arr[0].match(/:(.*?);/)[1],
            // bstr = atob(arr[1]);

            bstr = new Buffer(arr[1]);
          bstr = bstr.toString('base64');

          //n = bstr.length, u8arr = new Uint8Array(n);
          //console.log('bstr:');
          //console.log(bstr);
          //console.log('mime:');
          //console.log(mime);


          /*while(n--){
            u8arr[n] = bstr.charCodeAt(n);
          }
          console.log(' u8arr:');
          console.log( u8arr);
          var obj = new Blob([u8arr], {type:mime});
          console.log('obj:');
          console.log( obj);
          var fd = new FormData();
          fd.append("upfile", obj, "image.jpg");
          console.log('fd:');
          console.log(fd);
          var myValue;
          for (var value of fd.values()) {
            myValue = value;
            break;
          }
          */


          //console.log(obj);
          this.targetImgId = "test_" +Date.now() +".png";
          console.log(this.targetImgId);
          let msg = {'user': getCookie('username'), 'picData': bstr, 'pictureName': this.targetImgId};
          console.log(msg);
          console.log(typeof (myValue))

          //params.append('picData', fd);
          this.$http.post('/api/user/upload', msg).then((response) => {
            console.log('response');
            console.log(response.data);
          })
          }
        },
        startColor() {

          if(!this.selectModel){
            this.error2 = true;
          }
          else if(this.src == '/static/noupload.PNG')
          {
            this.error1=true;
          }
          else {
          this.whenToColor = Date.now();
          let begin = new Date();

          let msg = {'user': getCookie('username'), 'modelId': this.selectModel, 'whetherGrey': this.whetherGrey, 'pictureName': this.targetImgId}
          console.log('msg:');
          console.log(msg);
          this.onprogress = true;
          this.$http.post('/api/user/color', msg).then((response) => {
            if(response.status == 200)
            {
              this.onprogress = false;
              this.whetherDown = true;
            }
            console.log('response');
            console.log(response.data);
            let resData = response.data;
            this.srcTarget = resData.resPicLocal;
            this.targetDir = resData.pdf;

            console.log('srcTarget:'+ this.srcTarget);
            let end = new Date();
            let time = end - begin;
            console.log('共花费时间:'+time);
            this.timeSpend = time;
          })
          }
          },
        getListData(type) {

          /*
    this.$http.get('/api/list/more?pageSize=15&pageNo='+this.page)
      .then((response)=>{
        this.listmore = [...this.listmore,...response.data.content.data.page.result]
        console.log('超级输出:');
        console.log(this.listmore);
      })
      */
          //this.listmore = []
          if (type == 'all') {
            this.$http.get('/api/list/getModelList').then((response) => {
              console.log('response:');
              console.log(response);
              this.listmore = [...this.listmore, ...response.data];
              console.log('超级输出:');
              console.log(this.listmore);
            })
          } else {
            let url = '/api/list/getModelList?type=' + type;
            this.$http.get(url).then((response) => {
              console.log('response:');
              console.log(response);
              this.listmore = [...this.listmore, ...response.data];
              console.log('超级输出:');
              console.log(this.listmore);
            })
          }

        },


        // 加载更多
        getMore() {
          this.page += 1;
          return this.getListData(this.curentModelType)
        },
        //模型选择器中picker根据选择的种类进行不同种类的筛选
        Selectprocess() {
          let modelType = document.getElementById("modelType").value;
          this.curentModelType = modelType;
          console.log(document.getElementById("modelType").value)
          this.listmore = []
          this.getListData(modelType)
        },
        //模型参数提交
        paramsSubmmit() {
          this.error2 = false;
          console.log('参数函数执5etger行');

          console.log($("input[name='wgrey']:checked").val());
          console.log($("input[name='modelSelect']:checked").val());
          let whetherGrey = $("input[name='wgrey']:checked").val();
          let modelId = $("input[name='modelSelect']:checked").val();
          if(!whetherGrey)
            console.log('请选择是否为灰色图片');
          else if(!modelId)
            console.log('请选择模型！');
          else{
            $('#ModelModal').modal('hide')
            $(".modal-backdrop").remove();
            this.whetherGrey = whetherGrey;
            this.selectModel = modelId;
          }

        },
        //按照用户使用人数对模型列表进行排序
        userNumSort() {
          console.log(this.listmore);
          console.log(typeof(this.listmore))

          if (this.selectSort != 2) {
            this.selectSort = 2;
            this.listmore.sort(this.compareFunction("useNum"));

          } else {
            this.selectSort = 1;
            this.listmore.sort(this.compareFunction("modelId"));
          }
        },
        //按照模型评价分数对模型列表进行排序
        rateSort() {
          if (this.selectSort != 3) {
            this.selectSort = 3;
            this.listmore.sort(this.compareFunction("modelRate"));
          }
          else{
            this.selectSort = 1;
            this.listmore.sort(this.compareFunction("modelId"));
          }

        },
        //排序基函数
        compareFunction(propertyName){
          return function (src, tar) {
            let v1 = src[propertyName];
            let v2 = tar[propertyName];
            return v1<v2?1:-1;
          }
        },
        //对完成处理的图片进行下载操作
        download(){
          var fileName = "down_" + Date.now() +'.jpg';
          this.downloadFile(this.srcTarget, fileName);
          this.recordSet();
        },

        //下载实现函数，将base64编码的图片进行处理
        downloadFile(content, fileName) { //下载base64图片
    var base64ToBlob = function(code) {
      let parts = code.split(';base64,');
      let contentType = parts[0].split(':')[1];
      console.log(parts[1]);
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for(let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {
        type: contentType
      });
    };
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content); //new Blob([content]);
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  },
        recordSet(){
          let targetImg = 'user/'+getCookie('username')+'/picture/'+ this.targetImgId;
          let resImg = this.targetDir;
          let recordId = getCookie('username')+Date.now();
          let user = getCookie('username');
          let model = this.selectModel;


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
          let timeCost = this.timeSpend;


          let msg = {'targetImg': targetImg, 'resImg': resImg, 'recordId': recordId, 'user': user, 'model':model, 'timeCost':timeCost, 'date':whenToColor};
          console.log('msg:');
          console.log(msg);
          this.onprogress = true;
          this.$http.post('/api/user/recordUp', msg).then((response) => {
            console.log(response);
          })
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
  #mainpic{
    width: 50%;
    height: 50%;
    margin: 0 auto;
    position: absolute;
    left: 25%;
    top: 20%;
    background-color: #00b38a;
    padding: 10px;
  }
  .model-show{
    height:310px;
    overflow-y:scroll;
  }
</style>
