if (Meteor.isClient) {
    Session.setDefault('responseBody', '');

    Template.main.helpers({
      theResult: function () {
        return Session.get("responseBody");
        console.log("final result: " + Session.get("responseBody"));
      }
    });


    Template.body.events({
      "submit .query": function (event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        var text = event.target.text.value;




          Meteor.call('getJsonForEndpoint', text, function(err,res){

             // The method call sets the Session variable to the callback value
              if (err) {
                Session.set('responseBody', {error: err});
              } else {
                Session.set('responseBody', res);

              }
          });
      }
    });
}

if (Meteor.isServer) {

  //API Call method with error handling
   var apiCall = function (apiUrl, callback) {
      // try…catch allows you to handle errors
      try {
        var response = HTTP.get(apiUrl).content;
        // A successful API call returns no error
        // but the contents from the JSON response
        callback(null, response);
      } catch (error) {
        // If the API responded with an error message and a payload
        if (error) {
          console.log(error.message)
          callback(null, error.message);
        // Otherwise use a generic error message
        } else {
          var errorCode = 500;
          var errorMessage = 'Cannot access the API';
        }
        // Create an Error object and return it via callback

      }
    }


  Meteor.methods({

    'getJsonForEndpoint': function (endpoint) {
      // variables
      var clientId = "5c2d130a-ae08-42e6-a040-eaf2736ac8b9";
      var tokenObject = "c7fc1afa-6ceb-4ee8-aba0-a44933f925af";
      var finalResult = ""
      console.log('Method.getJsonForEndpoint for');
      // Construct the API URL
      var apiUrl = 'https://graph.api.smartthings.com/api/smartapps/installations/'+ clientId + '/' + endpoint + '?access_token='+ tokenObject;
      console.log(apiUrl);


      // avoid blocking other method calls from the same client
      this.unblock();

      // asynchronous call to the dedicated API calling function
      var response = Meteor.wrapAsync(apiCall)(apiUrl);
      return response


      }

  });

}
