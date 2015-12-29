/**
 * Created by maxencecornet on 28/12/15.
 */


FlowRouter.route('/home', {
    action: function (params, queryParams) {
        console.log("Yeah! We are on the post:", params.postId);
        BlazeLayout.render('mainLayout', { top: "header", main: "home" });
    },
    name: "home" // optional
});

FlowRouter.route('/login', {
    action: function (params, queryParams) {
        console.log("Yeah! We are on the post:", params.postId);
        //BlazeLayout.render("login");
    },
    name: "login" // optional
});



