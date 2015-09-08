Activities = new Mongo.Collection("activities");


var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

var parseActivity = function(trainingJSON){


    var parseTrack = function(track){
        var trackPoints = [];
        for(var i in track.Trackpoint){
            trackPoints.push(
                {
                    time: track.Trackpoint[i].Time[0],
                    position: {
                        latitude: track.Trackpoint[i].Position[0].LatitudeDegrees,
                        longitude: track.Trackpoint[i].Position[0].LongitudeDegrees
                    },
                    altitude: track.Trackpoint[i].AltitudeMeters[0],
                    distance: track.Trackpoint[i].DistanceMeters[0],
                    heartRate: track.Trackpoint[i].HeartRateBpm[0].Value[0],
                    sensorState: track.Trackpoint[i].SensorState[0]
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
                totalTimeSeconds: trainingJSON.Lap[key].TotalTimeSeconds[0],
                distance: trainingJSON.Lap[key].DistanceMeters[0],
                maxSpeed: trainingJSON.Lap[key].MaximumSpeed[0],
                calories: trainingJSON.Lap[key].Calories[0],
                avgHeartRate: trainingJSON.Lap[key].AverageHeartRateBpm[0].Value[0],
                maxHeartRate: trainingJSON.Lap[key].MaximumHeartRateBpm[0].Value[0],
                intensity: trainingJSON.Lap[key].Intensity[0],
                triggerMethod: trainingJSON.Lap[key].TriggerMethod[0],
                track: parseTrack(trainingJSON.Lap[key].Track[0])
            }
        );
    };

    var date = new Date(laps[0].startTime)

    var activity = {
        sport: trainingJSON.$.Sport,
        date: date.getFullYear() + " " +monthNames[date.getMonth()],
        weekday: date.getDay(),
        laps:  laps,
        trainingName: trainingJSON.Training[0].Plan[0].Name[0],
        device: trainingJSON.Creator[0].Name[0]
    }
    return activity;
}

var uploadDir = '/Uploads';
Meteor.startup(function () {
    currentUserId = this.userId;
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