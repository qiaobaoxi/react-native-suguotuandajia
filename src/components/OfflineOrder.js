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
  ListView,
  TouchableOpacity
} from 'react-native';
import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;
import Header from '../js/header'
const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
        // this.state = {
        //   dataSource: ds.cloneWithRows([]),
        // };
        // fetch(global.url+'/API/user/getUserAddressList','get','',(responseData)=>{
        //     // this.setState({num:responseData.cartNum})
        //       if(typeof responseData=='object'){
        //          this.setState({dataSource:ds.cloneWithRows(responseData.data)})
        //       }
        // }) 
    }
  handleMessage(evt: any) {
      Alert.alert('1')
      // global.addressId=evt.nativeEvent.data.addressId
      // const { navigate } = this.props.navigation;
      // navigate('Order',evt.nativeEvent.data)
    }
    render(){
        const { navigate,goBack } = this.props.navigation;
        return(
            <View style={{flex:1}}>
              <Header goBack={goBack} text={'线下订单列表'}></Header>
              <WebView
                source={{uri:global.url+'/web/my/offlineOrder.html'}}
                userAgent='TDJAPP'
                startInLoadingState={true}
                renderError={() => {
                  return (<View style={styles.container}><Text>网络出错,请联系客服</Text></View>)
                }}
                userAgent="TDJAPP"
                onMessage={this.handleMessage.bind(this)}  
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
    paddingLeft: pxToDp(24),
    fontSize: pxToDp(36),
    color: 'white',
    backgroundColor:'rgba(0,0,0,0)'
  },
});
module.exports=Index
