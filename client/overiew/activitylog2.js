Activities = new Mongo.Collection("activities");

monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];
date = new Date();
stdDate = date.getFullYear() + " " +monthNames[date.getMonth()];
Session.setDefault('selected-date', stdDate);
selDate = Session.get('selected-date');
currentUserId = Meteor.userId();

Template.activitylist.helpers(
    {
        activities: function(){
            return Activities.find({_userId: currentUserId})
    }
});


Template.navi.events({
    'click #new':function(e,tmpl) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#importActivity").offset().top
        }, 600);
    }
});


Template.newActivity.helpers({
    specificFormData: function() {
        return {
            _userId: Meteor.userId()
        }
    }
});


datePickerLogic = function(){
    if(Meteor.userId()){
        this.$('#datepicker').show();
        this.$('#datepicker').datetimepicker({
            format: 'MMMM YYYY',
            dayViewHeaderFormat: 'MMMM YYYY',
            defaultDate: new Date()
        });

    }else{
        this.$('#datepicker').hide();
    }
}

Template.navi.rendered = function(){
    datePickerLogic();

}

$(function() {
    oldDate = "";
    activities = $( document).find('.activity');
    console.log(activities);
    activities.each(function(object){
        console.log("Test");
        newDate = object.attr('date');
        if(oldDate != newDate){
            $(this).before('<div class="row"><h3>'+newDate+'</h3></div>');
            oldDate = newDate;
        }
    });
});


Meteor.autorun(function(){
    datePickerLogic();
});


