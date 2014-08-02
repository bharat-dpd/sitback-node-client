var sit = require("../");
var b = sit({appId:"53d22fca5c651733174542bf",appKey:"34e4",appSecret:"sdf343r$%F"});

//b._createSignedString({method:"POST",path:"/send",message:["rrr"]});


b.send({
  sender:"samalgorai@gmail.com",
  receiver:"samalgorai@gmail.com",
  mail_type:"d",
  data:{
   name:"Samal"
  }
},function(err,body){
  console.log(err,body);

});
