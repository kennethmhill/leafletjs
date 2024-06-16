var coords = [];
var markers = [];
var map;

$(document).ready(function () {
    //init map
    map = initMap();
    refresh();

    //bind click events
    $('#refresh').click(function(){
        refresh();
    });
});

function refresh(){
    removeMarkers();
    generateCoords();
    addMarkers();
    displayDetail();
}

function generateCoords() {
    var num = $('#num').val();
    for (let x = 0; x < num; x++) {
        var lat = getRandomInRange(30, 35, 3);
        var long = getRandomInRange(-90, -100, 3);
        var loc = getLocality(lat, long);
        coords[x] = [lat, long, loc];
    }
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function addMarkers() {
    $.each(coords, function (i, l) {
        var marker = L.marker([l[0], l[1]]).addTo(map);
        marker.bindPopup(`<b>${l[2]}</b><br>${l[0]}, ${l[1]}`);
        markers.push(marker);
    });
}

function removeMarkers(){
    $.each(markers, function( index, value ) {
        map.removeLayer(value);
    });
    markers = [];
}

function initMap() {
    var map = L.map('map').setView([33, -95], 6);
    //attribution
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
}

function displayDetail() {
    var html = '';
    $.each(coords, function (i, l) {
        //alert( "Index #" + i + ": " + l );
        html += '<a href="javascript:markers['+i+'].openPopup();" id="marker-'+i+'">';
        html += '<div class="location shadow">';
        html += '<h2>Marker ' + (i + 1) + '</h2>';
        html += '<div class="coordinates">';
        html += '<div><strong>Latitude:</strong> ' + l[0] + '</div>';
        html += '<div><strong>Longitude:</strong> ' + l[1] + '</div>';
        html += '</div>';
        html += '<div class="locality">';
        html += '<strong>Locality:</strong> ' + l[2];
        html += '</div>';
        html += '</div>';
        html += '</a>';
    });
    $('#detail').html(html);
}

function getLocality(lat, long) {
    var obj = $.ajax({
        type: 'GET',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`,
        //data: queryParams,
        dataType: 'HTML',
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
    var loc = JSON.parse(obj).locality;
    return loc;
}