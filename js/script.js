
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    var street = $("#street").val();
    var city = $("#city").val();
    var streetViewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + street + ", " + city;
    var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=111d65d59b9b452eb26f748a5bb8476a";
    var wikipediaUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";
    // load streetview
    
    $body.append("<img class='bgimg' src='" + streetViewUrl + "' />");

    // YOUR CODE GOES HERE!
    $.getJSON(nytimesUrl, function(data) {
        $nytHeaderElem.text("New York Times Articles About " + city);
        var nyarticles = data.response.docs;
        for (var i=0;i<nyarticles.length;i++) {
            var nyarticle = nyarticles[i];
            $nytElem.append("<li class='article'><a href='" + nyarticle.web_url + "'>" + nyarticle.headline.main + "</a><p>" + nyarticle.snippet + "</p></li>");

        }
    }).error(function(e) {
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed To Get Wikipedia Resources");
    }, 8000);
    $.ajax({url: wikipediaUrl, dataType: "jsonp", success: function(response) {
        var warticles = response[1];
        for (var i=0;i<warticles.length;i++) {
            var warticle = warticles[i];
            var wurl = "http://en.wikipedia.org/wiki/" + warticle;
            $wikiElem.append("<li><a href='" + wurl + "'>" + warticle + "</a></li>");
        }
        clearTimeout(wikiRequestTimeout);
    }});

    return false;
};

$('#form-container').submit(loadData);
