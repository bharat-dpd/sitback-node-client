var crypto  	= require("crypto");
var validator  	= require("validator");
var request 	= require("request");
var querystring = require("querystring");
var _ 		    = require("underscore");
var pkginfo     = require('pkginfo')(module, 'version');

var domain   = "sitback.samalgorai.com";
var VERSION  = module.exports.version;//get from package.json
var base_url = domain+"/api/v1";

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
   if(!options.token){
     throw new Error("token missing, refer : http://url for api key");
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
Sitback.prototype._post = function(path,message,callback){
  
  var signedUrl = this._createSignedString({method:"POST",path:path,message:JSON.stringify(message)});
  var url = "http://" + base_url + "/"+this.options.appId;
  url = url + path+ "?" + signedUrl;
  var  token = this.options.token;
  
  request({
    method  : "POST",
    url     : url,
    headers : this.headers,
    json    : message,
    body    : token
  },function(err,res,resBody){
     if(err)callback(err);
     else callback(null,resBody);
  });
 
}

Sitback.prototype.send = function(options,callback){
  if(!options.sender){

     var error = new Error("Email Id not provided");
     error.type= "client";
     error.name= "email";
     error.code= 400; 
     if(callback) callback(error)
     else throw error;
     return;
  }
  if(!_.isArray(options.receiver)){
     options.receiver = [options.recevier];
  }
  if(!options.receiver.length){

     var error = new Error("Email Id not provided");
     error.type= "client";
     error.name= "email";
     error.code= 400;
     if(callback) callback(error)
     else throw error;
     return;
  }

  //TODO: check for valid email
  var error = _.filter(options.receiver,function(email){
                 return !validator.isEmail(email);
              });
  if(error.length) return callback(error+" is not a valid email.");
  if(!options.mail_type){
     var error = new Error("Email Template tag not provided, refer \"App Dashboard\" for full list of template tags."); 
     error.type= "client";
     error.name= "template";
     error.code= 400;
     if(callback) callback(error)
     else throw error;
     return;
  }
  //create signature here for
  this._post("/send",options,callback);
}

Sitback.prototype._createSignedString =function(options){
  
  var params={};

  params["auth_version"] 	= Sitback.Version;
  params["auth_key"]	 	= this.options.token;
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

