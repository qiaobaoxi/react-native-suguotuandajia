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

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows([]),
        };
        fetch(global.url+'/API/user/getUserAddressList','get','',(responseData)=>{
            // this.setState({num:responseData.cartNum})
              if(typeof responseData=='object'){
                 this.setState({dataSource:ds.cloneWithRows(responseData.data)})
              }
        }) 
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <ScrollView>
              <View style={styles.freight}>
                <Image style={styles.freightImg} source={require('../images/freight.png')}></Image><Text style={styles.freightText}>送货上门</Text>
              </View>
              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={(rowData,row,selected) =>
                    <View style={styles.addressList}> 
                      <View style={styles.addressListConsignee}><Text style={styles.addressListTitle}>收货人：</Text><Text style={styles.addressListName}>{rowData.consignee}</Text><Text style={styles.addressListTel}>{rowData.consigneePhone}</Text></View>
                      <View style={styles.addressListShippingAddressDetail}><Text style={styles.addressListShippingAddressTitle}>收货地址：</Text><Text style={styles.addressListShippingAddress}>{rowData.detailedAddress}</Text></View>
                      <TouchableOpacity style={styles.defaultAddressWrap} onPress={()=>{
                            global.addressId=rowData.id
                            fetch(global.url+'/API/user/setDefaultAddress','post',{id:rowData.id},(responseData)=>{
                                 var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                 for(let i=0;i<this.state.dataSource._dataBlob.s1.length;i++){
                                        this.state.dataSource._dataBlob.s1[i].isDefault = 0
                                 }
                                 this.state.dataSource._dataBlob.s1[selected].isDefault = 1
                                 this.setState({dataSource:ds.cloneWithRows(this.state.dataSource._dataBlob.s1)})
                            }) 
                            navigate('Order')      
                        }}>
                         <View style={rowData.isDefault==1?styles.defaultAddressDetermineWrap:styles.NOdefaultAddressDetermineWrap}><View style={rowData.isDefault==1?styles.defaultAddressDetermine:styles.NOdefaultAddressDetermine}><Text style={rowData.isDefault==1?styles.defaultAddressDetermine:styles.NOdefaultAddressDetermine}></Text></View></View><Text style={styles.defaultAddressDetermineText}>设为默认</Text>
                      </TouchableOpacity>
                    </View> 
                  }
              />
            </ScrollView>
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
