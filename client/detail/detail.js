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

    this.render('activitydetail', {data: activity});


    Template.lap.helpers({
        parseSpeed: function(speed){
            return Math.round(speed) + ' km/h';
        },
        parseSeconds: function(seconds){
            var hours = parseInt(seconds/3600);
            var minutes = parseInt((seconds-(hours*3600))/60);
            var seconds = parseInt(seconds-(hours*3600)-(minutes*60));

            return hours + 'h ' + minutes + 'm ' + seconds +'s';
        },
        parseDate: function(datetime){
            var date = new Date(datetime);
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            var weekDayNames = [
                "Monday", "Tuesday", "Wednesday",
                "Thursday", "Friday", "Saturday", "Sunday"
            ];

            var weekday = weekDayNames[date.getDay()];
            var day = date.getDate();
            var month = monthNames[date.getMonth()];
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            return weekday + ', ' + day + ' ' + month +' ' + year + ', ' + hours + ':' + minutes + ':' + seconds;
        }
    });

    Template.activitydetail.events({
        'click #delete': function(){
            var result = confirm("Are you sure you want to delete this activity?");
            if (result) {
                Activities.remove(this._id);
                Router.go('/');
            }
        }
    });


});