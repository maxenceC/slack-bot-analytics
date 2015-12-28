Meteor.startup(function() {
   AuthHandler = new AuthorisationHandler();
});

Template.home.helpers({
    //add you helpers here
});

Template.home.events({
    'click #authorize-button': function() {
        AuthHandler.authorize('false');
    }
});

Template.home.onCreated(function () {
    //add your statement here
});

Template.home.onRendered(function () {
});

Template.home.onDestroyed(function () {
    //add your statement here
});




