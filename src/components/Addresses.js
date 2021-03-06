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
import Header from '../js/header'
import Cookie from 'react-native-cookie';
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
      let data=JSON.parse(evt.nativeEvent.data)
      global.addressId=data.addressId
      const { navigate } = this.props.navigation;
      navigate('Order')
    }
    render(){
        const { navigate,goBack } = this.props.navigation;
        Cookie.get(global.url).then((cookie) => {
          if(!cookie||!cookie.userId){
              navigate("Login")
          }else{
              Cookie.set(global.url, 'userId', cookie.userId).then(() => console.log('success'));
          }
      })
        let time=new Date().getTime()
        return(
           <View style={{flex:1}}>
            <Header goBack={goBack} text={'请选择送货地址'}></Header>
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
                source={{uri:global.url+'/web/paymentDelivery.html?sTime='+time}
              }
              userAgent="TDJAPP"
              onMessage={this.handleMessage.bind(this)}  
            />
           </View> 
        );
    }
}
const styles = StyleSheet.create({
    freight: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: pxToDp(20),
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
        height: pxToDp(100),
        backgroundColor:'white'
    },
    freightImg: {
      width: pxToDp(72),
      height: pxToDp(72)
    },
    freightText: {
      color: '#8e8e8e',
      fontSize: pxToDp(28)
    },
    addressList: {
      marginBottom: pxToDp(20),
      backgroundColor:'white'
    },
    addressListConsignee: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: pxToDp(20),
      marginTop: pxToDp(30),
      marginRight: pxToDp(20),
      paddingTop: pxToDp(10),
      paddingBottom: pxToDp(10)
    },
    addressListTitle: {
      fontSize: pxToDp(28)
    },
    addressListName: {
      fontSize: pxToDp(28)
    },
    addressListTel: {
      marginLeft: pxToDp(40),
      fontSize: pxToDp(28)
    },
    addressListShippingAddressDetail: {
      flexDirection: 'row',
      marginLeft: pxToDp(20),
      marginBottom: pxToDp(30),
      marginRight: pxToDp(20)
    },
    addressListShippingAddressTitle: {
      fontSize: pxToDp(24),
      color: "#8e8e8e"
    },
    addressListShippingAddress: {
      fontSize: pxToDp(24),
      textAlignVertical:"center",
      color: "#8e8e8e"
    },
    defaultAddressWrap: {
      flexDirection:'row',
      alignItems: 'center',
      height: pxToDp(88),
      backgroundColor: '#fbfbfb',
      borderTopWidth: pxToDp(1),
      borderTopColor: '#eaeaea',
    },
    defaultAddressDetermineWrap: {
      width: pxToDp(40),
      height: pxToDp(40),
      borderWidth: pxToDp(1),
      borderColor: '#ea9a15',
      borderRadius: 100,
      marginLeft: pxToDp(20),
      marginRight: pxToDp(20),
      justifyContent: 'center',
      alignItems: 'center'
    },
    NOdefaultAddressDetermineWrap: {
      width: pxToDp(40),
      height: pxToDp(40),
      borderWidth: pxToDp(1),
      borderColor: '#c4c4c4',
      borderRadius: 100,
      marginLeft: pxToDp(20),
      marginRight: pxToDp(20),
      justifyContent: 'center',
      alignItems: 'center'
    },
    defaultAddressDetermine: {
      width: pxToDp(30),
      height: pxToDp(30),
      backgroundColor:'#ea9a15',
      borderRadius: 100,
      overflow: 'hidden'
    },
    NOdefaultAddressDetermine: {
      width: pxToDp(30),
      height: pxToDp(30),
      backgroundColor:'white',
      borderRadius: 100,
    }
});
module.exports=Index
