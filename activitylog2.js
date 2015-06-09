Activities = new Mongo.Collection("activities");


if(Meteor.isClient) {
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
}