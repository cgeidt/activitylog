Activities = new Mongo.Collection("activities");

Router.route('/', function () {

    this.layout('layout', {
        //set a data context for the whole layout
        data: {
            activities: Activities.find()
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

Router.route('/activity', function () {

});