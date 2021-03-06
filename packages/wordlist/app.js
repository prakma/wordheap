'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Wordlist = new Module('wordlist');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Wordlist.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Wordlist.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Wordlist.menus.add({
        title: 'My List',
        link: 'words_main_page',
        roles: ['authenticated'],
        menu: 'main'
    });

    Wordlist.aggregateAsset('css', 'wordlist.css');

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Wordlist.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Wordlist.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Wordlist.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Wordlist;
});
