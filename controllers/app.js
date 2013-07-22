var config  = require('../config');
var fb_parser = require('fb-signed-parser');

exports.home = function(req, res){
    function out(){
        var data = fb_parser.parse(req.param('signed_request'), config.facebook.app.secret);
        data.title = config.title;
        data.facebook = {};
        data.facebook.app = {};
        data.facebook.app.id = config.facebook.app.id;
        data.like = ( data.page.liked ) ? 1 : 0;
        data.pilote = config.pilote;
        req.facebook.api('/me', function(err, user) {
            if( err ){
                res.send(err);
            }
            else{
                data.facebook.me = user;
                req.facebook.api('/me/permissions', function(err2, permissions) {
                    if(err2){
                        res.send(err2);
                    }
                    else{
                        if( permissions.data[0].publish_stream ){
                            if( data.page.liked ){
                                console.log(permissions);
                                res.render('home',{data:data});
                            }
                            else{
                                res.render('like',{data:data});
                            }
                        }
                        else{
                            res.send("<script>window.top.location = '"+req.facebook.getLoginUrl(config.facebook.app.params2)+"';</script>");
                        }
                    }
                });
            }
        });
    }
    return out();
}