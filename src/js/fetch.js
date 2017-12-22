import Cookie from 'react-native-cookie';
module.exports=(url,method,params1,callback,err,)=>{
  Cookie.get(global.url).then((cookie) => {
    // let oCookie
    // if(cookie.userId){
    //   cookieStr={
    //     userId: cookie.userId
    //   }
    // }
    var myHeaders = new Headers({
      'User-Agent': 'App',
      'Accept': 'application/json',
      "Content-Type": "application/json",
      // 'Cookie': cookieStr
    })
    console.log(myHeaders)
    if(method.toLowerCase()=='post'){
     fetch(url, {
              method:method,
              headers:myHeaders,
              // credentials:'omit',
              body:JSON.stringify(params1)
            })
            .then((response) => response.json())
            .then((responseData) => { 
              if(typeof responseData=='object'){
                   callback(responseData)
              }
            })
            .catch((error) => { 
              if(typeof err =='object'){
                err(error)
              }
              
            })
           .done(); 
    }else{
      fetch(url, {
              method:method,
              mode: 'same-origin',
              headers: myHeaders
              // credentials:'omit',
            })
            .then((response) => response.json())
            .then((responseData) => { 
              if(typeof responseData=='object'){
                   callback(responseData)
              }
            })
            .catch((error) => { 
              if(typeof err =='object'){
                err(error)
              }
            })
           .done();
    }
  })
}