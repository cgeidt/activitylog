Router.route('/activity/:_id', function () {
    var currentUserId = Meteor.userId();
    var activity = Activities.findOne({_userId: currentUserId, _id: this.params._id });

    Template.lap.rendered = function(){
        var track = activity.laps[0].track;
        var labels = [];
        var heartrates = [];

        for(i = 0; i < track.length; i++){
            labels.push('');
            heartrates.push(track[i].heartRate);
        }
        new Chartist.Line('#chart', {
            labels: labels,
            series: [heartrates]
        },
        {
            lineSmooth: Chartist.Interpolation.simple(),
            showPoint: false
        });

        var $chart = this.$('#chart');

    };

    this.render('activity-detail', {data: activity});



});