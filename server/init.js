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

var parseActivity = function(trainingJSON){

    var isAvailable = function(item){
        return item != undefined;
    }

    var parseTrack = function(track){
        var trackPoints = [];
        for(var i in track.Trackpoint){
            trackPoints.push(
                {
                    time: isAvailable(track.Trackpoint[i].Time) ? track.Trackpoint[i].Time[0] : null,
                    position: isAvailable(track.Trackpoint[i].Position) ?
                    {
                        latitude: track.Trackpoint[i].Position[0].LatitudeDegrees,
                        longitude: track.Trackpoint[i].Position[0].LongitudeDegrees
                    } : null,
                    altitude: isAvailable(track.Trackpoint[i].AltitudeMeters) ? track.Trackpoint[i].AltitudeMeters[0] : null,
                    distance: isAvailable(track.Trackpoint[i].DistanceMeters) ? track.Trackpoint[i].DistanceMeters[0] : null,
                    heartRate: isAvailable(track.Trackpoint[i].HeartRateBpm) ? track.Trackpoint[i].HeartRateBpm[0].Value[0] : null,
                    sensorState: isAvailable(track.Trackpoint[i].SensorState) ? track.Trackpoint[i].SensorState[0] : null
                }
            );
        };
        return trackPoints;
    };

    var laps = [];
    for(var key in trainingJSON.Lap){
        laps.push(
            {
                startTime: trainingJSON.Lap[key].$.StartTime,
                totalTimeSeconds: isAvailable(trainingJSON.Lap[key].TotalTimeSeconds) ? trainingJSON.Lap[key].TotalTimeSeconds[0] : null,
                distance: isAvailable( trainingJSON.Lap[key].DistanceMeters) ? trainingJSON.Lap[key].DistanceMeters[0] : null,
                maxSpeed: isAvailable(trainingJSON.Lap[key].MaximumSpeed) ? trainingJSON.Lap[key].MaximumSpeed[0]: null,
                calories: isAvailable(trainingJSON.Lap[key].Calories) ? trainingJSON.Lap[key].Calories[0] : null,
                avgHeartRate: isAvailable(trainingJSON.Lap[key].AverageHeartRateBpm) ? trainingJSON.Lap[key].AverageHeartRateBpm[0].Value[0] : null,
                maxHeartRate: isAvailable(trainingJSON.Lap[key].MaximumHeartRateBpm) ? trainingJSON.Lap[key].MaximumHeartRateBpm[0].Value[0] : null,
                intensity: isAvailable(trainingJSON.Lap[key].Intensity) ? trainingJSON.Lap[key].Intensity[0] : null,
                triggerMethod: isAvailable(trainingJSON.Lap[key].TriggerMethod) ? trainingJSON.Lap[key].TriggerMethod[0] : null,
                track: isAvailable(trainingJSON.Lap[key].Track[0]) ? parseTrack(trainingJSON.Lap[key].Track[0]) : null
            }
        );
    };

    var date = new Date(laps[0].startTime)

    var activity = {
        sport: trainingJSON.$.Sport,
        date:  {
            stamp: laps[0].startTime,
            weekday: weekDayNames[date.getDay()],
            day: date.getDate(),
            month: monthNames[date.getMonth()],
            year: date.getFullYear()
        },
        laps:  laps,
        trainingName: trainingJSON.Training[0].Plan[0].Name[0],
        device: trainingJSON.Creator[0].Name[0]
    }
    return activity;
}

var uploadDir = '/Uploads';
Meteor.startup(function () {
    Activities = new Mongo.Collection("activities");
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

    var currentUserId = this.userId;
    UploadServer.init({
        checkCreateDirectories: true,
        maxFileSize: 10000000,
        tmpDir: uploadDir+'/tmp',
        uploadDir: uploadDir,
        checkCreateDirectories: true,
        finished: function (fileInfo, formFields) {
            var response = Async.runSync(function(done){
                var tcxParser = Meteor.npmRequire('tcxparse');
                tcxParser.parseFile(uploadDir+fileInfo.path, function(err, tcx) {
                    done(err, tcx);
                });
            });
            if(!response.err){
                var activity = parseActivity(response.result.result.TrainingCenterDatabase.Activities[0].Activity[0]);
                activity._userId = formFields._userId;
                Activities.insert(activity);
            }else{
                console.log(response.err);
            }
        },
        cacheTime: 100,
        mimeTypes: {
            "xml": "application/xml",
            "tcx": "application/tcx"
        }
    })
});