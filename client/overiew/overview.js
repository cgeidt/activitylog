Activities = new Mongo.Collection("activities");
Router.onBeforeAction(function() {
    if (! Meteor.userId()) {
        this.render('login');
    } else {
        this.next();
    }
});

Router.route('/', function () {
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


    var datePickerLogic = function(){
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



    this.render('overview');
});





