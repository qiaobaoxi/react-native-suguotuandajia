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
import CookieManager from 'react-native-cookies';
import Cookie from 'react-native-cookie';
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
        //   navigate('OrderDetail')
    }
    render(){
        const { navigate} = this.props.navigation;
        // Cookie.get(global.url).then((cookie) => {
        //     if(!cookie||!cookie.userId){
        //         navigate("Login")
        //     }else{
        //         Cookie.set(global.url+'/web/companyPurchase.html', 'userOpenId', cookie.userId).then(() => console.log('success'));
        //     }
        // })
        const { params} = this.props.navigation.state;
        return(
            <View><Text>{params.text}</Text></View>
        );
    }
}
const styles = StyleSheet.create({
    
});
module.exports=Index
