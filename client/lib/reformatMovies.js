reformatMovies = function(obj, reorder) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            obj[prop]['originalOrder'] = prop;
            arr.push({
                'key': obj[prop]['votesSum'],
                'value': obj[prop]
            });
        }
    }


    if (reorder)
        arr.sort(function(a, b) { return b.key - a.key; });

    var reformat = [];
    for (var prop in arr)
        if (arr.hasOwnProperty(prop))
            reformat.push(arr[prop]['value']);

    var sorted = arr.sort(function(a, b) { return b.key - a.key; });
    Session.set("topTrailer", sorted[0].value.poster);

    return reformat; // returns array
}