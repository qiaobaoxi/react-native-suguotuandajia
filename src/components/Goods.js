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
import React, { Component,PureComponent } from 'react';
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
  RefreshControl,
  SectionList,
  FlatList,
  DeviceEventEmitter
} from 'react-native';
import CookieManager from 'react-native-cookies';
import Spinner from 'react-native-loading-spinner-overlay';
import Cookie from 'react-native-cookie';
import fetch from '../js/fetch'
import { constants } from 'react-native-camera';
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;


const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}
global.back='Goods'
class Goods extends PureComponent{
  constructor(props) {
    super(props);
    // console.disableYellowBox = true;
    let url = global.url+"/API/home/getGoodsList"
    const { params } = this.props.navigation.state;
    //参数必传
    if (typeof params != 'object') {
      Alert.alert('参数出错')
      return
    }
    this.subscription = DeviceEventEmitter.addListener('goodNum', (num) => {
      this.getGoodsList('goBack')
    })
    let keyword=''
    if (params && !!params.goodname) {
      keyword = params.goodname
    }
    let params1 = {addressLabel:"00060001",categoryId:0,keyword:keyword,loadAll:false,pageIndex:0}
    this.state = {
      dataSource: [],
      modalVisible: false,
      num: 1,
      url,params1,
      goods: [],
      isLoad: false,
      getNum: params.getNum,
      goodname: keyword,
      length: 1,
      indexSeach: keyword,
      visible: false
    }
    //初始加载
    this.getGoodsList('init')
  }
  //加载产品信息
  getGoodsList(type) {
    if (type === 'goBack') { 
      this.isCookies()
      return
    }
    //加载分页数据
    fetch(this.state.url, 'post', this.state.params1, (responseData) => {
      if (responseData.data.goods.length == 0 && type === 'init') {
        this.setState({ length:0})
        return
      }
      if (responseData.data.goods.length == 0 && type === 'page' && this.state.isLoad) {
        this.setState({ isLoad: false,params1:this.state.params2})
        return
      }
      if (responseData.data.goods.length == 0 && type === 'search') {
        this.setState({ length:0 })
        return
      }
      for(var i=0;i<responseData.data.goods.length;i++){
        var good=responseData.data.goods[i]
        let specs=''
        if (good.specs.length>1) {
          specs = '多规格'
        } else {
          specs = good.specs[0].spec
        }
        let specsId = ''
        if (good.specs.length==1) {
          specsId = good.specs[0].id
        } 
        let num=0
        this.state.goods.push({id: good.id,
          img: good.goodImg.split('|')[0],
          name: good.goodName,
          price: good.price,
          specs: specs,
          specsId: specsId,
          num: num})
      }
      let length=1
      if (this.state.goods.length === 0) { 
        length=0
      }
      this.setState({dataSource : this.state.goods,isLoad : false,isNextSuccess : 1,length: length,indexSeach:this.state.params1.keyword });
      this.isCookies()
    })
  }
  //cookie是否存在存在从后台取购物车数据没有从本地存储取数据
  isCookies() {
    Cookie.get(global.url).then((cookie) => {
          if (cookie && !!cookie.userId) {
            fetch(global.url+'/API/MyCart/getShopCartList','post','',(responseData)=>{
              if (responseData.success) {
                let totalPrice = 0
                let cartNum = 0
                global.goods = []
                for(let i = 0;i < responseData.data.shopCartListDt.length;i++){
                  totalPrice += responseData.data.shopCartListDt[i].price*responseData.data.shopCartListDt[i].count
                  cartNum += responseData.data.shopCartListDt[i].count
                  global.goods.push({goodSpecId:responseData.data.shopCartListDt[i].goodSpecId,count:responseData.data.shopCartListDt[i].count,goodId:responseData.data.shopCartListDt[i].goodId})
                }
                DeviceEventEmitter.emit('num', cartNum);
                  for(let i=0;i<this.state.goods.length;i++){
                    for (j = 0; j < global.goods.length; j++){
                      if(this.state.goods[i].id==global.goods[j].goodId){
                        this.state.goods[i].num=1
                        this.setState({dataSource:this.state.goods})
                      }
                    }
                  }
                  totalPrice = totalPrice.toFixed(2)
                  this.setState({cartNum,totalPrice});
              }else{
                Alert.alert(JSON.stringify(global.storageGoods))
              }
            })
          }else{
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
              let data=ret
              let num=0
              let totalPrice=0
              setTimeout(() => {
                if (!global.goods) { 
                  global.goods = [];
                }
                for(let i=0;i<this.state.goods.length;i++){
                  for (j = 0; j < data.length; j++){
                    if (this.state.goods[i].id == data[j].id) {
                      global.goods.push({ count:data[j].count, goodId:data[j].id, goodSpecId:data[j].goodspecifications })
                      this.state.goods[i].num = 1;
                      this.setState({ dataSource: this.state.goods });
                    }
                  }
                }
              },500)
              for(let i=0;i<data.length;i++){
                num+=Number(data[i].count)
                let price=data[i].count*data[i].price
                totalPrice+=price
              }
              totalPrice=totalPrice.toFixed(2)
              this.setState({totalPrice: totalPrice,cartNum: num})
            }).catch(err => {
              console.warn(err.message);
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
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  _renderRow(data,index) {
    return (
      <View style={styles.goods}>
        <Image style={styles.goodsImg} resizeMode={'stretch'} source={{uri:data.img}}></Image>
        <View><Text style={styles.goodsName} numberOfLines={1}>{data.name}</Text></View>
        <View><Text style={styles.goodsSpecifications} numberOfLines={1}>规格：{data.specs}</Text></View>
        <View style={styles.goodsPriceWrap}>
          <Text style={styles.goodsPriceSymbol}>¥</Text><Text style={styles.goodsPriceNumber}>{data.price}</Text>
          <TouchableOpacity onPress={() => {
            //点击是显示load加载
            this.setState({ visible: true})
            for (i=0;i<this.state.dataSource.length;i++) {
              if (i==index) {
                let good=this.state.dataSource[i]
                let params={
                  id: good.id,
                  count: 1,
                  img: good.img,
                  goodName: good.name,
                  goodspecifications: good.specsId,
                  price: good.price
                }
                Cookie.get(global.url).then((cookie) => {
                  if (!!cookie && !!cookie.userId) {
                    fetch(global.url+'/API/ProductDetail/joinCart','post',params,(responseData)=>{
                      if (responseData.success) {
                        // this.getGoodsList("add")
                        //数据好了加载load取消
                        let index1 = -1
                        for (let i = 0; i < global.goods.length; i++) {
                          if (global.goods[i].goodId === params.id) {
                            index1 = i
                          }
                        }
                        if (index1 >= 0) {
                          global.goods[index1].count+=1
                        } else { 
                          global.goods.push({goodSpecId:params.goodspecifications,count:params.count,goodId:params.id})
                        }
                        this.state.dataSource[index].num=1
                        let cartNum = ++this.state.cartNum
                        DeviceEventEmitter.emit('num', cartNum);
                        this.state.totalPrice=this.state.dataSource[index].price+parseFloat(this.state.totalPrice)
                        let totalPrice=this.state.totalPrice.toFixed(2)
                        this.setState({cartNum,totalPrice,dataSource:this.state.dataSource,goods:this.state.dataSource,num:responseData.cartNum,visible: false})
                     }
                    }, (err) => { 
                      console.log(err)
                    })
                    this.state.getNum()
                  } else {
                    //数据好了加载load取消
                    if (!global.goods) { 
                       global.goods=[]
                    }
                    this.state.dataSource[index].num=1
                    this.setState({dataSource:this.state.dataSource})
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
                      if (!global.goods) { 
                        global.goods = []
                      }
                        let data=[]
                        let index=-1
                        for (let i = 0;i < ret.length;i++) {
                          if (ret[i].id == params.id) {
                            index = i
                          }
                        }
                        if (index>=0) {
                          ret[index].count++
                          ret[index].img=params.img
                          data=ret
                        } else {
                          data = ret
                          global.goods.push({goodSpecId:params.goodspecifications,count:params.count,goodId:params.id,})
                          data.push(params)
                        }
                        let num=0
                        let totalPrice=0
                        for (let i=0;i<data.length;i++) {
                          num+=Number(data[i].count)
                          let price=data[i].count*data[i].price
                          totalPrice+=price
                        }
                        DeviceEventEmitter.emit('num', num);
                        totalPrice=totalPrice.toFixed(2)
                        this.setState({totalPrice: totalPrice,cartNum: num,visible: false})
                        global.storage.save({
                          key: 'goods',  // 注意:请不要在key中使用_下划线符号!
                          data: data
                        });
                      }).catch(err => {
                        console.warn(err.message);
                      })
                      let That=this
                      global.storage.sync = {
                        goods() {
                          //数据好了加载load取消
                          let data=[]
                          let num=0
                          let totalPrice = 0
                          if (!global.goods) { 
                            global.goods=[]
                          }
                          global.goods.push({goodSpecId:params.goodspecifications,count:params.count,goodId:params.id,}) 
                          data.push(params)
                          totalPrice += params.price
                          num += Number(params.count)
                          DeviceEventEmitter.emit('num', num);
                          That.setState({totalPrice: totalPrice, cartNum: num,visible: false})
                          // this.setState({totalPrice: params.price,cartNum: params.count})
                          global.storage.save({
                            key: 'goods',  // 注意:请不要在key中使用_下划线符号!
                            data: data
                          });
                        }
                      }
                                //     this.getGoodsList()
                    }
                  });
                }
              }
              var newData = JSON.parse(JSON.stringify(this.state.dataSource));
              this.setState({dataSource:newData})
            }} style={data.num===0?styles.goodsPriceAdd:styles.goodsPriceAddActive}><Image style={styles.goodsPriceAddImg} resizeMode={'stretch'} source={data.num===0?require('../images/add.png'):require('../images/add1.png')}></Image></TouchableOpacity>
          </View>
        </View>
      );
  }
  //分页
  _contentViewScroll(e: Object) {
    if(this.state.dataSource.length>0&&this.state.isNextSuccess!=0){
      clearTimeout(this.state.timer)
      this.setState({isLoad:true,params2:this.state.params1})
      this.state.timer = setTimeout(() => {
        this.state.params1.pageIndex++
        this.setState({params1:this.state.params1,isNextSuccess:0})
        this.getGoodsList('page')
      },1000)
    }
  }
  _onPressSearch() {
    this.state.params1.keyword = this.state.goodname
    this.state.params1.pageIndex=0
    this.setState({ params1: this.state.params1, goods: [] })
    this.getGoodsList('search')
  }
    render(){
      const { navigate, goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return(
          <View style={{ height: '100%' }}>
            <Spinner visible={this.state.visible} color="#e6e6e6"  />
              <ImageBackground style={styles.search} source={require('../images/headerBg.jpg')}>
              <TouchableOpacity style={{ height: '100%', justifyContent: "center" }} onPress={() => {
                if (global.isSearch) { 
                  params.Back()
                }
                goBack()
              }}>
                  <Image style={styles.searchBack} source={require('../images/back1.png')}></Image>
                </TouchableOpacity>
                <TextInput
                    onChangeText={(text) => {
                      this.setState({goodname:text})
                    }}
                    defaultValue={this.state.indexSeach} 
                    keyboardType={"search"}
                    onEndEditing={this._onPressSearch.bind(this)}
                    style={styles.searchInput}
                    underlineColorAndroid={'transparent'}
                    placeholder={'输入关键字直接搜索'}
                    placeholderTextColor={'#a6a6a6'}
                 />
                <TouchableOpacity  style={{height:'100%',width: pxToDp(50),justifyContent:"center",position: 'relative',zIndex: 100,left: pxToDp(-80)}} onPress={this._onPressSearch.bind(this)}>
                  <Image style={styles.searchImg} source={require('../images/search.png')}></Image>
                </TouchableOpacity>
              </ImageBackground>
                {
                  this.state.length === 0 ?
                  <View style={styles.noFindWrap}>
                    <View>
                      <Image style={styles.noFindImg} source={require('../images/seachGoods.png')}></Image>
                    </View>
                    <View>
                      <Text style={styles.noFindTitle}>没有找到搜索结果</Text>
                    </View>
                    <View>
                      <Text>换个关键字再搜一遍</Text>
                    </View>  
                  </View> :
                  <FlatList
                    contentContainerStyle={styles.listWrap}
                    horizontal={false}
                    numColumns={2}
                    refreshing={true}
                    removeClippedSubviews={false}
                    data={this.state.dataSource}
                    extraData={this.state}
                    renderItem={({ item, index }) => this._renderRow(item, index)}
                    ListFooterComponent={() => <View style={this.state.isLoad ? styles.more : styles.hidden}><Text style={styles.moreText}>加载中</Text></View>}
                    onEndReached={this._contentViewScroll.bind(this)}
                    onEndReachedThreshold={0.1}
                    getItemLayout={(data, index) => ({ length: pxToDp(550), offset: pxToDp(550) * index, index })}
                  />
                }
               {this.state.dataSource.length!=0?<View style={styles.settlementColumn}>
                  <TouchableOpacity style={styles.shoppingCartWrap} onPress={() => navigate('Home',{page: 'shoppingCart'})} ><Image style={styles.shoppingCart} source={require('../images/goodsIncart.png')}></Image></TouchableOpacity>
                  <View style={this.state.cartNum<100?styles.badgeWrap:styles.badgeWrap1}><Text style={styles.badge}>{this.state.cartNum?this.state.cartNum:0}</Text></View>
                  <View style={styles.goPayWrap}>
                    <Text style={styles.goPayTotalPrice}>合计：</Text><Text style={styles.goPayTotalPriceSymbol}>¥</Text><Text style={styles.totalPrice}>{this.state.totalPrice?this.state.totalPrice:0}</Text><TouchableOpacity style={this.state.totalPrice>1?styles.settlement:styles.settlement1} disabled={this.state.totalPrice>1?false:true} onPress={() => 
                      Cookie.get(global.url).then((cookie) => {
                    if (cookie && !!cookie.userId) {
                          navigate('Order')
                    } else {
                          //存储跳转的位置
                          global.navigate = "Goods"
                          global.keyword=this.state.goodname
                          navigate('Login')
                         }
                      })
                      }><Text style={{color: 'white',}}>去结算</Text></TouchableOpacity>
                  </View>
               </View>:null}
               <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {alert("Modal has been closed.")}}
                  >
                 <View style={styles.opacity}>
                  <View style={{paddingTop: pxToDp(50),position: "absolute",bottom:0,width:'100%'}}>
                    <View style={styles.modelImgWrap}>
                          <Image style={styles.modelImg} source={require('../images/modelGood.jpg')}></Image> 
                    </View> 
                    <View style={{backgroundColor:'rgba(255, 255, 255, 1)'}}>
                       <View style={styles.modelHeader}>
                           <View style={styles.priceWrap} >
                              <Text style={styles.price}>¥ 49.00</Text>
                              <Text style={styles.specifications}>已选：S码</Text>
                           </View>
                           <TouchableOpacity style={styles.modelClose}>
                             <Image style={styles.modelCloseImg} source={require('../images/close.png')}></Image>
                           </TouchableOpacity>
                       </View>
                       <View style={styles.selectionSpecification}>
                            <View ><Text style={styles.selectionSpecificationText}>规格</Text></View>
                            <ListView
                                contentContainerStyle={styles.selectionSpecificationList}
                                dataSource={this.state.specification}
                                renderRow={(rowData,index,selected) => <TouchableOpacity onPress={
                                  ()=>{
                                    for(let i=0;i<this.state.specification._dataBlob.s1.length;i++){
                                        if(i==selected){
                                            this.state.specification._dataBlob.s1[i].selected=true
                                        }else{
                                            this.state.specification._dataBlob.s1[i].selected=false
                                        }
                                    }
                                    let newSpecification=JSON.parse(JSON.stringify(this.state.specification._dataBlob.s1))
                                    this.setState({specification:this.state.dataSource.cloneWithRows(newSpecification)})
                                  }
                                }><Text style={rowData.selected?styles.selectionSpecificationListTextActive:styles.selectionSpecificationListText}>{rowData.code}</Text></TouchableOpacity>}
                            />
                       </View>
                       <View style={styles.specificationNumber}>
                         <Text style={styles.specificationNumberTitle}>数量</Text>
                         <View style={styles.specificationNumberFunction}>
                          <TouchableOpacity style={styles.specificationNumberFunctionMinusSign} onPress={
                            ()=>{
                               if(this.state.num > 1){
                                  let newNum=this.state.num-1
                                  this.setState({num:newNum})
                               }
                            }
                          }>
                           <View style={styles.specificationNumberMinusSignWrap}>
                            <Image style={styles.specificationMinusSign} source={require('../images/minusSign.png')}></Image>
                           </View> 
                          </TouchableOpacity>
                          <Text style={styles.specificationNumberText}>{this.state.num}</Text>
                          <TouchableOpacity style={styles.specificationNumberFunctionAdd} onPress={
                            ()=>{
                               let newNum=this.state.num+1
                               this.setState({num:newNum})
                            }
                          }>
                           <View style={styles.specificationNumberAddWrap}>
                            <Image style={styles.specificationNumberAdd} source={require('../images/add1.png')}></Image>
                           </View> 
                          </TouchableOpacity>
                         </View>
                       </View>
                       <TouchableOpacity >
                         <View><Text style={styles.modelBtn}>加入购物车</Text></View>
                       </TouchableOpacity>
                    </View>
                   </View>
                 </View>
                </Modal>
            </View> 
        );
    }
}
const styles = StyleSheet.create({
    search: {
      flexDirection :'row',
      alignItems: "center",
      height: Platform.OS==='android'?pxToDp(100):pxToDp(130),
      paddingTop: 0,
      borderWidth: pxToDp(1),
      borderBottomColor: '#daddde',
      backgroundColor: 'white',
      position:'relative'
    },
    searchBack: {
      marginLeft: pxToDp(26),
      marginRight: pxToDp(26),
      width: pxToDp(30),
      height: pxToDp(33),
    },
    searchInput: {
      padding: 0,
      paddingLeft: pxToDp(38),
      width:  Platform.OS==='android'?pxToDp(652):pxToDp(652),
      height: pxToDp(54),
      backgroundColor:"#eeeeee",
      borderRadius:pxToDp(38)
    },
    searchImg: {
      position:'absolute',
      right: pxToDp(0),
      zIndex: 100,
      width: pxToDp(34),
      height: pxToDp(34),
    },
    listWrap:{
      // flexDirection:'row',
      // flexWrap:'wrap',
      paddingBottom: pxToDp(100),
    },
    goods:{
      marginTop: pxToDp(10),
      width: pxToDp(360),
      backgroundColor: 'white',
      height: pxToDp(540),
      marginLeft: pxToDp(9),
      marginRight: pxToDp(4)
    },
    goodsImg:{
      width: '100%',
      height: pxToDp(386)
    },
    goodsName: {
       marginLeft: pxToDp(20),
       marginRight: pxToDp(20),
       marginBottom:pxToDp(18)
    },
    goodsSpecifications: {
       fontSize:pxToDp(24),
       marginLeft:pxToDp(24),
       color:'#a2a2a2'
    },
    goodsPriceWrap: {
      position:'relative',
      marginBottom: pxToDp(22),
      marginRight: pxToDp(5),
      flexDirection: 'row',
      alignItems:"center"
    },
    goodsPriceSymbol: {
      marginLeft: pxToDp(20),
      marginTop: pxToDp(5),
      fontSize: pxToDp(26),
      color:'#ff3f00',
    },
    goodsPriceNumber: {
      fontSize: pxToDp(36),
      color: "#ff3f00"
    },
    goodsPriceAdd: {
      position: 'absolute',
      right: pxToDp(20),
      width: pxToDp(50),
      height: pxToDp(50),
      textAlignVertical:'center',
      textAlign: 'center',
      borderRadius: 36,
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      color: '#ff8e00',
      justifyContent: 'center',
      alignItems: 'center'
    },
    goodsPriceAddImg:{
      width: pxToDp(20),
      height: pxToDp(20)
    },
    goodsPriceAddActive: {
      position: 'absolute',
      right: pxToDp(20),
      width: pxToDp(50),
      height: pxToDp(50),
      textAlignVertical:'center',
      textAlign: 'center',
      borderRadius: 36,
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      backgroundColor:'#ff8e00',
      color:'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    hidden:{
      opacity:0   
    },
    goodsPriceSub: {
      position: 'absolute',
      right: pxToDp(130),
      width: pxToDp(50),
      height: pxToDp(50),
      textAlignVertical:'center',
      textAlign: 'center',
      borderRadius: 36,
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      color: '#b0b0b0', 
    },
    goodsNum:{
      position: 'absolute',
      right: pxToDp(70),
      width: pxToDp(60),
      textAlign:'center',
      fontSize: pxToDp(36),
    },
    opacity: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      height:"100%",
      position:"relative",

    },
    modelHeader: {
      position:'relative',
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#daddde',
    },
    modelImgWrap: {
      position:'absolute',
      top: pxToDp(0),
      zIndex: 1000,
      left: pxToDp(26),
      width: pxToDp(216),
      height: pxToDp(216),
      borderWidth: pxToDp(1),
      borderColor: '#daddde',
      borderRadius: 2,
      overflow:'hidden'
    },
    modelImg: {
      width: pxToDp(216),
      height: pxToDp(216),
    },
    priceWrap: {
      marginLeft: pxToDp(268)
    },
    price: {
       marginTop: pxToDp(70),
       fontSize: pxToDp(36),
       color:'#ff3f00',
    },
    specifications: {
      marginTop: pxToDp(28),
      marginBottom: pxToDp(30),
      fontSize: pxToDp(24),
      color: '#a2a2a2'
    },
    modelClose: {
      position: 'absolute',
      right: pxToDp(20),
      top: pxToDp(30),
      width: pxToDp(26),
      height: pxToDp(26)
    },
    modelCloseImg: {
      width: '100%',
      height: '100%'
    },
    selectionSpecification: {
      paddingLeft: pxToDp(26),
      paddingBottom: pxToDp(30),
      borderBottomWidth: pxToDp(1),
      borderBottomColor:'#daddde'
    },
    selectionSpecificationText: {
      marginTop: pxToDp(34)
    },
    selectionSpecificationList: {
      flexDirection: 'row',
      flexWrap:'wrap',
    },
    selectionSpecificationListText: {
      marginTop: pxToDp(20),
      marginRight: pxToDp(20), 
      width: pxToDp(160),
      height: pxToDp(64),
      borderWidth: pxToDp(1),
      borderColor: '#daddde',
      borderRadius: 5,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: pxToDp(28),
      color:'#a2a2a2'
    },
    badgeWrap:{
      position:'absolute',
      left: pxToDp(94),
      width: pxToDp(34),
      height: pxToDp(34),
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: pxToDp(20),
      color: 'white',
      backgroundColor: '#f43530',
      borderWidth: pxToDp(1),
      borderColor: 'white',
      borderRadius: 100,
      borderTopLeftRadius: 100,
      zIndex: 2000,
      overflow: "hidden",
    },
    badgeWrap1:{
      position:'absolute',
      left: pxToDp(94),
      width: pxToDp(54),
      height: pxToDp(34),
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: pxToDp(20),
      color: 'white',
      backgroundColor: '#f43530',
      borderWidth: pxToDp(1),
      borderColor: 'white',
      borderRadius: 100,
      borderTopLeftRadius: 100,
      zIndex: 2000,
      overflow: "hidden",
    },
    badge:{
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: pxToDp(20),
      color: 'white',
      backgroundColor: '#f43530',
      borderTopLeftRadius: 100,
      zIndex:2000
    },
    selectionSpecificationListTextActive: {
      marginTop: pxToDp(20),
      marginRight: pxToDp(20), 
      width: pxToDp(160),
      height: pxToDp(64),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      borderRadius: 5,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: pxToDp(28),
      color:'white',
      backgroundColor:'#ff8e00'
    },
    specificationNumber: {
      position:'relative',
      height: pxToDp(140),
    },
    specificationNumberTitle: {
      marginTop: pxToDp(30),
      marginLeft: pxToDp(26),
      fontSize: pxToDp(28),
      color:'#a2a2a2'
    },
    specificationNumberFunction:{
      position: 'absolute',
      right: pxToDp(24),
      top: pxToDp(30),
      flexDirection: 'row'
    },
    specificationNumberFunctionMinusSign: {
      width: pxToDp(60),
      height: pxToDp(60),
    },
    specificationNumberMinusSignWrap: {
      marginLeft: pxToDp(20),
      width: pxToDp(40),
      height: pxToDp(40),
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      borderRadius: 100,
      textAlign: 'center',
      justifyContent:'center',
      alignItems:"center",
    },
    specificationMinusSign: {
      width: pxToDp(21),
      height: pxToDp(6),
    },
    specificationNumberFunctionAdd: {
       width: pxToDp(60),
       height: pxToDp(60),
    },
    specificationNumberAddWrap: {
      width: pxToDp(40),
      height: pxToDp(40),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      borderRadius: 100,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: "center",
      backgroundColor: '#ff8e00'
    },
    specificationNumberAdd: {
      width: pxToDp(21),
      height: pxToDp(21)
    },
    specificationNumberText: {
      width: pxToDp(60),
      height: pxToDp(40),
      fontSize: pxToDp(28),
      color: '#2b2b2b',
      textAlign: 'center',
    },
    more: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: pxToDp(750),
      marginTop: pxToDp(20),
      height: pxToDp(60),
      backgroundColor: 'white',
      opacity:1
    },
    moreText: {
      textAlign: 'center'
    },
    settlementColumn: {
       height: pxToDp(140),
       backgroundColor: 'rgba(0,0,0,0)',
       paddingTop: pxToDp(34),
       position: 'absolute',
       bottom:0,
       left: 0,
       right: 0,
      //  backgroundColor: 'blue',
    },
    shoppingCartWrap:{
      position: 'absolute',
      left: pxToDp(20),
      zIndex:1000,
    },
    shoppingCart: {
      width: pxToDp(120),
      height: pxToDp(120),
    },
    goPayWrap: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      height: pxToDp(120),
      backgroundColor:'white',
      position:'relative',
      paddingLeft: pxToDp(158),
    },
    goPayTotalPrice: {
      fontSize: pxToDp(28),
      color: '#a2a2a2'
    },
    goPayTotalPriceSymbol: {
      fontSize: pxToDp(28),
      color: '#ff3f00'
    },
    totalPrice: {
      fontSize: pxToDp(36),
      color: '#ff3f00',
    },
    settlement: {
      position:'absolute',
      right: 0,
      height: "100%",
      width: pxToDp(214),
      backgroundColor: '#ff8e00',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    settlement1: {
      position:'absolute',
      right: 0,
      height: "100%",
      width: pxToDp(214),
      backgroundColor: '#a2a2a2',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modelBtn: {
      height: pxToDp(105),
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      backgroundColor:'#ff8e00'
  },
  noFindWrap: {
    flex: 1,
    alignItems: 'center'
  },
  noFindImg: {
    width: pxToDp(350),
    height: pxToDp(300),
    marginTop: pxToDp(130)
  },
  noFindTitle: {
    fontSize: pxToDp(40),
    marginTop: pxToDp(30),
    marginBottom: pxToDp(20),
  }
  
});
module.exports=Goods 