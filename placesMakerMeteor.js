Places = new Meteor.Collection('places');
Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {
  Meteor.subscribe("places");
  var OrderedPlaces = [];

  Template.allPlaces.places = function () {
    return Places.find({},{sort: {title: 1}});
  };

  Template.placeItem.placeEvent = function () {
    return Session.get(this.title);
  };

  Template.placeItem.events({
      'click div': function () {
        if (this.ordered === 0 && !~OrderedPlaces.indexOf(this._id)) {
          OrderedPlaces.push(this._id);
          Session.set(this.title,'selected');
        }
        else if (this.ordered === 0 && ~OrderedPlaces.indexOf(this._id)){
          OrderedPlaces.splice(OrderedPlaces.indexOf(this._id),1);
          Session.set(this.title,'simple');

      }
    }
  });

  Template.order.events({
    'click div' : function () {
      OrderedPlaces.forEach(function(id){
        var currentPlace = Places.find({_id:id}).fetch()[0].title;
        Places.update(id,{$set:{ordered:1,placeClass:'ordered'}});
        Session.set(currentPlace,"");
        OrderedPlaces = [];
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("places",function(){
    return Places.find({});
  });
  Meteor.startup(function(){
    if (Places.find().count() === 0 ) {
      for (var i = 0; i < 100; i++) {
        Places.insert({title:i+1,ordered:0,placeClass:"",id:i+1});
      }
    }
  });
}

