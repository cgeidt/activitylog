Router.route('/activity/:_id', function () {
    var currentUserId = Meteor.userId();
    var activity = Activities.findOne({_userId: currentUserId, _id: this.params._id });
    this.render('activity-detail', {data: activity});
});