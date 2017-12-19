
module.exports=(url,method,params1,callback,err)=>{
  var myHeaders = new Headers( {
    'User-Agent': 'App',
    'Accept': 'application/json',
    "Content-Type": "application/json",
    // 'Cookie': 'userOpenId=osn3B0QbVoTswVuhjRBe2FToasxc'
    'Cookie': 'userOpenId=oWgQ8uO1vM9GhWFNVncH6yVHF_4k'
  })
  
	if(method.toLowerCase()=='post'){
    console.log(myHeaders)
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
}