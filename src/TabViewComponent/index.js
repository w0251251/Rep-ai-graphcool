
/* TabViewComponent for generating a flatlist containing
    cards generated by ContentSection or UserSection

    props:
        - type: String
        if type = 'user'
            - users: (Arr of Object) { avatarUri, username, email etc.. }
        if type = 'content'
            - content: (Arr of Object) { section: { title, desc }}
*/

import React, { Component } from 'react';
import {
    View,
    FlatList
} from 'react-native';
import FabComponent from '../FabComponent';
import ContentSection from './ContentSection';
import UserSection from './UserSection';
//graphql call for obj from user, generates from flatlist into contentsec

//takes object as prop and expands for component sections

class TabViewComponent extends Component {
    evaluateType() {
        if (this.props.type === 'content'){
            return (
                <FlatList
                    style={{ 
                        flex: 1, 
                        backgroundColor: 'white', 
                        padding: 10 
                    }}
                    data={this.props.content.map(( section, key ) => ({
                        ...section, key}))}
                    renderItem={({item: {section: {title, description}}}) =>
                        (<ContentSection 
                            title={title}
                            description={description || ''}
                        />)
                    }
                />
            )
        } else if (this.props.type === 'user'){
            return (
                <FlatList
                    style={{ 
                        flex: 1, 
                        backgroundColor: 'white', 
                        padding: 10 
                    }}
                    data={this.props.users.map(( user, key ) => ({
                        ...user, key}))}
                    renderItem={({ item }) =>
                        (<UserSection 
                            user={item}
                        />)
                    }
                />
            )
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.evaluateType()}
                {this.props.fab && 
                    <FabComponent onPress={this.props.onPress}/>}
            </View>
        )
    }
}

export default TabViewComponent;