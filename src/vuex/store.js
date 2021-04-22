import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import {getCookie} from '../assets/js/cookie.js';
Vue.use(Vuex)

const state = {
    citys:[
        {
            "cityList":["自然","人文","古建筑(中国风)","现代城市","古建筑(欧风)","人像"],
            "name":"热门模型",
            "nameStr":"热门模型"
        },
        {
            "cityList":["安庆","安阳","保定","北京","包头","长春","成都","重庆","长沙","常州","郴州","沧州","东莞","大连","东营","佛山","阜阳","福州","抚州"],
            "name":"",
            "nameStr":"ABCDEF"
        },

    ],
    positionName:['产品经理','Java','运营','Android','PHP','UI','IOS','编辑','BD'],
    salary:['没有要求','2k以下','2k-5k','5k-10k','10k-15k','15k-25k','25k-50k','50k以上'],
    positionName_selected:getCookie('p'),
    city_selected:getCookie('c'),
    salary_selected:getCookie('s'),
    history:[],         //搜索历史
    search_result:[],   //搜索列表
    search_data: [],    //搜索数据（这里用的假数据而不是通过接口获取，可以练习vuex）
    filterSearch:[],

    hasLogin: {}
}
export default new Vuex.Store({
    state,
    mutations,
    actions
});
