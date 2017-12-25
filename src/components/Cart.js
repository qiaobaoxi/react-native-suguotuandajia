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
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
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
        const { navigate,goBack} = this.props.navigation;
        // Cookie.get(global.url).then((cookie) => {
        //     if(!cookie||!cookie.userId){
        //         navigate("Login")
        //     }else{
        //         Cookie.set(global.url+'/web/companyPurchase.html', 'userOpenId', cookie.userId).then(() => console.log('success'));
        //     }
        // })
        const { params} = this.props.navigation.state;
        return(
            <View style={styles.container}>
                <ImageBackground style={styles.header} source={require('../images/headerBg.jpg')}>
                    <TouchableOpacity style={{height:'100%',justifyContent:"center"}} onPress={() => {
                        params.changeTimer()
                        goBack()
                        }}>
                        <Image style={styles.headerBack} source={require('../images/back1.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>扫码绑卡</Text>
                </ImageBackground>
               <WebView
                    style={{
                    backgroundColor: "#e5e5e5",
                    flex: 1
                    }}
                    bounces={false}
                    scalesPageToFit={true}
                    source={{uri:params.text}}
                    onMessage={this.handleMessage(navigate)}  
                ></WebView>
            </View>
            // <View style={styles.container}>
            //     <WebView bounces={false}
            //     scalesPageToFit={true}
            //     source={{uri:"http://www.hangge.com",method: 'GET'}}
            //     style={{width:deviceWidth, height:deviceHeight}}>
            //     </WebView>
            // </View>
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
        borderBottomColor:'#daddde'
      },
      headerBack: {
        marginLeft: pxToDp(26),
        marginRight: pxToDp(26),
        width: pxToDp(40),
        height: pxToDp(40),
      },
      headerText: {
        borderLeftWidth: pxToDp(1),
        borderLeftColor: '#daddde',
        paddingLeft: pxToDp(24),
        fontSize: pxToDp(36),
        color: 'white',
        backgroundColor:'rgba(0,0,0,0)'
      },
      container: {
        flex: 1,
    }
});
module.exports=Index
