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
      // global.addressId=evt.nativeEvent.data.addressId
      // const { navigate } = this.props.navigation;
      // navigate('Order',evt.nativeEvent.data)
    }
    render(){
        const { navigate,goBack } = this.props.navigation;
        return(
            // <ScrollView>
            //   <View style={styles.freight}>
            //     <Image style={styles.freightImg} source={require('../images/freight.png')}></Image><Text style={styles.freightText}>送货上门</Text>
            //   </View>
            //   <ListView
            //       dataSource={this.state.dataSource}
            //       renderRow={(rowData,row,selected) =>
            //         <View style={styles.addressList}> 
            //           <View style={styles.addressListConsignee}><Text style={styles.addressListTitle}>收货人：</Text><Text style={styles.addressListName}>{rowData.consignee}</Text><Text style={styles.addressListTel}>{rowData.consigneePhone}</Text></View>
            //           <View style={styles.addressListShippingAddressDetail}><Text style={styles.addressListShippingAddressTitle}>收货地址：</Text><Text style={styles.addressListShippingAddress}>{rowData.detailedAddress}</Text></View>
            //           <TouchableOpacity style={styles.defaultAddressWrap} onPress={()=>{
            //                 global.addressId=rowData.id
            //                 fetch(global.url+'/API/user/setDefaultAddress','post',{id:rowData.id},(responseData)=>{
            //                       var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            //                       for(let i=0;i<this.state.dataSource._dataBlob.s1.length;i++){
            //                         this.state.dataSource._dataBlob.s1[i].isDefault = 0
            //                       }
            //                      this.state.dataSource._dataBlob.s1[selected].isDefault = 1
            //                      this.setState({dataSource:ds.cloneWithRows(this.state.dataSource._dataBlob.s1)})
            //                 }) 
            //                 navigate('Order')      
            //             }}>
            //              <View style={rowData.isDefault==1?styles.defaultAddressDetermineWrap:styles.NOdefaultAddressDetermineWrap}><View style={rowData.isDefault==1?styles.defaultAddressDetermine:styles.NOdefaultAddressDetermine}><Text style={rowData.isDefault==1?styles.defaultAddressDetermine:styles.NOdefaultAddressDetermine}></Text></View></View><Text style={styles.defaultAddressDetermineText}>设为默认</Text>
            //           </TouchableOpacity>
            //         </View> 
            //       }
            //   />
            // </ScrollView>
            <View style={{flex:1}}>
              <Header goBack={goBack} text={'线下订单列表'}></Header>
              
              <WebView
                  source={{uri:global.url+'/web/my/offlineOrder.html'}
                }
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
