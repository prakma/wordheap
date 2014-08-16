'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 urllib = require('urllib'),
 xml2js = require('xml2js'),
 Article = mongoose.model('Article'),
 _ = require('lodash');


/**
 * Find article by id
 */
 exports.article = function(req, res, next, id) {
    Article.load(id, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

/**
 * Create an article
 */
 exports.create = function(req, res) {
    var article = new Article(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the article'
            });
        }
        res.json(article);

    });
};

/**
 * Update an article
 */
 exports.update = function(req, res) {
    console.log('article update received');
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the article'
            });
        }
        res.json(article);

    });
};

/**
 * Delete an article
 */
 exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the article'
            });
        }
        res.json(article);

    });
};

/**
 * Show an article
 */
 exports.show = function(req, res) {
    res.json(req.article);
};

/**
 * List of Articles
 */
 exports.all = function(req, res) {
    Article.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the articles'
            });
        }
        res.json(articles);

    });
};

exports.fetchMeaning = function(req, res) {
    var word = req.query.word;
    var obj = {word:word, meaning:'todo - get the actual meaning'};
    var meaningXML, xmlParser, defs, def, meaning;
    urllib.request('http://services.aonaware.com/DictService/DictService.asmx/Define?word='+word, function (err, data, res2) {
        if (err) {
            throw err; // you need to handle error
        }
        // console.log(res.statusCode);
        // console.log(res.headers);
        // data is Buffer instance
        meaningXML = data.toString();
        xmlParser = new xml2js.Parser();
        xmlParser.parseString(meaningXML, function (err, result) {
            //console.dir(result);
            defs = result.WordDefinition.Definitions;
            try{
                if (defs.length > 0){
                    //console.dir(defs[0]);
                    def = defs[0].Definition;
                    if (def.length > 0){
                        meaning = def[0].WordDefinition;
                    }
                } else{
                    meaning = ['Unknown'];
                }
            } catch(e){
                meaning = ['Unknown'];
            }
                

            //console.log(def);
            //meaningJson = JSON.stringify(defs);
            //console.log('meaning', meaningJson);
            obj.meaning = meaning;
            res.json(obj);
        });

    });
    //http://services.aonaware.com/DictService/DictService.asmx/Define?word='+article.title
    
};
