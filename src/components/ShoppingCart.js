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
  AsyncStorage,
  DeviceEventEmitter
} from 'react-native';
import Cookie from 'react-native-cookie';
import Spinner from 'react-native-loading-spinner-overlay';
import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;
function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}
class Goods extends Component{
  constructor(props) {
    super(props);
    // console.disableYellowBox = true;
    var type1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.shoppingCart(this)
    this.state={dataSource:type1.cloneWithRows([]),isSelectedAll:false,totalPrice:'',totalNum:'',visible: false}
  }
  //购物车初始化
  shoppingCart(That) { 
    var type1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    Cookie.get(global.url).then((cookie) => {
      //用户存在的话从后台获取
      if(cookie&&!!cookie.userId){
        fetch(global.url + '/API/MyCart/getShopCartList', 'post', '', (responseData) => {
          console.log(responseData)
          let goods = []
          let res = responseData.data.shopCartListDt
          let isSelectedAll = false
          let num = 0
          for( let i = 0; i < res.length; i++){
            let selected = false
            if(res[i].isChecked){
                selected = true
                num++
            }
            goods.push({
              id: res[i].id,
              img: res[i].goodImg.split('|')[0],
              name: res[i].goodName,
              num: res[i].count,
              selected: selected,
              price: res[i].price,
              specId: res[i].goodSpecId,
              specifications:res[i].goodspecifications
            })
          }
          if (num==res.length) {
            isSelectedAll = true
          }
          let viewNum=1
          if (goods.length==0) { 
            viewNum = 0
          }
          
          //数量等于0是显示不同的视图
          That.setState({dataSource:type1.cloneWithRows(goods),isSelectedAll,viewNum})
          That.total()
        },(error)=>{
          Alert.alert(error+'')    
        }) 
      } else {
        //用户不存在查看本地存储物品
        global.storage.load({
          key: 'goods',
          // syncInBackground(默认为true)意味着如果数据过期，
          // 在调用sync方法的同时先返回已经过期的数据。
          // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
          syncInBackground: true,
          // 你还可以给sync方法传递额外的参数
          syncParams: {
            extraFetchOptions: {
            // 各种参数
            },
            someFlag: true,
          },
        }).then(ret => {
          let goods =[]
          for( let i = 0; i < ret.length; i++){
            goods.push({
              id: ret[i].id,
              img: ret[i].img,
              name: ret[i].goodName,
              num: ret[i].count,
              selected: true,
              price: ret[i].price,
              specifications: ret[i].goodspecifications
            })
          }
          let viewNum=1
          if (goods.length==0) { 
            viewNum = 0
          }
          That.setState({dataSource:type1.cloneWithRows(goods),isSelectedAll:true,viewNum})
          That.total()
          }).catch(err => {
          That.setState({viewNum:0})
          switch (err.name) {
            case 'NotFoundError':
              // TODO;
              break;
            case 'ExpiredError':
                // TODO
                break;
          }
        })
      }
    });
  }
  //商品总价和数量
  total(){
    let newTotalPrice=0
    let newTotalNum=0
    global.goods=[]
    for (let i = 0;i < this.state.dataSource._dataBlob.s1.length;i++) {
      if(this.state.dataSource._dataBlob.s1[i].selected){
        let price= this.state.dataSource._dataBlob.s1[i].price*this.state.dataSource._dataBlob.s1[i].num
        let num= this.state.dataSource._dataBlob.s1[i].num
        newTotalPrice+=price;
        newTotalNum+=Number(num)
        global.goods.push({goodSpecId:this.state.dataSource._dataBlob.s1[i].specId,count:num})
      }
    }
    this.setState({totalPrice:newTotalPrice.toFixed(2),totalNum:newTotalNum})
  }
  //商品总数量
  goodsTotalNum(goods){
    let num=0
    for(let i=0;i<goods.length;i++){
      num+=goods[i].num
    }
    return num
  }
  //查看props是否改变
  componentWillReceiveProps() { 
    this.shoppingCart(this)
  }
  //点击商品是否选中
  isSelectedFn(selected) { 
    this.state.dataSource._dataBlob.s1[selected].selected=!this.state.dataSource._dataBlob.s1[selected].selected
    let newDataSource = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
    this.setState({dataSource: this.state.dataSource.cloneWithRows(newDataSource)})
    this.total()
    let isChecked=0
    if(this.state.dataSource._dataBlob.s1[selected].selected){
      isChecked=1
    }
    let params={
      id:this.state.dataSource._dataBlob.s1[selected].id,
      isChecked:isChecked
    }
    fetch(global.url + '/API/MyCart/check', 'post', params, (responseData) => {
      console.log('选中成功')
    }, (err)=>{ 
      Alert.alert('选中失败')
    })
    let num=0 
    for (let i=0;i<this.state.dataSource._dataBlob.s1.length;i++) {
      if (!this.state.dataSource._dataBlob.s1[i].selected) {
        num++
      }
    }
    if (num===0) {
      this.state.isSelectedAll=true
    }else{
      this.state.isSelectedAll=false
    }
  }
  render(){
    const { navigate, goBack} = this.props.navigation;
      return(
        <View style={{ height: '100%' }}>
        <Spinner visible={this.state.visible}  color="#e6e6e6"  />    
          <ImageBackground style={styles.header} source={require('../images/header.jpg')}>
            <Text style={styles.headerText}>购物车</Text>
          </ImageBackground>
          {this.state.viewNum === 0 ?
            <View style={styles.shoppingCartIsNullWrap}>
              <View >  
                <Image style={styles.shoppingCartIsNull} source={require('../images/shoppingCartIsNull.png')}></Image>
              </View>
              <View>
                <Text style={styles.title}>购物车竟然是空的</Text>
              </View>
              <View>
                <Text style={styles.prompt}>再忙，也要买点什么犒赏自己</Text>
              </View>
            </View> :
            <ScrollView contentContainerStyle={styles.scrollView}>
              <ListView
                contentContainerStyle={styles.List}
                dataSource={this.state.dataSource}
                renderRow={(rowData, index, selected) =>
                  <View style={styles.listItem}>
                    <TouchableOpacity style={styles.listItemSelectedWrap} onPress={
                      () => { this.isSelectedFn(selected) }
                    }>
                      <View style={rowData.selected ? styles.listItemSelectedActive : styles.listItemSelected}>
                        <Image style={styles.listItemSelectedImg} source={require('../images/determine.png')}></Image>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.listGoodWrap}>
                      <Image style={styles.listGood} source={{ uri: rowData.img }}></Image>
                    </View>
                    <View style={styles.listGoodDetails}>
                      <View>
                        <Text style={styles.listGoodDetailsName} numberOfLines={2}>{rowData.name}</Text>
                      </View>
                      <View>
                        <Text style={styles.listGoodDetailsSpecifications} numberOfLines={1}>规格：{rowData.specifications}</Text>
                      </View>
                      <View style={styles.listGoodDetailsPrice}>
                        <View style={styles.listGoodDetailsPriceWrap}><Text style={styles.listGoodDetailsPriceWrapSymbol}>¥</Text><Text style={styles.listGoodDetailsPriceWrapText}>{rowData.price}</Text></View>
                        <View style={styles.listGoodDetailsFunction}>
                          <TouchableOpacity style={styles.listGoodDetailsFunctionMinusSign} onPress={
                            () => {
                              this.setState({visible: true})
                              Cookie.get(global.url).then((cookie) => {
                                if (!cookie || !cookie.userId) {
                                  this.setState({visible: false})
                                  let params = {
                                    id: this.state.dataSource._dataBlob.s1[selected].id
                                  }
                                  //修改产品数量
                                  this.state.dataSource._dataBlob.s1[selected].num--
                                  //数量到最后删除
                                  if (this.state.dataSource._dataBlob.s1[selected].num == 0) {
                                    this.state.dataSource._dataBlob.s1.splice(selected, 1)
                                  }
                                  let newDataSource = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
                                  this.setState({ dataSource: this.state.dataSource.cloneWithRows(newDataSource) })
                                  let num = this.goodsTotalNum(this.state.dataSource._dataBlob.s1)
                                  //总数量通知给app.js
                                  DeviceEventEmitter.emit('num', num)
                                  //为了统一用count
                                  for (let i = 0; i < newDataSource.length; i++) {
                                    newDataSource[i].count = newDataSource[i].num
                                  }
                                  this.total()
                                  global.storage.save({
                                    key: 'goods',  // 注意:请不要在key中使用_下划线符号!
                                    data: newDataSource
                                  });
                                } else {
                                  let params = {
                                    id: this.state.dataSource._dataBlob.s1[selected].id
                                  }
                                  fetch(global.url + '/API/MyCart/reduce', 'post', params, (responseData) => {
                                    if (responseData.success) {
                                      this.state.dataSource._dataBlob.s1[selected].num--
                                      let num = this.goodsTotalNum(this.state.dataSource._dataBlob.s1)
                                      DeviceEventEmitter.emit('num', num)
                                      if (this.state.dataSource._dataBlob.s1[selected].num == 0) {
                                        this.state.dataSource._dataBlob.s1.splice(selected, 1)
                                      }
                                      let newDataSource = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
                                      this.setState({ dataSource: this.state.dataSource.cloneWithRows(newDataSource) }, () => { 
                                        this.setState({visible: false})
                                      })
                                      this.total()
                                    }
                                  })
                                }
                              }
                              )
                            }
                          }>
                            <View style={styles.listGoodDetailsFunctionMinusSignWrap}>
                              <Image style={styles.listGoodDetailsMinusSign} source={require('../images/minusSign.png')}></Image>
                            </View>
                          </TouchableOpacity>
                          <Text style={styles.listGoodDetailsNumberText}>{rowData.num}</Text>
                          <TouchableOpacity style={styles.listGoodDetailsNumberFunctionAdd} onPress={
                            () => {
                              this.setState({ visible: true })
                              Cookie.get(global.url).then((cookie) => {
                                //未登录情况
                                if (!cookie || !cookie.userId) {
                                      this.setState({visible: false})
                                  let params = {
                                    id: this.state.dataSource._dataBlob.s1[selected].id
                                  }
                                  //添加产品
                                  this.state.dataSource._dataBlob.s1[selected].num++
                                  let newDataSource = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
                                  this.setState({ dataSource: this.state.dataSource.cloneWithRows(newDataSource) })
                                  let num = this.goodsTotalNum(this.state.dataSource._dataBlob.s1)
                                  //传给app.js总数量
                                  DeviceEventEmitter.emit('num', num)
                                  //为了统一我每个产品的数量用count
                                  for (let i = 0; i < newDataSource.length; i++) {
                                    newDataSource[i].count = newDataSource[i].num
                                  }
                                  
                                  this.total()
                                  global.storage.save({
                                    key: 'goods',  // 注意:请不要在key中使用_下划线符号!
                                    data: newDataSource
                                  });
                                } else {
                                  let params = {
                                    id: this.state.dataSource._dataBlob.s1[selected].id
                                  }
                                  fetch(global.url + '/API/MyCart/plus', 'post', params, (responseData) => {
                                    if (responseData.success) {
                                      this.state.dataSource._dataBlob.s1[selected].num++
                                      let num = this.goodsTotalNum(this.state.dataSource._dataBlob.s1)
                                      DeviceEventEmitter.emit('num', num)
                                      let newDataSource = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
                                      this.setState({ dataSource: this.state.dataSource.cloneWithRows(newDataSource),visible: false })
                                      this.total()
                                    }
                                  })
                                }
                              }
                              )
                             
                              
                            }
                          }>
                            <View style={styles.listGoodDetailsNumberAddWrap}>
                              <Image style={styles.listGoodDetailsNumberAdd} source={require('../images/add1.png')}></Image>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                }
              />
            </ScrollView>
          }
            <View style={styles.settlement}>
              <TouchableOpacity style={styles.listItemSelectedWrap,{marginLeft:pxToDp(26)}} onPress={
                            ()=>{
                              this.state.isSelectedAll=!this.state.isSelectedAll
                              for(let i = 0;i<this.state.dataSource._dataBlob.s1.length;i++){
                                  this.state.dataSource._dataBlob.s1[i].selected = this.state.isSelectedAll 
                              }
                              let isChecked=0;
                              if(this.state.isSelectedAll){
                                isChecked=1
                              }
                              fetch(global.url+'/API/MyCart/checkAll','post',{isChecked:isChecked},(responseData)=>{

                              })
                              let newDataSource = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
                              this.setState({dataSource: this.state.dataSource.cloneWithRows(newDataSource)})
                              this.total()
                            }
                          }>
                <View style={this.state.isSelectedAll?styles.listItemSelectedActive:styles.listItemSelected}>
                   <Image style={styles.listItemSelectedImg} source={require('../images/determine.png')}></Image>
                </View>
              </TouchableOpacity>
              <Text style={styles.listItemSelectedText}>全选</Text>
              <View style={styles.total}>
                <Text style={styles.totalText}>合计：</Text><Text style={styles.totalSymble}>¥</Text><Text style={styles.totalPrice}>{this.state.totalPrice?this.state.totalPrice:'00'}</Text><TouchableOpacity style={this.state.totalNum?styles.totalBtn:styles.totalBtn1} disabled={this.state.totalNum?false:true} onPress={() => {
                  Cookie.get(global.url).then((cookie) => {
                    if(cookie&&!!cookie.userId){
                      navigate('Order')
                    } else {
                      global.navigate='Goods'
                      navigate('Login')
                    }
                  })}}><Text style={styles.totalBtnText} >结算({this.state.totalNum?this.state.totalNum:'0'})</Text></TouchableOpacity>
              </View>
            </View>
           </View> 
        );
    }
}
const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS==='android'?pxToDp(0):pxToDp(40),
    backgroundColor: 'white',
    height: Platform.OS==='android'?pxToDp(90):pxToDp(130),
    flexDirection: 'row',
    alignItems: "center",
    borderBottomWidth: pxToDp(1),
    borderBottomColor:'#daddde',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerBack: {
    marginLeft: pxToDp(26),
    marginRight: pxToDp(26),
    width: pxToDp(23),
    height: pxToDp(40),
  },
  headerText: {
    fontSize: pxToDp(36),
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  scrollView: {
    marginTop: pxToDp(18),
    paddingBottom: pxToDp(120) 
  }, 
  List:{
    backgroundColor:'white'
  },
  listItem: {
    flexDirection: 'row',
    alignItems:"center",
    marginLeft: pxToDp(26),
    paddingTop: pxToDp(26),
    paddingBottom: pxToDp(26),
    borderBottomWidth: pxToDp(1),
    borderBottomColor: '#daddde'
  },
  listItemSelected: {
    marginRight: pxToDp(33),
    width: pxToDp(44),
    height: pxToDp(44),
    borderWidth: pxToDp(1),
    borderColor: '#a8a8a8',
    borderRadius:100,
    justifyContent:'center',
    alignItems:"center"
  },
  listItemSelectedWrap:{
    paddingTop:pxToDp(20),
    paddingBottom:pxToDp(20)
  },
  listItemSelectedActive:{
    marginRight: pxToDp(33),
    width: pxToDp(44),
    height: pxToDp(44),
    borderRadius:100,
    borderWidth: pxToDp(1),
    borderColor: '#ff8e00',
    justifyContent:'center',
    alignItems:"center",
    backgroundColor:'#ff8e00'
  },
  listItemSelectedImg: {
    width: pxToDp(30),
    height: pxToDp(20)
  },
  listGoodWrap: {
    marginRight: pxToDp(24),
    width: pxToDp(194),
    height: pxToDp(194),
    borderWidth: pxToDp(1),
    borderColor: '#daddde',
    borderRadius: 5,
    overflow:'hidden' 
  },
  listGood: {
    width: '100%',
    height: '100%'
  },
  listGoodDetails: {
    paddingTop: pxToDp(34),
    paddingBottom: pxToDp(34),
  },
  listGoodDetailsName: {
    fontSize: pxToDp(28),
    color: "#2b2b2b",
    width: pxToDp(406)
  },
  listGoodDetailsSpecifications: {
    fontSize: pxToDp(24),
    color: '#a2a2a2',
    width: pxToDp(272),
    marginTop: pxToDp(20),
    marginBottom: pxToDp(24)
  },
  listGoodDetailsPrice: {
    flexDirection: 'row',
    position:'relative'
  },
  listGoodDetailsPriceWrap: {
    flexDirection: 'row'
  },
  listGoodDetailsPriceWrapSymbol: {
    fontSize: pxToDp(28),
    color:'#ff3f00',
    marginTop: pxToDp(8)
  },
  listGoodDetailsPriceWrapText: {
    fontSize: pxToDp(36),
    color: '#ff3f00',
  },
  listGoodDetailsFunction: {
    flexDirection: 'row',
    position: 'absolute',
    right: pxToDp(0) 
  },
  listGoodDetailsFunctionMinusSign:{
    width: pxToDp(60),
    height: pxToDp(60),
  },
  listGoodDetailsFunctionMinusSignWrap: {
    marginLeft: pxToDp(20),
    width: pxToDp(40),
    height: pxToDp(40),
    borderWidth: pxToDp(1),
    borderColor: '#dadbde',
    borderRadius: 100,
    // textAlign: 'center',
    justifyContent:'center',
    alignItems:"center",
  },
  listGoodDetailsMinusSign: {
    width: pxToDp(21),
    height: pxToDp(6),
  },
  listGoodDetailsNumberText: {
    width: pxToDp(60),
    height: pxToDp(40),
    fontSize: pxToDp(28),
    color: '#2b2b2b',
    textAlign: 'center',
  },
  listGoodDetailsNumberFunctionAdd: {
    width: pxToDp(60),
    height: pxToDp(60),
  },
  listGoodDetailsNumberAddWrap: {
    width: pxToDp(40),
    height: pxToDp(40),
    borderWidth: pxToDp(1),
    borderColor: '#ff8e00',
    borderRadius: 100,
    // textAlign: 'center',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#ff8e00'
  },
  listGoodDetailsNumberAdd: {
    width: pxToDp(21),
    height: pxToDp(21)
  },
  settlement: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: pxToDp(104),
      backgroundColor: "white",
      alignItems: "center"
  },
  listItemSelectedText: {
    fontSize: pxToDp(28),
    color: '#a2a2a2'
  },
  total: {
    flexDirection:'row',
    position:'absolute',
    right:0,
  },
  totalText: {
    marginTop: pxToDp(40),
    fontSize: pxToDp(28),
    color: '#a2a2a2',
  },
  totalSymble: {
    color: '#ff3f00',
    fontSize: pxToDp(28),
    marginTop: pxToDp(40)
  },
  totalPrice: {
    marginRight: pxToDp(30),
    marginTop: pxToDp(36),
    color: '#ff3f00',
    fontSize: pxToDp(30),
  },
  totalBtn: {
    width: pxToDp(215),
    height: pxToDp(105),
    // textAlign: 'center',
    // textAlignVertical: 'center',
    backgroundColor:'#ff8e00',
    alignItems: 'center',
    justifyContent: 'center',
    // color:'white'
  },
  totalBtn1: {
    width: pxToDp(215),
    height: pxToDp(105),
    // textAlign: 'center',
    // textAlignVertical: 'center',
    backgroundColor:'#a2a2a2',
    alignItems: 'center',
    justifyContent: 'center',
    // color:'white'
  },
  totalBtnText: {
    color: 'white'
  },
  shoppingCartIsNullWrap: {
    marginTop: pxToDp(90),
    alignItems: 'center',
  },
  shoppingCartIsNull: {
    width: pxToDp(350),
    height: pxToDp(300),
  },
  title: {
    marginTop: pxToDp(30),
    fontSize: pxToDp(30)
  },
  prompt: {
    marginTop: pxToDp(10),
    fontSize: pxToDp(20)
  },
  shoppingBtn: {
    width: pxToDp(196),
    height: pxToDp(60),
    borderWidth: pxToDp(1),
    borderColor: '#909090',
    justifyContent: 'center',
    borderRadius: pxToDp(10), 
    alignItems: 'center',
    marginTop: pxToDp(30)
  },
  shoppingBtnText: {
    fontSize: pxToDp(30)
  }
});
module.exports=Goods 