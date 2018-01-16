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
        const { navigate, goBack} = this.props.navigation;
        // Cookie.get(global.url).then((cookie) => {
        //     if(!cookie||!cookie.userId){
        //         navigate("Login")
        //     }else{
        //         Cookie.set(global.url+'/web/companyPurchase.html', 'userOpenId', cookie.userId).then(() => console.log('success'));
        //     }
        // })
        const { params} = this.props.navigation.state;
        return(
            <View>
                <ImageBackground style={styles.header} source={require('../images/headerBg.jpg')}>
                    <TouchableOpacity style={{height:'100%',justifyContent:"center",position: 'absolute',left: pxToDp(0),top:Platform.OS==='android'?0:pxToDp(40),}} onPress={() => {
                        params.changeTimer()
                        goBack()
                    }}>
                        <Image style={styles.headerBack} source={require('../images/back1.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>about:blank</Text>
                </ImageBackground>
                <Text>{params.text}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        height: Platform.OS==='android'?pxToDp(96):pxToDp(130),
        paddingTop: Platform.OS==='android'?0:pxToDp(40),
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
