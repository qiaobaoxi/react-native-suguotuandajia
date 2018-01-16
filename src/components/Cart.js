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
        // console.disableYellowBox = true;
    }
    handleMessage(navigate, e) {
        //   navigate('OrderDetail')
    }
    render(){
        const { navigate,goBack} = this.props.navigation;
        const { params} = this.props.navigation.state;
        return(
            <View style={styles.container}>
                <ImageBackground style={styles.header} source={require('../images/headerBg.jpg')}>
                    <TouchableOpacity style={{height:'100%',justifyContent:"center",position: 'absolute',left: pxToDp(20),top:Platform.OS==='android'?0:pxToDp(40),}} onPress={() => {
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
                    renderError={() => {
                        return (<View style={styles.container}><Text>网络出错,请联系客服</Text></View>)
                    }}
                    userAgent='TDJAPP'
                    bounces={false}
                    scalesPageToFit={true}
                    source={{uri:params.text}}
                    onMessage={this.handleMessage(navigate)}  
                ></WebView>
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
        width: pxToDp(40),
        height: pxToDp(40),
      },
      headerText: {
        fontSize: pxToDp(36),
        color: 'white',
        backgroundColor:'rgba(0,0,0,0)'
      },
      container: {
        flex: 1,
    }
});
module.exports=Index
