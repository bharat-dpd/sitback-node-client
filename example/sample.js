var sit = require("../");
var b = sit({appId:"53dc935398fb601229cf594b",token:"34e4",appSecret:"sdf343r$%F"});

//b._createSignedString({method:"POST",path:"/send",message:["rrr"]});


b.send({
  sender:"samalgorai@gmail.com",
  receiver:["samalgorai@gmail.com"],
  mail_type:"Test",
  data:{
   name:"Samal",
   random:Math.random()*10000000
  }
},function(err,body){
  console.log(err,body);

});
