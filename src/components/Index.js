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
  StatusBar,
  Animated
} from 'react-native';
import Cookie from 'react-native-cookie';
import Fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}
class Index extends Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
        //左边菜单
        var type1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        //右边菜单  
        let type2 = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged:(s1,s2)=>r1 !== r2,
        });
          this.state = {
          modalVisible: false,
          active: 0,
          dataSource: type1.cloneWithRows([]),
          type2:type2.cloneWithRows([]),
            searchText: '',
      };
       global.isSearch=0
        //初始化菜单链接
        let url = global.url + '/API/home/initSgHome'
        //初始化菜单
      Fetch(global.url+'/api/home/getInitData', 'post', '', (responseData) => {
          // let menu1=[]
          // for(let i=0;i<responseData.data.length;i++){
          //   if (i == 0) {
          //     //添加1级菜单的第一个
          //     menu1.push({id:responseData.data[i].id,Text:responseData.data[i].name,isActive:true})
          //     //一上来展示二级菜单
          //     this.menu2(i, responseData.data)
          //   } else {
          //     //添加其他1级菜单
          //     menu1.push({id:responseData.data[i].id,Text:responseData.data[i].name,isActive:false})
          //     // this.menu2(i,responseData.data)
          //   }     
          // }
          global.storage.load({
            key: 'alert1',
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
          }).catch(err => {
          switch (err.name) {
            case 'NotFoundError':
                  break;
                case 'ExpiredError':
                    // TODO
                    break;
          }
          })
          global.storage.sync = {
            alert1() {
              //数据好了加载load取消
              global.storage.save({
                key: 'alert1',  // 注意:请不要在key中使用_下划线符号!
                data: '111'
              });
              Alert.alert(responseData.notify.text)
            }
          }
          
          this.setState({notify:responseData.notify.text})
        })
      Fetch(url, 'post', '', (responseData) => {
          console.log(responseData)
          let menu1=[]
          for(let i=0;i<responseData.data.length;i++){
            if (i == 0) {
              //添加1级菜单的第一个
              menu1.push({id:responseData.data[i].id,Text:responseData.data[i].name,isActive:true})
              //一上来展示二级菜单
              this.menu2(i, responseData.data)
            } else {
              //添加其他1级菜单
              menu1.push({id:responseData.data[i].id,Text:responseData.data[i].name,isActive:false})
              // this.menu2(i,responseData.data)
            }     
          }
          this.setState({dataSource:type1.cloneWithRows(menu1),menuData:responseData.data})
        })
    }
    //1级菜单的改变二级菜单页跟着改变
    menu2(index,data){
      let type2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged:(s1,s2)=>r1 !== r2,
      });
      let menu2=[]
      if(typeof data != 'object'){
        return
      }
      for(let i=0;i<data[index].categorys.length;i++){
          menu2.push({id:data[index].categorys[i].id,name:data[index].categorys[i].name,img:data[index].categorys[i].img})
      }
      this.setState({type2:type2.cloneWithRows(menu2)})
    }
    //点击1级菜单
    goods1NameFn(dataSource,sectionID){
      for(let i=0;i<dataSource._dataBlob.s1.length;i++){
          if(i==sectionID){
              dataSource._dataBlob.s1[i].isActive=true 
          }else{
              dataSource._dataBlob.s1[i].isActive=false
          }
      }
      this.menu2(sectionID,this.state.menuData)
      var newTabs = JSON.parse(JSON.stringify(dataSource._dataBlob.s1));
      this.setState({dataSource:this.state.dataSource.cloneWithRows(newTabs)})
    }
    //二级菜单的list渲染
    _renderRow(data, sectionID, rowID) {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.goods3body}>
          <TouchableOpacity onPress={() =>
            navigate('Goods', {
              goodname: data.name
            })
          }>
            <View style={styles.goods3bodyEach}>
              <Image style={styles.goods3bodyImg} source={{uri:data.img}}></Image> 
              <Text style={styles.goods3bodyText} >{data.name}</Text>
            </View> 
          </TouchableOpacity> 
        </View>
      );
    }
    //搜索产品
    _onPressSearch(event) {
      const { navigate } = this.props.navigation;
        if (!global.isSearch) { 
          navigate('Goods', { goodname: this.state.searchText ,Back:this.Back})
          global.isSearch=1
        }
    }
     Back() { 
      global.isSearch=0
    }
    render(){
      const { navigate } = this.props.navigation;
        return(
             <View>
                <StatusBar
                  barStyle="light-content"
                />
                
                <View style={styles.header}>
                  <ImageBackground style={styles.headerSearch} source={require('../images/header.jpg')}>
                    <TouchableOpacity style={{paddingLeft:pxToDp(25)}}  onPress={() => {
                      Cookie.get(global.url).then((cookie) => {
                        if(!cookie||!cookie.userId){
                            navigate("Login")
                        }else{
                          navigate('QRcode')} 
                        }
                      )
                    }}>
                      <View style={styles.headerSearchCode}>
                          <Image style={styles.headerSearchCodeImg} source={require('../images/QRcode.png')}></Image> 
                          <Text style={styles.headerSearchCodeText}>绑卡</Text>
                      </View>
                    </TouchableOpacity>
                      <View  style={styles.headerSearchBody}>
                        <TextInput
                          returnKeyType={"search"}
                          onEndEditing={this._onPressSearch.bind(this)}
                          style={styles.headerSearchBodyInput}
                          underlineColorAndroid={'transparent'}
                          onChangeText={(text) => this.setState({searchText:text})}
                          placeholder={'输入关键字直接搜索'}
                          placeholderTextColor={'#a6a6a6'}
                        />
                  <TouchableOpacity style={styles.headerSearchImgWrap} onPress={() => {
                    
                    this._onPressSearch()
                  }}><Image style={styles.headerSearchImg} source={require('../images/search.png')}></Image></TouchableOpacity>
                      </View>
                      <TouchableOpacity style={styles.headerSearchMy} onPress={() => navigate('CustomerService')}>
                        <Image style={styles.headerSearchMyImg} source={require('../images/customService.png')}></Image>
                        <Text  style={styles.headerSearchMyText}>客服</Text>
                      </TouchableOpacity>
              </ImageBackground>
              <View style={styles.warn}><Image style={styles.horn} source={require('../images/horn.png')}></Image><Text style={styles.warnText}>{this.state.notify}</Text></View>
                  <TouchableOpacity style={styles.headerFunction} onPress={()=>{
                    Cookie.get(global.url).then((cookie) => {
                      if(!cookie||!cookie.userId){
                          navigate("Login")
                      }else{
                        navigate('GroupArrivesHome')
                      }
                    })
                    }
                  }>
                    <Image style={styles.gorupBuy} source={require('../images/groupBuy.jpg')}></Image>
                  </TouchableOpacity>
            </View>
              <View>
              </View>
                <View style={styles.goodsWrap}>
                  <ScrollView style={styles.goods1} showsVerticalScrollIndicator={false}> 
                    <ListView 
                      dataSource={this.state.dataSource}
                      renderRow={(rowData,index,sectionID) =><TouchableHighlight onPress={()=>{this.goods1NameFn(this.state.dataSource,sectionID)}}><View style={[styles.goods1Name,rowData.isActive&&styles.goods1NameActive]}><Text style={styles.goods1NameText}>{rowData.Text}</Text><Text style={rowData.isActive?styles.goods1NameTextLine:styles.goods1NameTextLine1}></Text></View></TouchableHighlight>}
                    />
                  </ScrollView> 
                  <ScrollView style={styles.goods2} showsVerticalScrollIndicator={false}> 
                      <ListView 
                          contentContainerStyle={styles.goods3}
                          dataSource={this.state.type2}
                          renderRow={this._renderRow.bind(this)
                        }/>
                  </ScrollView>  
                </View>
           </View> 
        );
    }
}
const styles = StyleSheet.create({
  header: {
    borderBottomWidth:pxToDp(1),
    borderBottomColor:'#daddde',
  },
  gorupBuy: {
    width: '100%',
    height: pxToDp(183)
  },
  headerSearch: {
    flexDirection:'row',
    paddingRight:pxToDp(25),
    paddingTop:Platform.OS==='android'?pxToDp(15):pxToDp(60),
    paddingBottom:pxToDp(18),
    backgroundColor:'white',
    height: Platform.OS==='android'?pxToDp(100):pxToDp(130),
},
  headerSearchCode: {
      width:pxToDp(72),
      alignItems:'center',    
  },
  headerSearchCodeImg: {
    width:pxToDp(34),
    height:pxToDp(34)
  },
  headerSearchCodeText: {
    marginTop: pxToDp(10),
    fontSize:pxToDp(18),
    // textAlign:"center",
    backgroundColor:'rgba(0,0,0,0)',
    color: 'white'
  },
  headerSearchBody: {
    position:"relative",
    width:pxToDp(560),
    // textAlign:'center',
    paddingTop:pxToDp(2),
    paddingBottom:pxToDp(2),
    paddingLeft:pxToDp(18),
    paddingRight:pxToDp(18)
  },
  headerSearchBodyInput: {
    borderColor: '#ececec', 
    borderWidth: 1,
    borderRadius:36,
    backgroundColor:"#eeeeee",
    height:pxToDp(54),
    padding:0,
    paddingLeft:pxToDp(36),
  },
  headerSearchImgWrap: {
    position:'absolute',
    right:pxToDp(10),
    top: pxToDp(8),
    width: pxToDp(60),
    height: pxToDp(60),
  },
  headerSearchImg: {
    width:pxToDp(38),
    height:pxToDp(38)
  },
  headerSearchMy: {
    width: pxToDp(64),
    alignItems:"center"
  },
  headerSearchMyImg: {
    width: pxToDp(32),
    height: pxToDp(34)
  },
  headerSearchMyText: {
    fontSize: pxToDp(18),
    marginTop: pxToDp(10),
    // textAlign: "center",
    backgroundColor:'rgba(0,0,0,0)',
    color: 'white'
  },
  headerFunction: {
    flexDirection: 'row',
    backgroundColor:'white',
    height: pxToDp(223),
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20)
  },
  headerFunctionEach: {
      flex:1,
      alignItems:'center',
  },
  headerFunctionEachImg: {
    marginTop:pxToDp(27),
    width: pxToDp(84),
    height: pxToDp(84),
  },
  headerFunctionEachText: {
    // textAlign: 'center',
    paddingTop: pxToDp(18),
    paddingBottom:pxToDp(30),
    fontSize: pxToDp(24),
  },
  goodsWrap: {
    flexDirection:'row',
    backgroundColor: '#f4f4f4'
  },
  warn: {
    flexDirection: 'row',
    height: pxToDp(66),
    alignItems: 'center',
    backgroundColor: '#fff7cc',
    borderBottomWidth: pxToDp(1),
    borderBottomColor: '#e9eae8'
  },
  warnText: {
    color: '#fe7000',
    fontSize: pxToDp(24)
  },
  horn: {
    width: pxToDp(36),
    height: pxToDp(34),
    marginLeft: pxToDp(18),
    marginRight: pxToDp(14)
  },
  goods1: {
    width: pxToDp(176),
    height: scrrollHeight(pxToDp(448))
  },
  goods1Name: {
    width: "100%",
    height: pxToDp(93),
    lineHeight: pxToDp(93),
    borderBottomWidth: pxToDp(1),
    borderBottomColor: '#daddde',
    backgroundColor: '#f4f4f4',
    position:'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  goods1NameText: {
    // textAlign:'center',
    fontSize: pxToDp(28),
    // textAlignVertical: 'center',
  },
  goods1NameActive: {
    backgroundColor: 'white'
  },
  goods1NameTextLine:{
    position:'absolute',
    left: 0,
    top: 0,
    width:pxToDp(6),
    height:'100%',
    backgroundColor:'#f68900',
  },
  goods1NameTextLine1:{
    position:'absolute',
    left: 0,
    top: 0,
    width:pxToDp(6),
    height:'100%',
    backgroundColor:'white',
  },
  goods2:{
    width:pxToDp(576),
    height:scrrollHeight(224),
    paddingLeft:pxToDp(24),
    backgroundColor:'white'
  },
  goods2Bnner: {
    width:pxToDp(526),
    height:pxToDp(200),
    marginTop: pxToDp(28)
  },
  goods3: {
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:pxToDp(30)
  },
  goods3section:{
    // textAlign:'center',
    height:pxToDp(90),
    flexDirection:'row',
    lineHeight:pxToDp(90),
    alignItems: 'center',
  },
  goods3sectionHeaderImg1: {
    width:pxToDp(26),
    height:pxToDp(22),
    marginLeft:pxToDp(204),
    marginRight:pxToDp(12),
    marginTop:pxToDp(4)
  },
  goods3sectionHeaderImg2: {
    width:pxToDp(26),
    height:pxToDp(22),
    marginLeft:pxToDp(12),
    marginTop:pxToDp(4)
  },
  goods3sectionHeaderText: {
    fontSize:pxToDp(24)
  },
  goods3body:{
    flexDirection:'row',
      },
  goods3bodyEach:{
    width:pxToDp(160),
    marginLeft:pxToDp(14),
    alignItems:'center'
  },
  goods3bodyImg:{
    width:pxToDp(128),
    height:pxToDp(128)
  },
  goods3bodyText: {
    marginTop:pxToDp(18),
    // textAlign:'center',
    fontSize:pxToDp(24),
    color:'#818181',
    height:pxToDp(62),
    // textAlignVertical: 'center'
  }
});
module.exports=Index 