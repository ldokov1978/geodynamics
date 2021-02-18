$(document).ready(function () {

    var map = L.map('map', {
        minZoom: 2,
        maxZoom: 15
    }).setView([0, 0], 3);


    L.control.scale({
        maxwidth: 300,
        imperial: false,
        metric: true,
        position: 'bottomright'
    }).addTo(map);

    var esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    var volcanoIcon = L.icon({
        iconUrl: '../images/volcano-icon.png',
        iconSize: [50, 50],
        iconAnchor: [25, 45],
        popupAnchor: [0, -40],
    });

    var volcano = new L.GeoJSON.AJAX(["../json/volcano.geojson"], {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.marker(latlng, {icon: volcanoIcon});
        },
        onEachFeature: popUp
    });

    volcano.addTo(map);

    volcano.on('click', function (e) {
        map.setView([e.latlng.lat, e.latlng.lng], 10, {
            animate: true,
            duration: 10000,
            easeLinearity: 0.25,
            noMoveStart: false
        });
    }
               
    function popUp(f, l) {
        var out = [];
        if (f.properties) {
            for (key in f.properties) {
                let alias;
                switch (key) {
                    case 'volcanoName':
                        alias = 'Название вулкана';
                    break;
                    case 'country':
                        alias = 'Страна';
                    break;
                    case 'type':
                        alias = 'Тип вулкана';
                    break;
                    case 'latitude':
                        alias = 'Широта';
                    break;
                    case 'longitude':
                        alias = 'Долгота';
                    break;
                    case 'elevation':
                        alias = 'Высота (м)';
                    break;
                };                    
                out.push(alias + ": " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"), {
                'className' : 'popupCustom'
            });
        }
    }
});
