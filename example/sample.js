var sit = require("../");
var b = sit({appId:123,appKey:"34e4",appSecret:"sdf343r$%F"});

b._createSignedString({method:"POST",path:"/send",message:["rrr"]});


b.send({
  email_id:"ffff",
  template_tag:"signup",
  data:{

  }
});
