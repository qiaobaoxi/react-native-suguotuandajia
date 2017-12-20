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
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Login extends Component{
    constructor(props) {
        super(props);
        this.state={tel: '',code: '',disabled:true,codeDisabled:true,getCodeText:'获取动态密码'}
    }
    submit(){
        // if(!this.state.tel){
        //    Alert.alert('手机号不能为空')
        //    return
        // }
        // if(!this.state.code){
        //     Alert.alert('手机号不能为空')
        //     return
        //  }
    }
    isDisabled(){
        if (this.state.tel.length == 11) {
          this.setState({codeDisabled: false})
        } else {
          this.setState({codeDisabled: true}) 
        }
        if (this.state.tel && this.state.code) {
            this.setState({disabled: false})
         }else{
            this.setState({disabled: true})
         }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>登录</Text>
                </View>
                <View>
                    <View style={styles.logo}>
                      <Image style={styles.logoImg} source={require('../images/login-logo.png')}></Image>
                    </View>
                    <View style={styles.tel}>
                      <TextInput keyboardType="numeric" onChangeText={(text) => {
                          this.setState({tel:text},()=>{
                            this.isDisabled()
                          })
                        }} style={[styles.telInput,styles.input]} underlineColorAndroid={'transparent'} placeholder={'手机号'} placeholderTextColor={'#a2a2a2'}/>
                    </View>
                    <View style={[styles.code,styles.input]}>
                      <TextInput keyboardType="numeric" onChangeText={(text) => {
                          this.setState({code:text},()=>{
                            this.isDisabled()
                          })
                          }} style={styles.codeInput} underlineColorAndroid={'transparent'} placeholder={'邀请码'} placeholderTextColor={'#a2a2a2'}/>
                      <TouchableOpacity style={styles.button} onPress={()=>{
                          let num=60
                          let timer=setInterval(()=>{
                             num--
                             this.setState({getCodeText:num+'s重新获取',codeDisabled: true})
                             if(num==0){
                                 clearInterval(timer)
                                this.setState({getCodeText:'获取动态密码',codeDisabled: false})
                             }
                          },1000)
                      }} disabled={this.state.codeDisabled}><Text style={styles.buttonText}>{this.state.getCodeText}</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={this.state.disabled?styles.submit:styles.submit1} disabled={this.state.disabled} onPress={this.submit.bind(this)}>
                        <Text style={styles.submitText}>登录</Text>
                    </TouchableOpacity>
                </View>
            </View>    
        );
    }
}
const styles = StyleSheet.create({
    header:{
       paddingTop: pxToDp(40),
       height: pxToDp(134),
       backgroundColor: 'white',
       alignItems: 'center',
       justifyContent: 'center'
    },
    headerText: {
       fontSize: pxToDp(36)
    },
    logo: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
        marginTop: pxToDp(64),
        marginBottom: pxToDp(52),
        width: pxToDp(247),
        height: pxToDp(148),
    },
    input: {
        height: pxToDp(94),
        backgroundColor: 'white',
        borderWidth: pxToDp(1),
        borderColor: '#daddde',
        borderRadius: 5,
    },
    tel: {
        marginBottom: pxToDp(19),
        justifyContent: 'center',
        alignItems: 'center',
    },
    telInput: {
        marginLeft: '7%',
        marginRight: '7%',
        paddingLeft: pxToDp(26),
        width: '86%',
    },
    code: {
        flexDirection: 'row',
        marginBottom: pxToDp(19),
        width: '86%',
        marginLeft: '7%',
        marginRight: '7%',
        alignItems: 'center'
    },
    codeInput: {
        width: pxToDp(402),
        paddingLeft: pxToDp(26),
        height: '100%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(50),
        width: pxToDp(244),
        borderLeftColor: '#dfdfdf',
        borderLeftWidth: pxToDp(1)
    },
    buttonText: {
        // color: '#ff8e00',
        fontSize: pxToDp(32),
        
    },
    submit: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '86%',
        marginLeft: '7%',
        marginRight: '7%',
        height: pxToDp(94),
        backgroundColor: '#a2a2a2',
        borderRadius: 5,
        marginTop: pxToDp(30)
    },
    submit1:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '86%',
        marginLeft: '7%',
        marginRight: '7%',
        height: pxToDp(94),
        backgroundColor: '#ff8e00',
        borderRadius: 5,
        marginTop: pxToDp(30)
    },
    submitText: {
        color: 'white',
        fontSize: pxToDp(32),
    }
});
module.exports=Login
