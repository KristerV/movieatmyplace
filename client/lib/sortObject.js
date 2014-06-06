sortObject = function(obj) {
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
    arr.sort(function(a, b) { return b.key - a.key; });
    var reformat = [];
    for (var prop in arr)
        if (arr.hasOwnProperty(prop))
            reformat.push(arr[prop]['value']);
    return reformat; // returns array
}