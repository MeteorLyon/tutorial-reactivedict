// Advantages of ReactiveDict : you can manage your own reactive program
// Disadvantages : with Session during HotCodeReload, your Session are stored... not your ReactiveDict !

Members = new Meteor.Collection('reactive-dict');

if (Meteor.isClient) {
  Session.setDefault('name', {1: 'session one content',  2: "session two "});

  Template.prototype.state = undefined;
  
  Template.main.onCreated(function() {
    var self = this;
    this.state = new ReactiveDict(this.viewName);
    this.state.set('name', 'benjamin');
    this.state.set('limit', 2);

    Tracker.autorun(function () {
      Meteor.subscribe('persons', self.state.get('limit'));
    });
  });

  Template.main.helpers({
    shouldChange: function () {
      return Template.instance().state.get('name');
    }
  });

  Template.main.events({
    'keyup #change-name-main': function (ev, tpl) {
	tpl.state.set('name', ev.currentTarget.value);
    },

    'click .changeLimit': function (ev, tpl) {
        console.log('click in main tpl');
        tpl.state.set('limit', _.random(1, 5));
    }
  });

  Template.test.onCreated(function() {
    var self = this;
    this.state = new ReactiveDict(this.viewName);
    this.state.set('name', 'rebolon');
    this.state.set('limit', 5);

    Tracker.autorun(function () {
      Meteor.subscribe('persons', self.state.get('limit'));
    });
  });

  Template.test.helpers({
    hehe: function() {
      return Template.instance().state.get('name');
    }
  });

  Template.test.events({
    'keyup #change-name-test': function (ev, tpl) {
        tpl.state.set('name', ev.currentTarget.value);
    },

    'click .changeLimit': function (ev, tpl) {
        console.log('click in test tpl');
        tpl.state.set('limit', _.random(1, 5));
    }
  });

  Template.session1.helpers({
    sessionVal: function() {
      return Session.get('name')[1];
    }
  });

  Template.session1.events({
    'keyup #change-name-session1': function (ev, tpl) {
	var session = Session.get('name');
        session[1] = ev.currentTarget.value;
        Session.set('name', session);
    }
  });

  Template.session2.helpers({
    sessionVal: function() {
      return Session.get('name')[2];
    }
  });

  Template.session2.events({
    'keyup #change-name-session2': function (ev, tpl) {
	var session = Session.get('name');
	session[2] = ev.currentTarget.value;
        Session.set('name', session);
    }
  });
}

if (Meteor.isServer) {
  if (Members.find().count() === 0 ) {
     for (var i = 0; i<5; i++) {
	Members.insert(Fake.user(['email', 'name']));
     }
  }

  Meteor.publish("persons", function(limit) {
    var limit = limit || 1;
    return Members.find({}, {limit: limit});
  });
}
