var crypto  	= require("crypto");
var request 	= require("request");
var querystring = require("querystring");

var domain   = "localhost";
var VERSION  = "0.0.1";//get from package.json
var base_url = domain+"/v1/";

function  Sitback(options){
   if(!(this instanceof Sitback)) return new Sitback(options);
     
   this.headers = {
      'Accept': '*/*',
      'Connection': 'close',
      'User-Agent': 'sitback/' + VERSION
   };
   if(!options.appId){
     throw new Error("appId missing, refer : http://url for api key");
     return ;
   }
   if(!options.appKey){
     throw new Error("appKey missing, refer : http://url for api key");
     return ;
   }
   if(!options.appSecret){
     throw new Error("appSecret missing, refer : http://url for api key");
     return ;
   }
   this.options = options;
}

Sitback.Version 	= VERSION;
module.exports		= Sitback;


//make a post request to server
Sitback.prototype._post = function(url,path,message,callback){
  
  var signedUrl = this._createSignedString({method:"POST",path:path,message:JSON.stringify(message)});
  
  url = url + path+ "?" + signedUrl;
  
  request({
    method:"POST",
    url:url,
    headers:this.headers,
    json:message, 

  },function(err,res,resBody){

     console.log(err,res);
  });
 
}

Sitback.prototype.send = function(options,callback){
  if(!options.email_id){
     //TODO: check for valid email

     var error = new Error("Email Id not provided");
     error.type= "client";
     error.name= "email";
     error.code= 400; 
     if(callback) callback(error)
     else throw error;
     return;
  }
  if(!options.template_tag){
     var error = new Error("Email Template tag not provided, refer \"App Dashboard\" for full list of template tags."); 
     error.type= "client";
     error.name= "template";
     error.code= 400;
     if(callback) callback(error)
     else throw error;
     return;
  }
  //create signature here for
  var url = "http://" + base_url + "/"+this.options.appId;  
  this._post(url,"/send",options,callback);
}

Sitback.prototype._createSignedString =function(options){
  
  var params={};

  params["auth_version"] 	= Sitback.Version;
  params["auth_key"]	 	= this.options.appKey;
  params["auth_timestamp"]	= parseInt(new Date().getTime() / 1000);
 
  //generate md5 of message. 
  if(options.message){
     var message = options.message;
     if(typeof message !== String)
         message = JSON.stringify(message);
     var hash = crypto.createHash("md5").update(message,"utf8").digest("hex");
     params["auth_hash"] = hash; 
  }
  
  var qs	= querystring.stringify(params);
  var data 	= [options.method,options.path,qs].join("\n");
  
  //generate signature to authinticate the payload.
  var signature = crypto.createHmac("sha256",this.options.appSecret).update(data).digest("hex");
  qs = qs + "&auth_signature="+signature;
  return qs; 

}
