Router.route('/activity/:_id', function () {
    var currentUserId = Meteor.userId();
    var activity = Activities.findOne({_userId: currentUserId, _id: this.params._id });
    var track = activity.laps[0].track;
    var labels = [];
    var heartrates = [];

    var amountOfLabels = 10;

    var printLabelEveryNthPoint = parseInt(track.length/amountOfLabels);

    for(i = 0; i < track.length; i++){

        if(i == 0 || printLabelEveryNthPoint % i == 0){
            labels.push(i);
        }else{
            labels.push('');
        }

        heartrates.push(track[i].heartRate);
    }

    Template.lap.rendered = function(){
        new Chartist.Line('#chart', {
            labels: labels,
            series: [
                {
                    name: 'Heartrate',
                    data: heartrates
                }
            ],
            axisX: {
                offset: 20,
                scaleMinSpace:amountOfLabels
            }
        },
        {
            lineSmooth: Chartist.Interpolation.simple(),
            showPoint: false,
            axisX: {
                offset: 20,
                scaleMinSpace:amountOfLabels
            }
        });

        var $chart = this.$('#chart');

    };

    this.render('activity-detail', {data: activity});



});