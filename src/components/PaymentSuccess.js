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
  Picker
} from 'react-native';
import citysWrap from '../json/citys.json'
const deviceWidthDp = Dimensions.get('window').width;


const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Store extends Component{
    
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
    }
    render(){
      const { navigate } = this.props.navigation;
        return(
          <View>
            <View style={styles.header}>
              <TouchableOpacity style={{height:'100%',justifyContent:"center"}} onPress={() => navigate('Home')}>
                <Image style={styles.headerBack} source={require('../images/back.png')}></Image>
              </TouchableOpacity>
              <Text style={styles.headerText}>付款成功</Text>
            </View>
            <View style={styles.body}>
               <Image style={styles.paymentSuccessImg} source={require('../images/paymentSuccess.png')}></Image>
               <Text style={styles.paymentSuccessTitle}>支付成功</Text>
               <Text style={styles.paymentSuccessPrice}>¥200.00</Text>
               <View style={styles.paymentSuccessBtn}><Text style={styles.paymentSuccessSeeOrder}>查看订单</Text><Text style={styles.paymentSuccessBackHome}>返回首页</Text></View>
            </View>
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
      borderBottomColor:'#daddde'
    },
    headerBack: {
      marginLeft: pxToDp(26),
      marginRight: pxToDp(26),
      width: pxToDp(23),
      height: pxToDp(40),
    },
    headerText: {
      borderLeftWidth: pxToDp(1),
      borderLeftColor: '#daddde',
      paddingLeft: pxToDp(24),
      fontSize: pxToDp(36)
    },
    body: {
      alignItems:'center'
    },
    paymentSuccessImg: {
      marginTop: pxToDp(70),
      width: pxToDp(124),
      height: pxToDp(124)
    },
    paymentSuccessTitle: {
      marginTop: pxToDp(22),
      fontSize: pxToDp(36),
      color: '#a2a2a2',
    },
    paymentSuccessPrice: {
      marginTop: pxToDp(40),
      fontSize: pxToDp(66)
    },
    paymentSuccessBtn: {
      marginTop: pxToDp(94),
      flexDirection: 'row',
    },
    paymentSuccessSeeOrder: {
      marginRight: pxToDp(18),
      width: pxToDp(298),
      height: pxToDp(80),
      borderWidth: pxToDp(1),
      borderColor: '#b1b1b1',
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: 4
    },
    paymentSuccessBackHome: {
      width: pxToDp(298),
      height: pxToDp(80),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      textAlign: 'center',
      textAlignVertical: 'center',
      backgroundColor: '#ff8e00',
      color: 'white',
      borderRadius: 4
    }
});
module.exports=Store