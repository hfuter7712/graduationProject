
import * as types from './mutation-types'

export default {
	history_record({ commit },search) {
		commit(types.HISTORY_RECORD,search)
	},
	history_read({ commit }) {
		commit(types.HISTORY_READ)
	},
	history_delete({ commit },index) {
		commit(types.HISTORY_DELETE,index)
	},
  NewLoginState({commit}, msg){
    commit(types.LOGIN_STATE, msg);
  },
  getLoginState({commit}){
	  commit(types.GET_LOGIN);
  }
}
