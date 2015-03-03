var Reflux = require("reflux");
var BrainswarmActions = require("../actions/BrainswarmActions");
var socket = io.connect();

var BrainswarmStore = Reflux.createStore({
  _brainswarms: [],

  listenables: BrainswarmActions,


  getAll: function() {
    return this._brainswarms;
  },

  socketListener: function(){
    socket.on('brainswarm-change', function(currentBrainswarms) {
      if (currentBrainswarms){
        this._brainswarms = currentBrainswarms;
      }
      this.trigger();
    }.bind(this));
  },

  checkBrainswarm: function(idea_id, callback){
    var brainswarms = this._brainswarms;
    this.socketListener();
    for (var i =0; i < brainswarms.length; i++){
      if (brainswarms[i].idea === idea_id){
        return callback(brainswarms[i]);
      }
    }
    callback();
  },
  getBrainswarm: function(idea_id, callback) {
    $.ajax({
      type: 'GET',
      url: '/brainswarms/' + idea_id
    })
    .done(function (brainswarmsData) {
      // var brainswarms = this._brainswarms;
      for (var i = 0; i< brainswarmsData.length; i++){
        this._brainswarms.push(brainswarmsData[i]);
        if (brainswarmsData[i].idea === idea_id){
          var tempBrainswarm = brainswarmsData[i];
        }
      }
      this.socketListener();
      socket.emit('brainswarm-change', this._brainswarms);
      this.trigger();
      if (tempBrainswarm) {
        return callback(tempBrainswarm);
        // return tempBrainswarm;
      };
      callback();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });

  },

  findBrainswarm: function(brainswarmId) {
    var brainswarms = this._brainswarms;
    for (var i =0; i< brainswarms.length; i++){
       if (brainswarms[i]._id === brainswarmId){
         return brainswarms[i];
       }
    }
  },

  getBrainswarmById: function(brainswarm_id, callback) {
    // This ajax call sends the brainswarm_id as an "idea_id" to the routes
    $.ajax({
      type: "GET",
      url: "/brainswarms/" + brainswarm_id
    })
    .done(function(brainswarmData){
      this._brainswarms.push(brainswarmData);
      this.trigger();
      callback(brainswarmData[0]);
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  create: function(idea_id, name, callback) {
  //  console.log('this is create name', name);
    $.ajax({
      type: 'POST',
      url: '/brainswarms/' + idea_id,
      data: {name: name}
    })
    .done(function(brainswarm) {
      //console.log("made brainswarm",brainswarm)
       this._brainswarms.push(brainswarm);
       // _brainswarms[brainswarm._id] = brainswarm

      // broadcast that _rooms has changed
      socket.emit('brainswarm-change', this._brainswarms);
      this.trigger();
      this.socketListener();
      callback(brainswarm._id);
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },


  edit: function(brainswarmId, map) {
     $.ajax({
       type: 'PUT',
       url: '/brainswarms/' + brainswarmId,
       data: {map: map}
     })
     .done(function(brainswarmEdit) {

       for (var i = 0; i < this._brainswarms.length; i++){
        if (this._brainswarms[i]._id === brainswarmEdit._id){
          this._brainswarms[i].map = brainswarmEdit.map
        }
       };
       this.trigger();
     }.bind(this))
     .fail(function(error) {
       console.log(error);
     });
  }

});

module.exports = BrainswarmStore;

