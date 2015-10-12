Router.route('/activity/:_id', function () {
    var currentUserId = Meteor.userId();
    var activity = Activities.findOne({_userId: currentUserId, _id: this.params._id });

    // Erstellen der Diagramme die den Puls repräsentieren
    Template.lap.rendered = function(){
        for(i = 0; i < activity.laps.length; i++){
            var track = activity.laps[i].track;
            var labels = [];
            var heartrates = [];

            for(j = 0; j < track.length; j++){
                labels.push('');
                heartrates.push(track[j].heartRate);
            }
            //um das richtige diegramm zu füllen wird der erzeugte md5-Hash als id verwendet
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

    //Helferfunktionen die gespeicherteten Daten zum Anzeigen im Template aufbereiten
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
        //Diese Funktion gibt einen md5-Hash zurück der als ID für die Diagramme verwendet wird
        md5: function(value){
            return CryptoJS.MD5(value).toString();
        }
    });

    //Funktion ruft das löschen einer Activity auf
    Template.activitydetail.events({
        'click #deleteActivity': function(){
            Meteor.call('deleteActivity', this._id);
        }
    });


});