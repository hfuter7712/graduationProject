<template>
	<div id="content">

		<myhead></myhead>

		<div class="logininfo">
            <!-- 未登录 -->
            <div class="nologin center" v-if="nologin">
                <a class="loginbtn" href="/login">登录 / 注册</a>
            </div>

			<!-- 已登录 -->
            <div class="haslogin center" v-if="haslogin">
                <a class="button" href="#" target="_self">
                	简历&gt;
                </a>
                <div class="headcon">
                	<img class="headpic" src="https://www.vue-js.com/public/images/vue.png">
            	</div>
            	<div class="name">{{username}}</div>
            </div>
        </div>



        <div class="buttons">
          <a class="button pull-left logout" href="/admin" style="background-color:sandybrown" v-if="haslogin">管理</a>
          <a class="button pull-left " href="/color" v-if="haslogin">去上色</a>
          <a class="button pull-right" href="/train"  v-if="haslogin">训练模型</a>
            <a class="button pull-left" v-on:click="jump(s='/myModel')">

                <span>我的模型</span>

            </a>
            <a class="button pull-right" href="/record">

            	<span>我的记录</span>

            </a>
            <a class="button pull-left" v-on:click="jump(s='/collectModel')">

                <span>收藏</span>

            </a>

            <a class="button pull-right" href="#">

				<span>个人主页设置</span>

            </a>

            <a class="button pull-left logout" href="/user" @click="quit" v-if="haslogin">退出登录</a>
        </div>

	<myfoot></myfoot>

	</div>
</template>

<script>
import myhead from './head'
import myfoot from './foot'

import {setCookie,getCookie,delCookie} from '../assets/js/cookie.js';
export default {
	name:'user',
	components: {
		myhead,
		myfoot
	},
	data(){
		return {
			username:'',
			haslogin:false,
			nologin:true
		}
	},
	mounted(){
	  this.$store.dispatch('getLoginState');
		if(getCookie('username')){
			this.username = getCookie('username')
      //console.log('this.$store.state.hasLogin;:' + this.$store.state.hasLogin);
      //console.log('this.$store.state:');
      //console.log(this.$store.state);
      //console.log(this.$store.state.hasLogin);
			this.haslogin = this.$store.state.hasLogin.isLogin;
			this.nologin = !  this.$store.state.hasLogin.isLogin;
		}

	},
	methods:{
		quit(){
                /*删除cookie*/
      this.$store.dispatch('NewLoginState', {}) ;
                delCookie('username')
            },
    jump(s) {
      this.$router.push({path:s})
      this.isSelected = s
    }
	}
}
</script>

<style lang="scss" scoped>
@import "static/theme.scss";
#content {
	margin-bottom: 45px;

    &:after{
    	@extend %after_clearfix;
    }
}

.logininfo {
    margin: 10px 15px;
}

.nologin {
	width: 125px;
    height: 111px;
    .loginbtn {
	    font-size: 1.4rem;
	    color: #fff;
	    display: block;
	    width: 100%;
	    height: 45px;
	    line-height: 45px;
	    text-align: center;
	    margin: 0 auto;
	    background-color: rgba($base_color,.8);
	    position: relative;
	    top: 33px;
	}
}






.haslogin {
    position: relative;
    width: 100%;
    top: 10px;
    height: 111px;
    .button {
	    position: absolute;
	    color: $base_color;
	    font-size: 1.4rem;
	    right: 0;
	}
	.headcon {
	    height: 81px;
	    width: 81px;
	    margin: 0 auto;
	    -webkit-border-radius: 40.5px;
	    -moz-border-radius: 40.5px;
	    border-radius: 40.5px;
	    -moz-background-clip: padding;
	    -webkit-background-clip: padding-box;
	    background-clip: padding-box;
	    overflow: hidden;
	    background-color: $dim_bg_color;
	}
	.name {
	    font-size: 1.4rem;
	    color: #333;
	    height: 22px;
	    line-height: 22px;
	}
	.headpic {
	    width: 72px;
	    height: 72px;
	    margin: 4px 0 0 1px;
	    -webkit-border-radius: 36px;
	    -moz-border-radius: 36px;
	    border-radius: 36px;
	    -moz-background-clip: padding;
	    -webkit-background-clip: padding-box;
	    background-clip: padding-box;
	}

}








#content .buttons {
    margin-bottom: 10px;
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
	    margin-top: 10px;
	    position: relative;
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
