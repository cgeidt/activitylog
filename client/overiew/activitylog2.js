Activities = new Mongo.Collection("activities");

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
        $('#datepicker').show();
        $('#datepicker').datetimepicker({
            format: 'MMMM YYYY',
            dayViewHeaderFormat: 'MMMM YYYY',
            defaultDate: new Date()
        });
        $('#datepicker').on("dp.change", function (e) {
            foundItems = $('div[date="'+e.date._i+'"]');
            console.log($(foundItems).first());
            if(foundItems.length){
                $('html, body').animate({
                    scrollTop: $(foundItems).first().offset().top
                }, 600);
            }
        });

    }else{
        this.$('#datepicker').hide();
    }
}

Template.navi.rendered = function(){
    datePickerLogic();
}




Meteor.autorun(function(){
    datePickerLogic();
});


