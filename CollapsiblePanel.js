import * as React from 'react'
import {Component,StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native'

class CollapsiblePanel extends React.Component {
    state = {
        expanded    : true,
        animation   : new Animated.Value()
    }
    render(){
        return ( 
            <View style={styles.container} >
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={() => this.setState({expanded: !this.state.expanded})}
                        underlayColor="#f1f1f1">
                        <Text>{this.state.expanded ? "---" : "+++"}</Text>
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body}>
                    {this.props.children}
                </View>

            </View>
        );
    }
}
export default CollapsiblePanel
const styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        margin:10,
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body        : {
        padding     : 10,
        paddingTop  : 0
    }
})
