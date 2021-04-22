<template>
  <div id="content">
    <myhead></myhead>

    <div class="container" style="margin-top: 3%">
      <h2 class="text-primary">基本信息</h2>
      <hr>
      <div class="col-md-9">
        <ul class="list-group">
          <li class="list-group-item">用户名：{{userDetail.username}}</li>
          <li class="list-group-item">邮箱：{{userDetail.email}}</li>
          <li class="list-group-item">来自：{{userDetail.nativePlace}}</li>
          <li class="list-group-item">年龄：{{userDetail.age}}</li>
          <li class="list-group-item">性别：{{userDetail.Gender}}</li>
          <li class="list-group-item">人生格言：{{userDetail.brief}}</li>
          <li class="list-group-item">拥有模型：{{userDetail.modelNum}}</li>
          <li class="list-group-item">图片上色次数：{{userDetail.colorNum}}</li>
          <button class="btn" v-if="isMine" @click="modalShow()">修改个人信息</button>
        </ul>
      </div>
      <img :src="userDetail.headPic" style="width: 25%; height: 25%;border-radius: 50% ">

      <div class="modal fade" id="ModelModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="text-align: left">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header" style="font-size: 18px">
              修改个人信息
            </div>
            <div class="modal-body" style="margin: 40px; padding:10px">

              <div class="input-group">
                <span class="input-group-addon">邮箱</span>
                <input type="text" class="form-control"  :value="userDetail.email"  id="modemail">
              </div>
              <div class="input-group">
                <span class="input-group-addon">来自</span>
                <input type="text" class="form-control" :value="userDetail.nativePlace"  id="modnaPlace">
              </div>
              <div class="input-group">
                <span class="input-group-addon">年龄</span>
                <input type="text" class="form-control" :value="userDetail.age" id="modage">
              </div>
              <div class="input-group">
                <span class="input-group-addon">性别</span>
                <input type="text" class="form-control" :value="userDetail.Gender"  id="modGender">
              </div>
              <div class="input-group">
                  <span class="input-group-addon">人生格言</span>
                <textarea class="form-control" aria-label="With textarea" :value="userDetail.brief"   id="modBrief"></textarea>
              </div>



            </div>
            <div class="modal-footer" >
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
              <button type="button" class="btn btn-success"  @click="modJudge()">修改完成</button>

            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>


    </div>



    <myfoot></myfoot>
  </div>

</template>

<script>
    import myhead from "./head";
    import myfoot from "./foot";
    import {getCookie} from "../assets/js/cookie";

    export default {
      name: "userProfile",
      components: {
        myhead,
        myfoot
      },
      data() {
        return {
          nologin: true,
          haslogin: false,
          modelDetail: {},
          ratePic: '',
          modelLabel: '',
          haveRate: false,
          userDetail: '',
          isMine: true
        }
      },
      mounted() {
        if (getCookie('username')) {
          this.nologin = false;
          this.haslogin = true

        }
        let searchId = this.$route.query.user;
        this.isMine = searchId == getCookie('username') ? true : false;

        console.log(searchId);
        this.$http.get('/api/user/userDetail?id=' + searchId).then((response) => {
          console.log(response.data);
          this.userDetail = response.data[0];
        });

        console.log('getCookie(\'username\'):');
        console.log(getCookie('username'));
        this.getTrainData()
      },
      methods: {
        modalShow() {
          $('#ModelModal').modal('show');
        },
        modJudge() {
          let email = $("#modemail").val();
          let naplace = $("#modnaPlace").val();
          let age = $("#modage").val();
          let gender = $("#modGender").val();
          let brief = $("#modBrief").val();

            let msg = {
              'username':getCookie('username'),
              'email': email,
              'naplace': naplace,
              'age': age,
              'gender': gender,
              'brief': brief
            };
            this.$http.post('/api/user/infomod', msg).then((response) => {
              console.log('response');
              console.log(response);
              $('#ModelModal').modal('hide');
              this.$router.go(0);
              $(".modal-backdrop").remove();

            });



        }
      }
    }
</script>

<style lang="scss">
  @import "static/theme.scss";
</style>
