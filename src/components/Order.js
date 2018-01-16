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
import * as WeChat from 'react-native-wechat';
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
  Picker,
  RefreshControl
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Fetch from '../js/fetch'
import Header from '../js/header'
import WxPay from '../js/wxPay'
import Toast from '@remobile/react-native-toast';
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;
const DeviceInfo = require('react-native-device-info');
WeChat.registerApp('wx552eb71ba49e52ad')

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}
class Store extends Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows([]),
          modelVistibal: false,
          payNum: 1,
          payName: '微信支付',
          isRefreshing: false,
          warmmsg:''
        };
        if(!global.addressId){
          global.addressId=0
      }
      
      this.checkout(this)
  }
  checkout(This) { 
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let params={
      addressId: global.addressId,
      defaultDeliveryType: '0',
      products: global.goods
    }

    Fetch(global.url + '/API/MyCart/checkout', 'post', params, (responseData) => {
      if (!responseData.success) {
            Alert.alert(responseData.message)
          }
        if(responseData.data.address){
          global.addressId=responseData.data.address.id
        }
        if(typeof responseData=='object'){
          let num=0
          for(let i=0;i<responseData.data.shopCartListDt.length;i++){
            if(responseData.data.shopCartListDt[i].goodId>=0){
              num+=responseData.data.shopCartListDt[i].count
            }else{
              console.log(responseData.data.shopCartListDt)
              This.setState({shippingFee: responseData.data.shopCartListDt[i]})
              responseData.data.shopCartListDt.splice(i,1)
            }
          }
          This.setState({dataSource:ds.cloneWithRows(responseData.data.shopCartListDt),allCount:num,totalAmount:responseData.data.totalAmount,freight:responseData.data.shippingFee,address: responseData.data.address,totalCardPayment:responseData.data.totalCardPayment,enterpriseAccountPayment:responseData.data.enterpriseAccountPayment,payAmount:responseData.data.payAmount})
        }
  },(error)=>{
      Alert.alert(error+'')    
  })
  let timeStamp= new Date().getTime()
  }
    address(navigate){
      if(this.state.address){
          return(
               <TouchableOpacity style={styles.userDetail} onPress={()=>navigate('Address')}>
                <View style={styles.userDetailAddressImgWrap}>
                  <Image style={styles.userDetailAddressImg} source={require('../images/address.png')}></Image>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userInfoNameAndTelWrap}><Text style={styles.userInfoName}>{this.state.address.consignee}</Text><Text style={styles.userInfoTel}>{this.state.address.consigneePhone}</Text></View>
                  <View style={styles.userInfoAddressWrap}><Text style={styles.userInfoAddress}>{this.state.address.detailedAddress}</Text></View>
                </View>
                <View style={styles.rightImgWrap}>
                  <Image style={styles.rightImg} source={require('../images/right.png')}></Image>
                </View>
                <Image style={styles.line} source={require('../images/line.jpg')}></Image>
               </TouchableOpacity>
              )
      }else{
          return(
                <TouchableOpacity style={styles.userDetail1} onPress={()=>navigate('Address')}>
                  <View style={styles.userDetailAddressImgWrap}>
                    <Image style={styles.userDetailAddressImg} source={require('../images/address.png')}></Image>
                  </View>
                  <Text style={styles.distributionMode}>配送方式</Text><Text style={styles.selectAddress}>请选择配送方式</Text>
                  <View style={styles.rightImgWrap}>
                    <Image style={styles.rightImg} source={require('../images/right.png')}></Image>
                  </View>
                  <Image style={styles.line} source={require('../images/line.jpg')}></Image>
                </TouchableOpacity>
                )
      }
  }
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      // prepend 10 items
      this.checkout(this)
      this.setState({
        isRefreshing: false,
      });
    }, 1000);
}
    render(){
      const { navigate,goBack } = this.props.navigation;
        return(
          <View style={{flex: 1}}>
            <Header goBack={goBack} text={'确认订单'}></Header>
            <ScrollView style={styles.scroll}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh.bind(this)}
                  tintColor="#ff0000"
                  title="Loading..."
                  titleColor="#00ff00"
                  colors={['#f48722', '#f48722', '#f48722']}
                  progressBackgroundColor="#fbdcb7"
                />
              }
            >
                {this.address(navigate)}
                <ListView
                  dataSource={this.state.dataSource}
                  contentContainerStyle={styles.listWrap}
                  renderRow={(rowData) => 
                        <View style={styles.list}>
                          <View style={styles.goods}>
                            <Image style={styles.goodsImg} source={{uri:rowData.goodImg.split('|')[0]}}></Image>
                          </View>
                          <View style={styles.goodsDetail}>
                            <View style={styles.goodsDetailNameWrap}><Text style={styles.goodsDetailName}>{rowData.goodName}</Text></View>
                            <View style={styles.goodsDetailSpecificationsWrap}><Text style={styles.goodsDetailSpecifications}>规格：</Text><Text style={styles.goodsDetailSpecificationsNum}>{rowData.spec}</Text></View>
                            <View style={styles.goodsDetailPrice}><Text style={styles.goodsDetailPriceSymbol}>¥</Text><Text style={styles.goodsDetailPriceSymbolNum}>{(rowData.price*rowData.count).toFixed(2)}</Text><Text style={styles.goodsNum}>X{rowData.count}</Text></View>
                          </View>
                        </View>
                  }
                />
                <View style={styles.remarksWrap}>
                  <Text style={styles.remarksText}>备注：</Text>
                  <TextInput
                    style={styles.remarksInput}
                    onChangeText={(text) => this.setState({text})}
                    underlineColorAndroid={'transparent'}
                    placeholder={'选填本次交易说明'}
                    placeholderTextColor={'#a6a6a6'}
                  />
                </View>
                <TouchableOpacity onPress={()=>{
                  this.setState({modelVistibal:true})
                }} style={styles.paymentMethodWrap1}>
                   <Text style={styles.paymentMethodText1}>支付方式</Text>
                   <View style={styles.paymentMethod1Wrap}><Text style={styles.paymentMethod1}>微信支付</Text></View>
                   <Image style={styles.select} source={require('../images/select.png')}></Image>
                </TouchableOpacity>
                <View style={styles.totleDetail}>
                  <View style={[styles.totleNumWrap,styles.totleSame]}>
                    <Text style={[styles.totalTitleSame,styles.totleNumTitle]}>商品件数</Text>
                    <Text style={styles.totleNum}>共{this.state.allCount}件</Text>
                  </View>
                  <View style={[styles.totlePriceWrap,styles.totleSame]}>
                    <Text style={[styles.totalTitleSame,styles.totlePriceTitle]}>商品金额</Text> 
                    <View style={styles.totlePrice}>
                       <Text style={[styles.totlePriceSymble,styles.totalSymbleSame]}>¥</Text>
                       <Text style={styles.totlePriceNum}>{this.state.totalAmount}</Text>
                    </View>
                  </View>
                  <View style={[styles.distributionFeeWrap,styles.totleSame]}>
                    <Text style={[styles.totalTitleSame,styles.distributionFeeTitle]}>配送费</Text>
                    <View style={styles.distributionFee}>
                      <Text style={styles.distributionFeeAdd}>+</Text>
                      <Text style={[styles.distributionFeeSymble,styles.totalSymbleSame]}>¥</Text>
                      <Text style={styles.distributionFeePrice}>{this.state.freight}</Text>
                    </View>
                  </View>
                  <View style={[styles.orderTotleWrap,styles.totleSame]}>
                    <Text style={[styles.totalTitleSame,styles.orderTotleTitle]}>订单总金额</Text>
                    <View style={styles.orderTotlePrice}>
                      <Text style={[styles.orderTotleSymble,styles.totalSymbleSame]}>¥</Text>
                      <Text style={styles.orderTotlePrcie}>{this.state.totalAmount?this.state.totalAmount+this.state.freight:0}</Text>
                    </View>
                  </View>
                  <View style={[styles.cardPayment,styles.totleSame]}>
                    <Text style={[styles.totalTitleSame,styles.cardPaymentTitle]}>卡支付</Text>
                    <View style={styles.cardPaymentPriceWrap}>
                      <Text style={styles.cardPaymentPricePeduce}>-</Text>
                      <Text style={[styles.cardPaymentPriceSymble,styles.totalSymbleSame]}>¥</Text>
                      <Text style={styles.cardPaymentPrice}>{this.state.totalCardPayment}</Text>
                      {/* <Image style={styles.cardPaymentRight} source={require('../images/right.png')}></Image> */}
                    </View>
                  </View>
                  {this.state.enterpriseAccountPayment>0?
                  <View style={[styles.distributionFeeWrap,styles.totleSame]}>
                    <Text style={[styles.totalTitleSame,styles.distributionFeeTitle]}>企业账户支付</Text>
                    <View style={styles.distributionFee}>
                      <Text style={styles.distributionFeeAdd}>-</Text>
                      <Text style={[styles.distributionFeeSymble,styles.totalSymbleSame]}>¥</Text>
                      <Text style={styles.distributionFeePrice}>{this.state.enterpriseAccountPayment}</Text>
                    </View>
                  </View>
                  :null
                }
                </View>
              </ScrollView>
              <View style={styles.submit1}>
                <Text style={styles.submitTitle}>实付金额：</Text>
                <Text style={styles.submitSymble}>¥</Text>
                <Text style={styles.submitPrice}>{this.state.payAmount}</Text>
                <TouchableOpacity style={styles.submitBtn1} onPress={()=>{
                    const { navigate } = this.props.navigation;
                    let arr= this.state.dataSource._dataBlob.s1.slice()
                    if(this.state.shippingFee){
                      arr.push(this.state.shippingFee)
                    }
                    let params = {
                      isApp: true,
                      cartProducts: arr,
                      customerAddressId: global.addressId,
                      customerCouponId: '',
                      defaultDeliveryType: 0,
                      enterpriseAccountPayment: this.state.enterpriseAccountPayment,
                      pickUpPerson: '',
                      pickUpPhone: '',
                      pickUpPointsId: '',
                      remark: '',
                      isApp:true
                    }
                     WxPay(params, WeChat, navigate, '/API/Order/Add')
                  }}>
                  <Text style={styles.submitBtn1Text} >
                    提交订单
                  </Text>    
                </TouchableOpacity>
              </View>
              <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.modelVistibal}
                onRequestClose={() => {alert("Modal has been closed.")}}
                >
                <View style={{backgroundColor:"rgba(0,0,0,0.3)",height:"100%"}}>
                 <View style={styles.paymentMethodWrap}>
                  <View style={styles.paymentMethod}>
                    <Text style={styles.paymentMethodTitle}>支付方式</Text>
                    <TouchableOpacity style={styles.close} onPress={()=>{
                      this.setState({modelVistibal:false})
                    }}>
                      <Image style={styles.closeImg} source={require('../images/close.png')}></Image>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.wechat}  onPress={()=>{
                      this.setState({payNum:2})
                    }}>
                      <Image style={styles.wechatImg} source={require('../images/wechat.png')}></Image>
                      <Text style={styles.wechatName}>微信支付</Text>
                      <View style={this.state.payNum==2?styles.determineActive1:styles.determine1}>
                        <Image style={styles.determineImg} source={require('../images/determine.png')}></Image>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.submit}><Text style={styles.submitBtn} onPress={()=>{
                      let pays=['微信支付']
                      this.setState({payName:pays[this.state.payNum-1],modelVistibal:false})
                    }}>确认</Text></View>
                  </View> 
                 </View> 
                </View>
            </Modal>
          </View> 
        );
    }
}
const styles = StyleSheet.create({
    userDetail: {
      borderTopWidth: pxToDp(1),
      borderTopColor:'#daddde',
      flexDirection: 'row',
      alignItems: 'center',
      height: pxToDp(191),
      backgroundColor: 'white',
      position:'relative'
    },
    userDetail1: {
      borderTopWidth: pxToDp(1),
      borderTopColor:'#daddde',
      flexDirection: 'row',
      alignItems: 'center',
      height: pxToDp(90),
      backgroundColor: 'white',
      position:'relative'
    },
    distributionMode: {
      fontSize: pxToDp(28),
      marginRight: pxToDp(300)
    },
    selectAddress: {
      fontSize: pxToDp(28),
    },
    userDetailAddressImg: {
      width: pxToDp(26),
      height: pxToDp(30),
      marginLeft: pxToDp(24),
      marginRight: pxToDp(18),
    },
    userInfo: {
      width: pxToDp(618)
    },
    userInfoNameAndTelWrap: {
      flexDirection: 'row',
    },
    userInfoName: {
      fontSize: pxToDp(32),
      color: '#1d1d20',
      fontWeight: 'bold',
      marginRight: pxToDp(46)
    },
    userInfoTel: {
      fontSize: pxToDp(32),
      color: '#1d1d20',
      fontWeight: 'bold'
    },
    userInfoAddress: {
      fontSize: pxToDp(28),
      color: '#1d1d20'
    },
    line: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: pxToDp(5),
      width: '100%'
    },
    rightImgWrap: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: pxToDp(24)
    },
    rightImg: {
      width: pxToDp(18),
      height: pxToDp(38)
    },
    scroll: {
      height: scrrollHeight(pxToDp(270))
    },
    listWrap: {
      backgroundColor: 'white',
      marginTop: pxToDp(20),
      marginBottom: pxToDp(20),
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#daddde',
      marginLeft: pxToDp(22),
      paddingTop: pxToDp(30),
      paddingBottom: pxToDp(30),
    },
    goods: {
      width: pxToDp(160),
      height: pxToDp(160),
      borderWidth: pxToDp(1),
      borderColor: '#daddde',
      borderRadius: 4,
      overflow: 'hidden'
    },
    goodsImg: {
      width: "100%",
      height: "100%"
    },
    goodsDetail: {
      marginLeft: pxToDp(24),
      height: pxToDp(160)
    },
    goodsDetailNameWrap: {
      height:pxToDp(68)
    },
    goodsDetailName: {
      width: pxToDp(492),
      fontSize: pxToDp(28),
      color: '#2b2b2b',
    },
    goodsDetailSpecificationsWrap: {
      flexDirection:'row',
      marginTop: pxToDp(15)
    },
    goodsDetailSpecifications: {
      fontSize: pxToDp(24),
      color: '#a2a2a2'
    },
    goodsDetailSpecificationsNum: {
      fontSize: pxToDp(24),
      color: '#a2a2a2',
    },
    goodsDetailPrice: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      marginTop: pxToDp(10)
    },
    goodsDetailPriceSymbol: {
      fontSize: pxToDp(24),
      color: '#ff3f00',
    },
    goodsDetailPriceSymbolNum: {
      fontSize: pxToDp(32),
      color: '#ff3f00',
    },
    goodsNum: {
      position: 'absolute',
      right: pxToDp(0)
    },
    remarksWrap: {
      flexDirection: 'row',
      height: pxToDp(86),
      alignItems:'center',
      backgroundColor: 'white'
    },
    remarksText: {
      fontSize: pxToDp(28),
      color: '#2b2b2b',
      marginLeft: pxToDp(26)
    },
    remarksInput: {
      marginLeft: pxToDp(20),
      width: pxToDp(598)
    },
    paymentMethodWrap1: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      marginTop: pxToDp(22),
      position:'relative',
      height: pxToDp(88)
    },
    paymentMethodText1: {
      marginLeft: pxToDp(26),
      fontSize: pxToDp(28),
      color: '#2b2b2b'
    },
    paymentMethod1Wrap: {
      position:'absolute',
      right: pxToDp(68),
      height: pxToDp(86),
      textAlignVertical:'center',
      justifyContent: 'center'
    },
    paymentMethod1: {
      fontSize: pxToDp(28),
    },
    select: {
      position:'absolute',
      right: pxToDp(14),
      width: pxToDp(36),
      height: pxToDp(20)
    },
    totleDetail: {
      marginTop: pxToDp(20),
      backgroundColor: 'white',
    },
    totleSame: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      height: pxToDp(88),
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#daddde',
      marginLeft: pxToDp(26),
    },
    totleNumWrap: {
      position:'relative'
    },
    totalTitleSame: {
      fontSize: pxToDp(28),
      color: '#2b2b2b'
    },
    totleNumTitle: {
      
    },
    totalSymbleSame: {
      fontSize: pxToDp(24),
      color: '#ff3f00'
    },
    totleNum: {
      position: 'absolute',
      right: pxToDp(25),
      fontSize: pxToDp(28),
      color: '#2b2b2b'
    },
    totlePriceWrap: {
      position:'relative'
    },
    totlePrice: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      right: pxToDp(25),
    },
    totlePriceNum: {
      fontSize: pxToDp(32),
      color: '#ff3f00'
    },
    totlePriceTitle: {

    },
    distributionFee: {
      position:'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      right: pxToDp(25)
    },
    distributionFeeAdd: {
      marginRight: pxToDp(5),
      color:'#ff3f00',
    },
    distributionFeePrice: {
      fontSize: pxToDp(32),
      color: '#ff3f00',
    },
    orderTotlePrice: {
      position: 'absolute',
      right: pxToDp(25),
      flexDirection: 'row',
      alignItems: 'center'
    },
    orderTotlePrcie: {
      color: '#ff3f00',
      fontSize: pxToDp(32)
    },
    cardPaymentPriceWrap: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      right: pxToDp(25)
    },
    cardPaymentPricePeduce: {
      color: '#ff3f00',
      fontSize: pxToDp(28),
      marginRight: pxToDp(18)
    },
    cardPaymentPrice: {
      color: '#ff3f00',
      fontSize: pxToDp(32)
    },
    cardPaymentRight: {
      width: pxToDp(16),
      height: pxToDp(32),
      marginLeft: pxToDp(22)
    },
    submit1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'flex-end',
      height: pxToDp(104),
      backgroundColor: 'white',
      position: 'absolute',
      bottom: 0,
      width: '100%'
    },
    submitTitle: {
      fontSize: pxToDp(28),
      color: '#a2a2a2'
    },
    submitSymble: {
      fontSize: pxToDp(28),
      color:'#ff3f00'
    },
    submitPrice: {
      fontSize: pxToDp(36),
      color: '#ff3f00'
    },
    submitBtn1: {
      marginLeft: pxToDp(30),
      width: pxToDp(215),
      height: '100%',
      backgroundColor: '#ff8e00',
      color:'white',
      textAlignVertical: 'center',
      justifyContent: 'center'
    },
    submitBtn1Text: {
      textAlign: 'center',
      color:'white',
    },
    paymentMethodWrap: {
      position:'absolute',
      bottom:0,
      width:'100%',
      backgroundColor:'white'
    },
    paymentMethod: {
      position: 'relative',
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#daddde',
      height: pxToDp(92),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paymentMethodTitle: {
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    close: {
      position: 'absolute',
      right: 0,
      width: pxToDp(68),
      height: '100%',
      justifyContent:'center',
      alignItems: 'center'
    },
    closeImg: {
      width: pxToDp(24),
      height: pxToDp(24)
    },
    Alipay: {
      height: pxToDp(126),
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#daddde'
    },
    AlipayImg: {
      width: pxToDp(66),
      height: pxToDp(66),
      marginLeft: pxToDp(26),
      marginRight: pxToDp(22)
    },
    AlipayName: {
      fontSize: pxToDp(28)
    },
    determine: {
      marginLeft: pxToDp(492),
      width: pxToDp(44),
      height: pxToDp(44),
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      borderRadius: 100,
      alignItems:'center',
      justifyContent: 'center'
    },
    determineActive:{
      marginLeft: pxToDp(492),
      width: pxToDp(44),
      height: pxToDp(44),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      borderRadius: 100,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor:'#ff8e00'  
    },
    determineImg:{
      width: pxToDp(28),
      height: pxToDp(18)
    },
    wechat: {
      height: pxToDp(126),
      flexDirection: 'row',
      alignItems: 'center',
    },
    wechatImg: {
      width: pxToDp(66),
      height: pxToDp(66),
      marginLeft: pxToDp(26),
      marginRight: pxToDp(22)
    },
    wechatName: {
      fontSize: pxToDp(28)
    },
    determine1: {
      marginLeft: pxToDp(464),
      width: pxToDp(44),
      height: pxToDp(44),
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      borderRadius: 100,
      alignItems:'center',
      justifyContent: 'center'
    },
    determineActive1:{
      marginLeft: pxToDp(464),
      width: pxToDp(44),
      height: pxToDp(44),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      borderRadius: 100,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor:'#ff8e00'
    },
    submit: {
      height: pxToDp(100),
      width: '100%',
      backgroundColor: '#ff8e00',
      justifyContent: 'center'
    },
    submitBtn: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color:'white',
      fontSize: pxToDp(32)
    }
});
module.exports=Store