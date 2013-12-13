/// NY State Health Data access examples
///
///         Apache 2.0 License
///
///

window.NYStateHealthDataGlobal = (function () {

  var that = {};

  that.namespace = function(ns_string) {

    /// Writen after example from "JavaScript Patterns", pages 89-90.

    var parts = ns_string.split('.'),
        parent = NYStateHealthDataGlobal,
        i;

    // strip redundant leading global
    if (parts[0] === "NYStateHealthDataGlobal" ) {
      parts = parts.slice(1);
      }

    for (i = 0; i < parts.length; i += 1) {
      // create a property if it doesn't exist
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
        }
      // insert the property in a nested pattern
      parent = parent[parts[i]];
      }

    return parent;

    };

  that.initializeCache = function() {

    NYStateHealthDataGlobal.namespace('cache.datasets');

    };

  that.getJSON = function(uri,successFunction) {

    function clientSideUpdate() {

        if (xhr.readyState === 4) {

          var result = {};

          if (xhr.status===200) {
            result.data = JSON.parse(xhr.responseText);
            }

          result.status = xhr.status;
          result.lastModified = xhr.getResponseHeader('Last-Modified');

          successFunction(result);
          }

        }

    var xhr = new XMLHttpRequest();

    xhr.open('get',uri,true);

    xhr.onreadystatechange = clientSideUpdate;

    xhr.send(null);

    };


  that.getResource = function(resource,page) {

        page = page || 1;

        var nyhealthdata = 'https://health.data.ny.gov/resource/'

        var format = '.json'

        var uri = nyhealthdata + resource + format

        NYStateHealthDataGlobal.getJSON(uri, function (result) {

          if ( result.status === 200 ) { // OK Status

            if (result.data && result.data.length > 0) {
              // Concatenate with previous pages

              // add here accumulation, if needed...


              // Go on recursively
              NYStateHealthDataGlobal.getResource(resource, page + 1);
              }
            else {
              // Process the outcome here
              }

            }

        });
      };

  return that;

}());
