'use strict';

var myWords = require('../controllers/mywordcontroller');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Wordlist, app, auth, database) {

    app.route('/mywords')
        .get(myWords.all)
        .post(auth.requiresLogin, myWords.create);
    app.route('/mywords/:myWordId')
        .get(myWords.show)
        .put(auth.requiresLogin, hasAuthorization, myWords.update)
        .delete(auth.requiresLogin, hasAuthorization, myWords.destroy);
    app.route('/DictService/Define')
        .get(myWords.fetchMeaning);

    app.param('myWordId', myWords.myWord);
};

// The Package is past automatically as first parameter
// module.exports = function(Wordlist, app, auth, database) {

//     app.get('/wordlist/example/anyone', function(req, res, next) {
//         res.send('Anyone can access this');
//     });

//     app.get('/wordlist/example/auth', auth.requiresLogin, function(req, res, next) {
//         res.send('Only authenticated users can access this');
//     });

//     app.get('/wordlist/example/admin', auth.requiresAdmin, function(req, res, next) {
//         res.send('Only users with Admin role can access this');
//     });

//     app.get('/wordlist/example/render', function(req, res, next) {
//         Wordlist.render('index', {
//             package: 'wordlist'
//         }, function(err, html) {
//             //Rendering a view from the Package server/views
//             res.send(html);
//         });
//     });

    
// };


