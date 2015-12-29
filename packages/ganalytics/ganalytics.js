/**
 * Created by maxencecornet on 28/12/15.
 */

AuthorisationHandler = function () {
    this.CLIENT_ID = '693417949188-gbmvsacgshmmm026fg5iqh63hn0pvost.apps.googleusercontent.com';
    this.SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
};

AuthorisationHandler.prototype.queryAccounts = function () {
    gapi.client.load('analytics', 'v3').then(function () {

        gapi.client.analytics.management.accounts.list().then(handleAccounts);

    });

};

function handleAccounts(response) {
    // Handles the response from the accounts list method.
    if (response.result.items && response.result.items.length) {
        // Get the first Google Analytics account.
        listAccountSummaries();


        var firstAccountId = response.result.items[0].id;

        // Query for properties.
        queryProperties(firstAccountId);
    } else {
        console.log('No accounts found for this user.');
    }
}

function listAccountSummaries() {
    var request = gapi.client.analytics.management.accountSummaries.list();
    request.execute(handleResponse);
}

function handleResponse(response) {
    if (response && !response.error) {
        if (response.items) {
            console.log(response.items);
        }
    } else {
        console.log('There was an error: ' + response.message);
    }
}

function queryProperties(accountId) {
    // Get a list of all the properties for the account.
    gapi.client.analytics.management.webproperties.list(
        {'accountId': accountId})
        .then(handleProperties)
        .then(null, function(err) {
            // Log any errors.
            console.log(err);
        });
}

function handleProperties(response) {
    // Handles the response from the webproperties list method.
    if (response.result.items && response.result.items.length) {

        // Get the first Google Analytics account
        var firstAccountId = response.result.items[0].accountId;

        // Get the first property ID
        var firstPropertyId = response.result.items[0].id;

        // Query for Views (Profiles).
        queryProfiles(firstAccountId, firstPropertyId);
    } else {
        console.log('No properties found for this user.');
    }
}

function queryProfiles(accountId, propertyId) {
    // Get a list of all Views (Profiles) for the first property
    // of the first Account.
    gapi.client.analytics.management.profiles.list({
        'accountId': accountId,
        'webPropertyId': propertyId
    })
        .then(handleProfiles)
        .then(null, function(err) {
            // Log any errors.
            console.log(err);
        });
}



function handleProfiles(response) {
    // Handles the response from the profiles list method.
    if (response.result.items && response.result.items.length) {
        // Get the first View (Profile) ID.
        var firstProfileId = response.result.items[0].id;

        // Query the Core Reporting API.
        queryCoreReportingApi(firstProfileId);
    } else {
        console.log('No views (profiles) found for this user.');
    }
}


function queryCoreReportingApi(profileId) {
    // Query the Core Reporting API for the number sessions for
    // the past seven days.
    gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + profileId,
        'start-date': '7daysAgo',
        'end-date': 'today',
        'metrics': 'ga:sessions'
    })
        .then(function(response) {
            var formattedJson = JSON.stringify(response.result, null, 2);
            document.getElementById('query-output').value = formattedJson;
        })
        .then(null, function(err) {
            // Log any errors.
            console.log(err);
        });
}
AuthorisationHandler.prototype.authorize = function (event) {
    var that = this;
    // Handles the authorization flow.
    // `immediate` should be false when invoked from the button click.
    var useImmdiate = event ? false : true;
    var authData = {
        client_id: that.CLIENT_ID,
        scope: that.SCOPES,
        immediate: useImmdiate
    };

    gapi.auth.authorize(authData, function (response) {
        var authButton = document.getElementById('auth-button');
        console.log(response);
        console.log(response.error);
        if (response.error) {
            authButton.hidden = false;
        }
        else {
            authButton.hidden = true;
            that.queryAccounts();
        }
    });
};




