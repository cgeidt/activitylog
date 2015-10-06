var OnBeforeActions = {
    loginRequired: function(pause) {
        if (!Meteor.userId()) {
            this.render('login');
        }else{
            this.next();
        }
    }

};

Router.onBeforeAction(OnBeforeActions.loginRequired);