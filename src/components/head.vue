<template>

	<header id="header">
		Colorization ！


    <button v-on:click="$router.go(-1)" style="position:absolute; right: 1%; top:1%; height: 30px">返回</button>
    <div>asdasdf</div>
	</header>

</template>
<script>
  import {getCookie} from '../assets/js/cookie.js'
  var text = getCookie('username')
</script>
