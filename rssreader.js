/* * *************************************************************
 * Copyright notice
 *
 * (c) 2019 Chi Hoang
 *  All rights reserved
 *
 * **************************************************************/
 
var urls = [ {  title : "Google News",
	              url: "https://news.google.com/news/rss/" },
	           {  title : "Reddit World News",
	           	  url :  "https://reddit.com/r/worldnews/.rss" },
						 { title : "BBC News" ,
						 	  url :  "https://feeds.bbci.co.uk/news/world/" },
						 { title : "Defence Blog News" ,
						 	  url : "https://defence-blog.com/feed" },
						 { title : "BuzzFeeds World News" ,
						 	  url : "https://buzzfeed.com/world.xml" },
						 { title : "Al Jazeera RSS Feed" ,
						 	  url :  "https://aljazeera.com/xml/rss/all.xml"} 
						 ] ;

function List() {
  this.observerList = [];
  this.sort = "";
  this.func = "";
  return this;
} 
List.prototype = {
  add : function( obj ){
    return this.observerList.push( obj );
  },
  unshift : function( obj ){
    return this.observerList.unshift( obj );
  },
  count : function() {
    return this.observerList.length;
  },
  get : function( index ){
    if( index > -1 && index < this.observerList.length ){
      return this.observerList[ index ];
    }
  },
  removeAt : function( from, to){
    this.from = from || 0;
    this.to = to || 1;    
    this.observerList.splice( from, to );
  }
};
 
var Subject = function () {
	this.ele = document.createElement("div");
  this.ele.id = Math.floor((Math.random() * 768716276990) + 1);
  this.ele.className = "news";
  return this;
}

Subject.prototype = {
  update : function (parent,id) {
    this.ele.b=null;
  }
}

var Publisher = function (observers)
{
  this.xhr=[];
  this.observers = observers;
 return this;
}

Publisher.prototype = {
   Init : function () {
   	  var _self=this;
			var ele = document.createElement("ul");	
			document.getElementById("menu").appendChild(ele);
			for (var i=0,e=urls.length;i<e;++i) {
				var f = document.createElement("li");
				f.onclick = function(){
					   console.log(Array.from(this.parentElement.children).indexOf(this));
						_self.loadFeed(urls[Array.from(this.parentElement.children).indexOf(this)].url);
				}
				ele.appendChild(f).appendChild(document.createTextNode(urls[i].title));
			}
			ele = document.createElement("button");	
			ele.innerHTML = "Add";
		  ele.onclick = function(){
		  	  document.getElementById("addmenu").style.visibility = "visible";
    			return false;
  		};
  		document.getElementById("menu").appendChild(ele);
  		document.getElementById("cancel").addEventListener("click", _self.Cancel);
  		document.getElementById("ok").addEventListener("click", function () {
  			_self.OK(_self);
  		});
   },
   Cancel : function () {
   		document.getElementById("addmenu").style.visibility = "hidden";
   },
   OK : function (_self) {
    		var newfeed = document.getElementById("newfeed").value;
   		var f = document.createElement("li");
				f.onclick = function(){
					   console.log(Array.from(this.parentElement.children).indexOf(this));
						_self.loadFeed(urls[Array.from(this.parentElement.children).indexOf(this)].url);
				}
   	 	 document.getElementById("menu").getElementsByTagName("ul").item(0).appendChild(f).appendChild(document.createTextNode(newfeed));
   	 	 urls.push({title : newfeed, url : newfeed});
   	 	 _self.loadFeed(newfeed);
   	 	 document.getElementById("addmenu").style.visibility = "hidden";
   	 	 document.getElementById("addmenu").value = "https://";   	 	 
   },
   loadFeed : function (url) {
   	 console.log(url);
   	 var _self=this;
   	 var myNode = document.getElementById("feed");
			while (myNode.firstChild) {
			    myNode.removeChild(myNode.firstChild);
			}
			_self.Request(url);
   },
	CreateRequestObject : function () {
		var xmlHttp = false;
		if (typeof(XMLHttpRequest) != 'undefined') {
			xmlHttp = new XMLHttpRequest();
		}
		if (!xmlHttp) {
			try {
				xmlHttp  = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					xmlHttp  = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					xmlHttp  = false;
				}
			}
		}
		return xmlHttp;
	},
	Request : function  (url) {
		var i=0; var _self=this;
		this.xhr[i]= this.CreateRequestObject();		
		
		//https://stackoverflow.com/feeds/question/10943544
		if (this.xhr[i]) {
			this.xhr[i].open('GET','https://cors-anywhere.herokuapp.com/http://rss2json.com/api.json?rss_url='+url,
					true);
			this.xhr[i].timeout = this.timeout; // time in milliseconds
			this.xhr[i].ontimeout = function (e) {
					// XMLHttpRequest timed out. Do something here.
				alert("Sorry, not found! Please try again!");
			};
			this.xhr[i].crossDomain = true;
			this.xhr[i].responseType = 'json';
			this.xhr[i].onreadystatechange = null;
			this.xhr[i].addEventListener( "load", function(e) { _self.Response(e);}, false);
			this.xhr[i].send(null);
		}
	},
	Response : function (request) {
		var j;
		j=request.target.response.items;	
		if (j!=null) {
			e=j.length-1;
			this.observers.observerList=[];
			for (var i=0,e=j.length;i<e;i++) {
			  this.Create(new Subject(),j[i].title,j[i].description)                 
			}
		}		
   },
   Create : function(e,title,content) {
		
	    e.title = title || 0;
	    e.content = content || 0;
	    
	    e.type = "title";
	    e.visibility = "show";
	    
	    e.ele.className = "news " + e.ele.id;
	    window.document.getElementById("feed").appendChild(e.ele);
	    var title = document.createElement("h3");
	    title.innerHTML = e.title;
	    e.ele.appendChild(title);
	    //e.ele.appendChild(window.document.createTextNode(e.content.replace(/<\/?[^>]+(>|$)/g, "").substr(0,100)));
	 
	 		var content = document.createElement("p");
	    content.innerHTML = e.content.replace(/<\/?[^>]+(>|$)/g, "").substr(0,100);
	    e.ele.appendChild(content);
	    
	    var button = document.createElement("button");
	    button.className = "button";
	    button.innerHTML = "Open";
	    button.onclick = function(){
    			var x=window.open('','_newWindow','width=600, height=600');
    			x.document.open();
					x.document.write(e.content);
					x.document.close();
    			return false;
  			};
		  e.ele.appendChild(button);		   
		  this.observers.add(e);
  }
}

var l;
l = new Publisher(new List());
l.Init();
l.Request("https://news.google.com/rss/");
