'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 urllib = require('urllib'),
 xml2js = require('xml2js'),
 MyWord = mongoose.model('MyWord'),
 _ = require('lodash');



 exports.myWord = function(req, res, next, id) {
    console.log('manoj - ',req.method, 'id', id);
    MyWord.load(id, function(err, myWord) {
        if (err) return next(err);
        if (!myWord) return next(new Error('Failed to load myWord ' + id));
        req.myWord = myWord;
        next();
    });
};

 exports.create = function(req, res) {
    var myWord = new MyWord(req.body);
    myWord.user = req.user;

    myWord.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the word'
            });
        }
        res.json(myWord);

    });
};


 exports.update = function(req, res) {
    console.log(' my word, received the put ');
    var myWord = req.myWord;

    myWord = _.extend(myWord, req.body);

    myWord.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the myWord'
            });
        }
        res.json(myWord);

    });
};


 exports.destroy = function(req, res) {
    var myWord = req.myWord;

    myWord.remove(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the myWord'
            });
        }
        res.json(myWord);

    });
};


 exports.show = function(req, res) {
    res.json(req.myWord);
};


 exports.all = function(req, res) {
    MyWord.find({ 'user': req.user }).sort('-created').populate('user', 'name username').exec(function(err, mywords) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the mywords'
            });
        }
        res.json(mywords);

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

exports.fetchMeaning2 = function(req, res) {
    var word = req.query.word;
    var obj = {word:word, meaning:'todo - get the actual meaning'};
    var meaningXML, xmlParser, defs, def, meaning;
    urllib.request('http://oaadonline.oxfordlearnersdictionaries.com/dictionary/'+word, function (err, data, res2) {
        if (err) {
            console.log('error while accessing dictionary ', word, err); // you need to handle error
            meaning = 'Unknown';
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
