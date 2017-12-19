/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
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
  TextInput ,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ListView,
  Modal
} from 'react-native';

import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}
class StorePayment extends Component{
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state={
          QRcode:''
        }
        fetch(global.url+'/api/User/GetPayCode?','get','',(responseData)=>{
            this.setState({OneDimensionalCode:responseData.data.barCodeSrc,QRcode:responseData.data.qrCodeSrc})   
        }) 
    }
    render(){
      const { navigate } = this.props.navigation;
        return(
          <View>
          <View style={styles.header}>
              <Text style={styles.headerText}>门店付款码</Text>
          </View>
          <ScrollView style={{backgroundColor:'#f68900',height:scrrollHeight(pxToDp(260))}}>
            <View style={styles.body}>
              <View style={styles.shopPaymentCode}>
                <Image style={styles.shopPaymentCodeImg} source={require('../images/code.png')}></Image><Text style={styles.shopPaymentCodeText}>门店付款码</Text>
              </View>
              <View style={styles.bodyCodeImgWrap}>
                 <Image style={styles.OneDimensionalCode} source={require('../images/One-dimensional-code.jpg')}></Image>
                 <Text style={styles.seeCodeNum}>点击可查看付款码数字</Text>
                 <Image style={styles.QRCode} source={{uri:this.state.QRcode}}></Image>
              </View>
              <View style={styles.total}>
                <View style={styles.totalType}>
                  <View style={styles.totalType1}><Text  style={styles.totalTypeText}>全品类卡</Text><Text style={styles.totalTypeSingleVolume}>¥200.00</Text></View>
                  <View style={styles.totalType2}><Text  style={styles.totalTypeText}>全品账户</Text><Text style={styles.totalTypeSingleVolume}>¥200.00</Text></View>
                </View>
                <View style={styles.totalBalance}>
                  <Text style={styles.totalBalanceText}>总余额</Text><Text style={styles.totalBalancePrice}>¥400.00</Text>
                </View>
              </View>
            </View>
            <View style={styles.allCard}>
              <Image style={styles.allCardImg} source={require('../images/card.png')}></Image><Text style={styles.allCardText}>查看所有礼品卡</Text><Image style={styles.dir} source={require('../images/dir.png')}></Image>
            </View>
            <View style={styles.allAccount}>
              <Image style={styles.allAccountImg} source={require('../images/account.png')}></Image><Text style={styles.allCardText}>查看所有礼品卡</Text><Image style={styles.dir} source={require('../images/dir.png')}></Image>
            </View>
          </ScrollView> 
         </View> 
        );
    }
}
const styles = StyleSheet.create({
     header: {
      paddingTop: pxToDp(40),
      height: pxToDp(153),
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: '#f68900'
    },
    headerBack: {
      marginLeft: pxToDp(26),
      marginRight: pxToDp(26),
      width: pxToDp(23),
      height: pxToDp(40),
    },
    headerText: {
      borderLeftWidth: pxToDp(1),
      borderLeftColor: 'white',
      paddingLeft: pxToDp(24),
      fontSize: pxToDp(36),
      color:'white'
    },
    body: {
      marginTop: pxToDp(24),
      marginLeft: pxToDp(24),
      marginRight: pxToDp(24),
      backgroundColor:'white',
      borderRadius: 5,
      overflow:'hidden'
    },
    shopPaymentCode: {
      flexDirection: 'row',
      paddingTop:pxToDp(30),
      paddingBottom: pxToDp(20),
      backgroundColor: '#f6f6f6',
      alignItems:"baseline"
    },
    shopPaymentCodeImg: {
      width: pxToDp(41),
      height: pxToDp(37),
      marginLeft: pxToDp(28),
      marginRight: pxToDp(18)
    },
    shopPaymentCodeText: {
      fontSize: pxToDp(32),
    },
    bodyCodeImgWrap: {
      marginLeft: pxToDp(24),
      marginRight: pxToDp(24),
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#e1e1e1',
      alignItems: 'center'
    },
    OneDimensionalCode: {
      marginTop: pxToDp(48),
      width: pxToDp(592),
      height: pxToDp(166)
    },
    seeCodeNum:{
      height: pxToDp(64),
      textAlignVertical:'center',
      fontSize: pxToDp(28),
      color: '#9f9f9f',
      textAlign: 'center'
    },
    QRCode: {
       marginTop: pxToDp(30),
       marginBottom: pxToDp(52),
       width: pxToDp(270),
       height: pxToDp(270)
    },
    total: {
      flexDirection: 'row',
      paddingTop: pxToDp(38),
      paddingBottom: pxToDp(50),
    },
    totalType: {
      borderRightWidth: pxToDp(1),
      borderRightColor: '#e1e1e1'
    },
    totalType1: {
      flexDirection: 'row',
    },
    totalType2: {
      flexDirection: 'row',
      marginTop: pxToDp(32)
    },
    totalTypeText: {
      marginLeft: pxToDp(86),
      color: '#9f9f9f',
      fontSize: pxToDp(24)
    },
    totalTypeSingleVolume: {
      marginLeft: pxToDp(26),
      marginRight: pxToDp(56),
      color: '#9f9f9f',
      fontSize: pxToDp(24)
    },
    totalBalance: {
      flexDirection: 'row',
      paddingLeft : pxToDp(36),
      alignItems: 'center',
    },
    totalBalanceText: {
      fontSize: pxToDp(32),
      color: "#ff3f00",
      marginRight: pxToDp(26)
    },
    totalBalancePrice: {
      fontSize: pxToDp(32),
      color: "#ff3f00",
    },
    allCard: {
      flexDirection: 'row',
      alignItems: 'baseline',
      backgroundColor: 'white',
      height: pxToDp(114),
      paddingTop: pxToDp(34),
      marginTop: pxToDp(20),
      marginLeft: pxToDp(22),
      marginRight: pxToDp(22),
      borderRadius: 4,
    },
    allCardImg: {
      width: pxToDp(50),
      height: pxToDp(40),
      marginLeft: pxToDp(25)
    },
    allCardText: {
      fontSize: pxToDp(32),
      marginLeft: pxToDp(10)
    },
    dir: {
      width: pxToDp(20),
      height: pxToDp(40),
      marginLeft: pxToDp(350)
    },
    allAccount: {
      flexDirection: 'row',
      alignItems: 'baseline',
      backgroundColor: 'white',
      height: pxToDp(114),
      paddingTop: pxToDp(34),
      marginTop: pxToDp(20),
      marginLeft: pxToDp(22),
      marginRight: pxToDp(22),
      marginBottom: pxToDp(20),
      borderRadius: 4,
    },
    allAccountImg: {
      width: pxToDp(40),
      height: pxToDp(40),
      marginLeft: pxToDp(25)
    }
});
module.exports=StorePayment 