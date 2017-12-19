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
        console.disableYellowBox = true;
    }
    handleMessage(navigate,e) {
        // Alert.alert(e)
        // if(e){
        //   navigate('Home')
        // }
    }
    render(){
        return(
            <WebView
                      style={{
                        backgroundColor: "#e5e5e5",
                        height: 100,
                      }}
                      source={
                        {uri: global.url+'/web/my/myInfo.html'}
                 }
            />
        );
    }
}
const styles = StyleSheet.create({
    
});
module.exports=Index
