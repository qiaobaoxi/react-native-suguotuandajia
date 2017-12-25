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
  Modal,
  RefreshControl
} from 'react-native';
import Cookie from 'react-native-cookie';
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
          QRcode:'',
          OneDimensionalCode: '',
          cardBalance: '',
          enterpriseAccountBalance: '',
          isRefreshing:false
        }
        fetch(global.url+'/api/User/GetPayCode?','get','',(responseData)=>{
          console.log(responseData)
          this.setState({OneDimensionalCode:responseData.data.barCodeSrc,QRcode:responseData.data.qrCodeSrc,code:responseData.data.code})   
      }) 
      fetch(global.url+'/api/User/GetBalance','get','',(responseData)=>{
          this.setState({cardBalance:responseData.data.cardBalance,enterpriseAccountBalance:responseData.data.enterpriseAccountBalance})   
      }) 
        
    }
    componentDidUpdate(){
      // Alert.alert('111')
    }
    _onRefresh() {
      this.setState({isRefreshing: true});
      setTimeout(() => {
        // prepend 10 items
        fetch(global.url+'/api/User/GetPayCode?','get','',(responseData)=>{
          console.log(responseData)
          this.setState({OneDimensionalCode:responseData.data.barCodeSrc,QRcode:responseData.data.qrCodeSrc,code:responseData.data.code})   
      }) 
      fetch(global.url+'/api/User/GetBalance','get','',(responseData)=>{
          this.setState({cardBalance:responseData.data.cardBalance,enterpriseAccountBalance:responseData.data.enterpriseAccountBalance})   
      }) 
      this.setState({isRefreshing: false});
      }, 1000);
  }
    render(){
      const { navigate } = this.props.navigation;
        return(
          <View>
          <View style={styles.header}>
              <Text style={styles.headerText}>门店付款</Text>
          </View>
          <ScrollView style={{backgroundColor:'#f68900',height:scrrollHeight(pxToDp(240))}} refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
          />
        }>
            <View style={styles.body}>
              <View style={styles.shopPaymentCode}>
                <Image style={styles.shopPaymentCodeImg} source={require('../images/code.png')}></Image><Text style={styles.shopPaymentCodeText}>门店付款</Text>
              </View>
              <View style={styles.bodyCodeImgWrap}>
                 <Image style={styles.OneDimensionalCode} source={{uri:this.state.OneDimensionalCode}}></Image>
                 <Text style={styles.seeCodeNum}>{this.state.code}</Text>
                 <Image style={styles.QRCode} source={{uri:this.state.QRcode}}></Image>
              </View>
              <View style={styles.total}>
                <View style={styles.totalType}>
                  <View style={styles.totalType1}><Text  style={styles.totalTypeText}>全品类卡</Text><Text style={styles.totalTypeSingleVolume}>¥{this.state.cardBalance}</Text></View>
                  <View style={styles.totalType2}><Text  style={styles.totalTypeText}>企业账户</Text><Text style={styles.totalTypeSingleVolume}>¥{this.state.enterpriseAccountBalance}</Text></View>
                </View>
                <View style={styles.totalBalance}>
                  <Text style={styles.totalBalanceText}>总余额</Text><Text style={styles.totalBalancePrice}>¥{this.state.cardBalance>=0?this.state.cardBalance+this.state.enterpriseAccountBalance:null}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => {
                        Cookie.get(global.url).then((cookie) => {
                          console.log(cookie)
                          if(!cookie||!cookie.userId){
                              navigate("Login")
                          }else{
                              navigate("MyCard")
                          }
                        })
                      }
                     } style={styles.allCard}>
              <Image style={styles.allCardImg} source={require('../images/card.png')}></Image><Text style={styles.allCardText}>查看我的卡劵</Text><Image style={styles.dir} source={require('../images/dir.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              Cookie.get(global.url).then((cookie) => {
                  if(!cookie||!cookie.userId){
                      navigate("Login")
                  }else{
                    navigate('EnterpriseAccount')
                  }
              })
            }} style={styles.allAccount}>
              <Image style={styles.allAccountImg} source={require('../images/account.png')}></Image><Text style={styles.allCardText}>查看企业账户</Text><Image style={styles.dir} source={require('../images/dir.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.allAccount} onPress={()=> navigate('Store')}>
              <Image style={styles.allAccountImg1} source={require('../images/storeAddress.png')}></Image><Text style={styles.allCardText}>查看线下门店</Text><Image style={styles.dir} source={require('../images/dir.png')}></Image>
            </TouchableOpacity>
          </ScrollView> 
         </View> 
        );
    }
}
const styles = StyleSheet.create({
     header: {
      paddingTop: pxToDp(40),
      height: pxToDp(130),
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
      marginTop: pxToDp(10),
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
      marginBottom: pxToDp(10),
      borderRadius: 4,
    },
    allAccountImg: {
      width: pxToDp(40),
      height: pxToDp(40),
      marginLeft: pxToDp(25)
    },
    allAccountImg1: {
      width: pxToDp(34),
      height: pxToDp(40),
      marginLeft: pxToDp(25)
    }
});
module.exports=StorePayment 