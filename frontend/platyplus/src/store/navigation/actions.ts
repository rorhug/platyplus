import { ActionTree } from 'vuex'

import { createRoutes } from 'src/hasura/routes'
import { Schema } from 'src/hasura/schema'
import { router } from 'src/router'

import { RootState } from '..'
import { NavigationState } from './state'

export const actions: ActionTree<NavigationState, RootState> = {
  routeRequest({ commit }, { path }) {
    commit('setDrawer', false)
    commit('routeRequest', path)
  },
  route({ commit, state }, { path }) {
    path = state.routePath || path
    commit('routeReset')
    router.replace(path)
  },
  toggleDrawer({ commit }) {
    commit('toggleDrawer')
  },
  setDrawer({ commit }, { value }) {
    commit('setDrawer', value)
  },
  /**
   * Loads the routes from the tables schema. riggerred after table schemas have been loaded into the store.
   * * This action only read the Vuex store and uses the Vuex actions to run some business logic.
   * * The new routes are stored into the vue-router instance, which is not part of the Vuex store, except
   * * with the state.navigation.router that is a pointer to the vue-router instance
   */
  loadRoutes: async ({ rootGetters }) => {
    const schema: Schema = rootGetters['hasura/schema']
    router.addRoutes(createRoutes(schema))
  }
}
