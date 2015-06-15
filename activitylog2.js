Activities = new Mongo.Collection("activities");

if (Meteor.isServer) {
    Meteor.startup(function () {
        UploadServer.init({
            checkCreateDirectories: true,
            maxFileSize: 10000000,
            tmpDir: '/Uploads/tmp',
            uploadDir: '/Uploads/',
            checkCreateDirectories: true,
            finished: function (fileInfo, formFields) {
                console.log(fileInfo);
            },
            cacheTime: 100,
            mimeTypes: {
                "xml": "application/xml",
                "tcx": "application/tcx"
            }
        })
    });
}

Router.route('/', function () {
    this.layout('layout', {
        //set a data context for the whole layout
        data: {
            activities: Activities.find()
        }
    });

    // will just get the data context from layout
    this.render('activitylist');
});

Router.route('/new', function () {

    this.layout('layout', {
        //set a data context for the whole layout

    });

    // will just get the data context from layout
    this.render('newActivity');

});






