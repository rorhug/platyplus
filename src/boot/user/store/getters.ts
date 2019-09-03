import { GetterTree } from 'vuex'
import { RootState } from 'src/store'
import { UserState } from './state'

export const getters: GetterTree<UserState, RootState> = {
  authenticated(state) {
    return (
      !!state.token && !!state.token.id && !!state.profile && !!state.profile.id
    )
  },
  profile(state) {
    // TODO get/set profile with apollo cache (not stored in vuex -> single source of truth)
    return state.profile
  },
  token(state) {
    return state.token
  },
  claims(state) {
    return state.token && state.token['https://hasura.io/jwt/claims']
  },
  encodedToken(state) {
    return state.encodedToken
  }
}
