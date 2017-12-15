module.exports=(url,method,params1,callback,err)=>{
	if(method.toLowerCase()=='post'){
	 fetch(url, {
            method:method,
            headers: {
              'User-Agent': 'App',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cookie': 'userOpenId=osn3B0QbVoTswVuhjRBe2FToasxc'
            },
            credentials:'omit',
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
            headers: {
              'User-Agent': 'App',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cookie': 'userOpenId=osn3B0QbVoTswVuhjRBe2FToasxc'
            },
            credentials:'omit',
          })
          .then((response) => response.json())
          .then((responseData) => { 
          	if(typeof responseData=='object'){
                 callback(responseData)
          	}
          })
          .catch((error) => { 
          	
          })
         .done();
	}
}