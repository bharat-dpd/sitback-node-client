var sit = require("../");
var b = sit({appId:"53dc935398fb601229cf594b",appKey:"34e4",appSecret:"sdf343r$%F"});

//b._createSignedString({method:"POST",path:"/send",message:["rrr"]});


b.send({
  sender:"samal@treashare.in",
  receiver:"samal@treashare.in",
  mail_type:"notfound",
  data:{
   name:"Samal"
  }
},function(err,body){
  console.log(err,body);

});
