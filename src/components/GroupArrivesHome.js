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
    handleMessage(navigate,e) {
        //   navigate('OrderDetail')
    }
    render(){
        const { navigate, goBack} = this.props.navigation;
        Cookie.get(global.url).then((cookie) => {
            if(!cookie||!cookie.userId){
                navigate("Login")
            }else{
                Cookie.set(global.url+'/web/companyPurchase.html', 'userId', cookie.userId).then(() => console.log('success'));
            }
        })
        const { params} = this.props.navigation.state;
        let num=''
        if(params){
           num=params.num
        }
        return(
            <View style={{flex: 1}}>
                <Header goBack={goBack} text={'企业采购'}></Header>
                <WebView
                    style={{
                    backgroundColor: "#e5e5e5",
                    height: 100,
                    }}
                    source={{uri:global.url+'/web/companyPurchase.html'}}
                    onMessage={this.handleMessage(navigate)}  
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        position: 'relative',
        backgroundColor: 'white',
        height: pxToDp(96),
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
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
        fontSize: pxToDp(36),
        color: 'white',
        backgroundColor:'rgba(0,0,0,0)'
      },
});
module.exports=Index
