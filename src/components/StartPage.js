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
  Alert
} from 'react-native';
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Index extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        const { navigate} = this.props.navigation;
        return(
            <View>
                <Image source={require('../images/startPage.png')}></Image>
            </View>    
        );
    }
}
const styles = StyleSheet.create({
    
});
module.exports=Index
