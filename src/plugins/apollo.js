import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { withClientState } from 'apollo-link-state'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'
import { getUserToken } from 'plugins/auth'

const cache = new InMemoryCache()

function getConfig () {
  // TODO: store and get in localstorage
  localStorage.removeItem('config')
  let conf = localStorage.getItem('config')
  console.log(`initial config ${JSON.stringify(conf)}`)
  if (!conf) {
    if (process.env.PROD) {
      var xhr = new XMLHttpRequest()
      console.log(`${window.location.origin}/config`)
      // xhr.open('GET', `${window.location.origin}/config`, true)
      xhr.open('GET', `${window.location.origin}/config`, false)
      xhr.send()
      console.log(xhr)
      if (xhr.status === 200) {
        conf = JSON.parse(xhr.response)
      } else {
        console.error(xhr)
      }
    } else {
      console.log(process.env)
      conf = {
        HTTP_PROTOCOL: process.env.HTTP_PROTOCOL,
        API: process.env.API,
        AUTH_API: process.env.AUTH_API
      }
      console.log(conf.API)
    }
    localStorage.setItem('config', conf)
  }
  console.log(conf)
  console.log(conf.API)
  return conf
}
const config = getConfig()
console.log(config)

const resolvers = {
  Mutation: {
    // updateProfile (_, { id, token }, { cache }) {
    //   const data = {
    //     hello: {
    //       __typename: 'Profile',
    //       id,
    //       token
    //     }
    //   }
    //   return cache.writeData({ data })
    // }
  }
}

const stateLink = withClientState({
  cache,
  resolvers,
  defaults: {
    // profile: {
    //   __typename: 'Profile',
    //   id: 'an id',
    //   token: '1234'
    // }
  }
})

const httpLink = createHttpLink({
  uri: `${config.HTTP_PROTOCOL}://${config.API}`,
  fetch: fetch
})

const authHeaders = () => {
  const token = getUserToken()
  if (token) {
    return {
      Authorization: `Bearer ${token}`
    }
  } else return {}
}
// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://${config.API}`,
  reconnect: true,
  options: {
    reconnect: true,
    connectionParams: () => ({
      headers: authHeaders()
    })
  }
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...authHeaders()
  }
}))

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(stateLink.concat(httpLink))
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862
  connectToDevTools: true
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  errorHandler ({ graphQLErrors, networkError }) {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  }
})

export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
