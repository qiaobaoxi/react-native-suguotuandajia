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
  Alert,
  TouchableOpacity
} from 'react-native';
const deviceWidthDp = Dimensions.get('window').width;
import * as WeChat from 'react-native-wechat';
import CookieManager from 'react-native-cookies';
import Cookie from 'react-native-cookie';
import Header from '../js/header'
import webviewjs from '../js/webviewjs'
import handleMessage from '../js/handlerMessage'
import Fetch from '../js/fetch'
import WxPay from '../js/wxPay'
const uiWidthPx = 750;
WeChat.registerApp('wx552eb71ba49e52ad')

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
    }
    handleMessage(e, navigate) {
        if (!e.nativeEvent.data) { 
            Alert.alert('参数出错')
            return 
        }
        let params = {
            orderNo: e.nativeEvent.data,
            isApp: true
        }
        WxPay(params, WeChat, navigate, '/api/order/GeneratePayParams')
    }
    render(){
        const { navigate,goBack } = this.props.navigation;
        Cookie.get(global.url).then((cookie) => {
            if(!cookie||!cookie.userId){
                navigate("Login")
            }else{
                Cookie.set(global.url+'/web/myOrder.html?type=', 'userId', cookie.userId).then(() => console.log('success'));
            }
        })
        const { params} = this.props.navigation.state;
        let num=''
        if(params){
           num=params.num
        }
        let time= new Date().getTime()
        return (
            <View style={{flex:1}}>
                <Header goBack={goBack} text={'线上订单列表'}></Header>
                <WebView
                    style = {{
                      backgroundColor: "#e5e5e5",
                      height: 100,
                    }}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    injectedJavaScript={webviewjs}
                    userAgent='TDJAPP'
                    renderError={() => {
                        return (<View style={styles.container}><Text>网络出错,请联系客服</Text></View>)
                    }}
                    source={{uri:global.url+'/web/myOrder.html?type='+num+'&time='+time}}
                    onMessage={(e) => {
                        this.handleMessage(e,navigate)
                    }}  
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        height: pxToDp(96),
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: pxToDp(1),
        borderBottomColor:'#daddde',
        justifyContent: 'center'
      },
      headerBack: {
        marginLeft: pxToDp(26),
        marginRight: pxToDp(26),
        width: pxToDp(40),
        height: pxToDp(40),
      },
      headerText: {
        fontSize: pxToDp(36),
        color: 'white',
        backgroundColor:'rgba(0,0,0,0)'
      },
});
module.exports=Index
