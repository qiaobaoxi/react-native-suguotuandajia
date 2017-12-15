import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  WebView,
  Alert
} from 'react-native';
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
    }
    handleMessage(navigate,e) {
          navigate('OrderDetail')
    }
    render(){
        const { navigate} = this.props.navigation;
        const { params} = this.props.navigation.state;
        let num=''
        if(params){
           num=params.num
        }
        return(
            <WebView
                style={{
                backgroundColor: "#e5e5e5",
                height: 100,
                }}
                source={{uri:'http://192.168.0.97:94/web/myOrder.html?type='+num}}
                onMessage={this.handleMessage(navigate)}  
            />
        );
    }
}
const styles = StyleSheet.create({
    
});
module.exports=Index
