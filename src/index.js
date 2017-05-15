import React, { Component } from 'react'
import {
    AsyncStorage,
    View
} from 'react-native'

import {
    ApolloProvider,
    ApolloClient,
    createNetworkInterface,
    gql,
    graphql
} from 'react-apollo'

// Used by subscriptions
import {
    SubscriptionClient,
    addGraphQLSubscriptions
} from 'subscriptions-transport-ws'


AsyncStorage.setItem(
    'token',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTQ1MTMxMDcsImNsaWVudElkIjoiY2oweWJvMGJyMG5zMzAxMTVybXl0bXdmdyIsInByb2plY3RJZCI6ImNqMHlibzBicjBuczIwMTE1eXRkanN5cWMiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqMmtpaWxzejZ0N3EwMTQxY2txbDV6eGcifQ.wcaLPu22EzX6bAJlsg6oRnkd8MAX6UB-mZjWCt4Orrk'
)

// import Auth0LockNativeAccountScreen from './Auth0LockNativeAccountScreen'

import ActivityIndicatorComponent from './ActivityIndicatorComponent'
import AccountsCreateUserComponent from './AccountsCreateUserComponent'
import RootNavigationComponent from './RootNavigationComponent'

export default class server extends Component {
    state = { loading: true }

    componentDidMount() {
        AsyncStorage.getItem('tabBarStateActiveItem')
        .then(active => {
            this.tabBarStateActiveItem = active
        })
        .catch(console.error)
        // Checks if user token is saved &
        // then skips or goes to the account page.
        AsyncStorage.getItem('token')
        .then(token => {
            AsyncStorage.getItem('userId')
            .then(userId => {
                this.userId = userId

                this.setState({ token, loading: false })
            })
            .catch(console.error)
        })
        .catch(console.error)
    }

    setToken = (token) => (
        AsyncStorage.setItem('token', token)
        .then(() => this.setState({ token }))
        .catch(console.error)
    )

    removeToken = () => (
        AsyncStorage.removeItem('token')
        .then(() => this.setState({ token: '' }))
        .catch(console.error)
    )

    getApolloClient = () => {
        const serverUrl = 'api.graph.cool/simple/v1/Rep'
        const uri = `https://${serverUrl}`
        const networkInterface = createNetworkInterface({uri})

        networkInterface.use([{
            applyMiddleware(req, next) {
                req.options.headers = req.options.headers || {}
                // AsyncStorage.getItem('token')
                // .then(token => {
                //     if (token) {
                req.options.headers.authorization = (
                    'Bearer '
                    + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTQ1MTMxMDcsImNsaWVudElkIjoiY2oweWJvMGJyMG5zMzAxMTVybXl0bXdmdyIsInByb2plY3RJZCI6ImNqMHlibzBicjBuczIwMTE1eXRkanN5cWMiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqMmtpaWxzejZ0N3EwMTQxY2txbDV6eGcifQ.wcaLPu22EzX6bAJlsg6oRnkd8MAX6UB-mZjWCt4Orrk')
                    // }
                next()
                // })
            }
        }])

        // Used by subscriptions
        const websocketUrl = `wss://${serverUrl}`
        const wsClient = new SubscriptionClient(websocketUrl, {
            reconnect: true,
            connectionParams: {
                // Pass any arguments you want for initialization
            }
        })

        return new ApolloClient({
            initialState: {},
            networkInterface: addGraphQLSubscriptions(
                networkInterface,
                wsClient
            ),
        })
    }

    render() {
        const {
            loading,
        } = this.state

        if (loading) {
            return <ActivityIndicatorComponent />
        }

        return (
            <ApolloProvider client={this.getApolloClient()}>
                <RootNavigationComponent
                    userId={this.userId}
                    active={this.tabBarStateActiveItem}
                    removeToken={this.removeToken}
                />
            </ApolloProvider>
        )
    }
}
