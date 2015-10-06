Router.route('/activity/:_id', function () {
    var currentUserId = Meteor.userId();
    var activity = Activities.findOne({_userId: currentUserId, _id: this.params._id });
    var track = activity.laps[0].track;
    var labels = [];
    var heartrates = [];

    for(i = 0; i < track.length; i++){
        labels.push(i);
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
                type: Chartist.AutoScaleAxis,
                onlyInteger: true
            }
        });

        var $chart = this.$('#chart');

        var $toolTip = $chart
            .append('<div class="chart-tooltip"></div>')
            .find('.chart-tooltip')
            .hide();


        $chart.on('mouseenter', '.ct-point', function() {
            var $point = $(this),
                value = $point.attr('ct:value'),
                seriesName = $point.parent().attr('ct:series-name');
            $toolTip.html(seriesName + '<br>' + value).show();
        });

        $chart.on('mouseleave', '.ct-point', function() {
            $toolTip.hide();
        });

        $chart.on('mousemove', function(event) {
            $toolTip.css({
                left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
                top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
            });
        });

    };

    this.render('activity-detail', {data: activity});



});