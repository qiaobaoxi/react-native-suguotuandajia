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
import Cookie from 'react-native-cookie';
import Header from '../js/header'
const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
    }
    handleMessage(navigate, e) {
        // if(e){
        //   navigate('Home')
        // }
    }
    render(){
        const { navigate, goBack } = this.props.navigation;
        let sTime = new Date().getTime()
        Cookie.get(global.url).then((cookie) => {
            if(!cookie||!cookie.userId){
                navigate("Login")
            }else{
                Cookie.set(global.url+'/web/myCard.html', 'userId', cookie.userId).then(() => console.log('success'));
            }
        })
        return(
            <View style={{flex:1}}>
                <Header goBack={goBack} text={'我的卡券'}></Header>
                <WebView
                        style={{
                            backgroundColor: "#e5e5e5",
                            height: 100,
                    }}
                    startInLoadingState={true}
                    userAgent='TDJAPP'
                    renderError={() => {
                        return (<View style={styles.container}><Text>网络出错,请联系客服</Text></View>)
                    }}
                        source={
                            {uri:global.url+'/web/myCard.html?sTime='+sTime}
                    }
                    onMessage={this.handleMessage(navigate)}  
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
