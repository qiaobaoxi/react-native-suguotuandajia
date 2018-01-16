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
class CustomerService extends Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
        
    }
    handleMessage(navigate,e) {
        //   navigate('OrderDetail')
    }
    render(){
        const { navigate, goBack} = this.props.navigation;
        return(
            <View style={{flex: 1}}>
                <Header goBack={goBack} text={'客服'}></Header>
                <WebView
                    style={{
                    backgroundColor: "#e5e5e5",
                    height: 100,
                    }}
                    userAgent='TDJAPP'
                    startInLoadingState={true}
                    renderError={() => {
                        return (<View style={styles.container}><Text>网络出错,请联系客服</Text></View>)
                    }}
                    source={{uri:global.url+'/web/customerservice/index.html'}}
                    onMessage={this.handleMessage(navigate)}  
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
    
});
module.exports=CustomerService
