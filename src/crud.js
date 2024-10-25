const crud = {
  // CRUD JS CONSOLE
c: {
  e: function(msg) {
    console.error("CRUD: "+msg+".");
  },
  w: function(msg) {
    console.warn("CRUD: "+msg+".");
  },
  i: function(msg) {
    console.info("CRUD: "+msg+".");
  },
  l: function(m) {
    console.log(m);
  }
},
  // CRUD JS INFO
  info: function() {
  crud.c.l("CRUD script information:"+"\n"+"Version: 1.2"+"\n"+"Dependencies: jQuery v1.8.1+"+"\n"+"Console: Enabled"+"\n"+"Author: Philippe F."+"\n"+"Employee ID: 60073790");
},
// CRUD QUEUE
q: {
  list: [],
    abac: 0,
  add: function(name,callback) {
    if(typeof(name) !== "undefined" && name) 
      crud.q.list.push(name);
    crud.q.abac = crud.q.abac+1;
    if(typeof(callback) === "function") callback();
  },
    rem: function(name,callback) {
    if(typeof(name) !== "undefined" && name) {
      if(crud.q.list.indexOf(name) > -1)
        crud.q.list.splice(crud.q.list.indexOf(name), 1);
      crud.q.abac = crud.q.abac-1;			
      if(typeof(callback) === "function") callback();
    }
  },
    chk: function(callback) {
    if(crud.q.abac == 0) return true;
    else return false;
  },
    stop: function(callback) {
    var startLoop = setInterval(function(callback) {
      if(crud.q.chk()) {
        clearInterval(startLoop);
        callback();
      }
    },100,callback);
  }
},
create: function(a,b,cb) {
  crud.c.i("Create request submitted to "+a+" and:");
  crud.c.l(b);
  if(typeof(a) === "undefined" || a == null || typeof(b) === "undefined" || b == null)
    crud.c.e("Delete request missing critical arguement(s)");

  else {
    crud.q.add("crudCreate");
    jQuery.ajax({
      url: 'https://hpe-rfb.it.hpe.com/form/views/'+a+'/data/create',
      dataType: 'json',
      type: 'POST',
      data: b,
              beforeSend: function() {},
      success: function(response) {
        crud.q.rem("crudCreate");
        crud.c.i("Create request completed successfully to "+a);
        if(typeof(cb) === "function") return cb(response);
        else return response;
      },
      error: function() {
        crud.q.rem("crudCreate");
        crud.c.e("Create request failed for "+a+" and:");
        crud.c.l(b);
        if(typeof(cb) === "function") cb(false);
        else return false;
      },
              complete: function() {
                  
              }
    });
  }
},
read: function(a,b,cb) {
  crud.c.i("Read request submitted to "+a); 
  if(typeof(a) === "undefined" || a == null)
    crud.c.e("Request target ID not provided as arguement");

  else {
    if(typeof(b) === "undefined" || b == null || b == false) b = "";
    else b = "?"+b;
    
    crud.q.add("crudRead");
    
    var response = null;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 1) {
        crud.c.i("Request was sent to target ID "+a);
      }
      if(this.readyState === 4) {
        // CONTINUE CRUD
        var response;
        try {
          response = JSON.parse(this.responseText);
        }
        catch(err) {
          // CONTINUE CRUD
          crud.c.w("Unable to process response from "+a+" as JSON");
          response = this.responseText;
        }
        crud.q.rem("crudRead");
        if(typeof(cb) === "function") return cb(response);
        else return response;
      }
    });
    xhr.open("POST","https://hpe-rfb.it.hpe.com/form/views/"+a+"/data/read"+b);
    xhr.send(response);
  }
},
update: function(a,b,c,cb) {
  crud.c.i("Update request submitted to "+a+" for "+b);
  if(typeof(a) === "undefined" || a == null || typeof(b) === "undefined" || b == null || typeof(c) === "undefined" || c == null)
    crud.c.e("Update request failed; missing critical arguements");
  
  else {
    crud.q.add("crudUpdate");
    console.log("CRUD UPDATE");
    console.log("INPUT:");
    console.log(c);
    jQuery.ajax({
      url: 'https://hpe-rfb.it.hpe.com/form/views/'+a+'/data/update?EntryId='+b,
      dataType: 'json',
      type: 'POST',
      data: c,
              beforeSend: function() {},
      success: function(updateData) {
        console.log("OUTPUT:");
        console.log(updateData);
        console.log("____________________");
        crud.c.i("Update request completed successfully to "+a+" for "+b);
        crud.q.rem("crudUpdate");
        if(typeof(cb) === "function") return cb(updateData);
        else return updateData;
      },
      error: function() {
        crud.c.e("Update request failed for "+a+" and "+b);
        crud.q.rem("crudUpdate");
        if(typeof(cb) === "function") cb({Total: 0, Rows: []});
        else return {Total: 0, Rows: []};
      }
    });
  }
},
destroy: function(a,b,cb) {
  crud.c.i("Delete request submitted to "+a+" for "+b); 
  if(typeof(a) === "undefined" || a == null || typeof(b) === "undefined" || b == null || !b || !a)
    crud.c.e("Delete request missing critical arguement(s)");

  else {
    crud.q.add("crudDelete");
    var response = null;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 1) {
        // CONTINUE CRUD
        crud.c.i("Delete request was sent to "+a+" for "+b);
      }
      if(this.readyState === 4) {
        var response;
        try {
          response = JSON.parse(this.responseText);
        }
        catch(err) {
          // CONTINUE CRUD
          crud.c.w("Unable to process response from "+a+" as JSON");
          response = this.responseText;
        }
        crud.q.rem("crudDelete");
        if(typeof(cb) === "function") return cb(response);
        else return response;
      }
    });
    xhr.open("DELETE","https://hpe-rfb.it.hpe.com/form/views/"+a+"/data/destroy?EntryId="+b);
    xhr.send(response);
  }
},
custom: function(a,b,c,cb) {
  // a = URL / b = type / c = data / cb = callback
  crud.c.i("Custom request submitted");
  if(typeof(a) === "undefined" || typeof(b) === "undefined" || !a || !b)
    crud.c.e("Custom request missing critical arguement(s)");
  else {
    crud.q.add("crudCustom");
    jQuery.ajax({
      url: a,
      dataType: 'json',
      type: b,
      data: c,
      beforeSend: function() {},
      success: function(response) {
        crud.c.i("Custom request completed successfully to "+a.split("/")[a.split("/").length-1]);
        crud.q.rem("crudCustom");
        if(typeof(cb) === "function") return cb(response);
        else return response;
      },
      error: function() {
        crud.c.e("Custom request failed for "+a.split("/")[a.split("/").length-1]);
        crud.q.rem("crudCustom");
        if(typeof(cb) === "function") cb({Total: 0, Rows: []});
        else return {Total: 0, Rows: []};
      }
    });
  }
}
}