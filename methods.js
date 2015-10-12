//Entfernen einer Aktivität(Server und Client)
Meteor.methods({
    deleteActivity: function (activityId) {
        Activities.remove(activityId);
    }
});