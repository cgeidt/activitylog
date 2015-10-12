/** Upload-Directory auf dem Server, kann angepasst werden */
var uploadDir = '/Uploads';
/**--------------------------------------------------------*/

Meteor.startup(function () {
    Activities = new Mongo.Collection("activities");
    //Initalisieren des UploadPackages mit entsprechenden Parametern
    UploadServer.init({
        checkCreateDirectories: true,
        maxFileSize: 10000000,
        tmpDir: uploadDir+'/tmp',
        uploadDir: uploadDir,
        finished: function (fileInfo, formFields) {
            //Das Asynchrone Node Package(TCX-Parser) wird hier Synchron aufgerufen
            var response = Async.runSync(function(done){
                //Aufruf des Node Packages zum Parsen der TCX-Dateien
                var tcxParser = Meteor.npmRequire('tcxparse');
                tcxParser.parseFile(uploadDir+fileInfo.path, function(err, tcx) {
                    done(err, tcx);
                });
            });
            //Kein Fehler beim Parsen aufgetreten?
            if(!response.err){
                var activity = parseActivity(response.result.result.TrainingCenterDatabase.Activities[0].Activity[0]);
                activity._userId = formFields._userId;
                //Einfügen der Aktivität in die DB(Server)
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