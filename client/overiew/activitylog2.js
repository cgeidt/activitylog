Activities = new Mongo.Collection("activities");


Router.route('/', function () {

    var currentUserId = Meteor.userId();
    this.layout('layout', {
        //set a data context for the whole layout
        data: {
            activities: Activities.find({_userId: currentUserId})
        }
    });

    // will just get the data context from layout
    this.render('activitylist');
});

Template.navi.events({
    'click #new':function(e,tmpl) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#importActivity").offset().top
        }, 600);
    }
});

Template.newActivity.helpers({
    specificFormData: function() {
        return {
            _userId: Meteor.userId()
        }
    }
});


Router.route('/activity', function () {

});

