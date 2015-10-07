Router.route('/activity/:_id', function () {
    var currentUserId = Meteor.userId();
    var activity = Activities.findOne({_userId: currentUserId, _id: this.params._id });

    Template.lap.rendered = function(){
        for(i = 0; i < activity.laps.length; i++){
            var track = activity.laps[i].track;
            var labels = [];
            var heartrates = [];

            for(j = 0; j < track.length; j++){
                labels.push('');
                heartrates.push(track[j].heartRate);
            }
            new Chartist.Line('#chart_'+CryptoJS.MD5(activity.laps[i].startTime).toString(), {
                    labels: labels,
                    series: [heartrates]
                },
                {
                    lineSmooth: Chartist.Interpolation.simple(),
                    showPoint: false
                });


        }

    };

    this.render('activitydetail', {data: activity});

    Template.lap.helpers({
        parseSpeed: function(speed){
            return Math.round(speed) + ' km/h';
        },
        parseSeconds: function(sec){
            var hours = parseInt(sec/3600);
            var minutes = parseInt((sec-(hours*3600))/60);
            var seconds = parseInt(sec-(hours*3600)-(minutes*60));

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

            var fillWithZeroes = function(value){
                if (value < 10){
                    value = '0' + value;
                }
                return value;
            };
            var weekday = weekDayNames[date.getDay()];
            var day = date.getDate();
            var month = monthNames[date.getMonth()];
            var year = date.getFullYear();
            var hours = fillWithZeroes(date.getHours());
            var minutes = fillWithZeroes(date.getMinutes());
            var seconds = fillWithZeroes(date.getSeconds());
            return weekday + ', ' + day + ' ' + month +' ' + year + ', ' + hours + ':' + minutes + ':' + seconds;
        },
        md5: function(value){
            return CryptoJS.MD5(value).toString();
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