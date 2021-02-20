$(document).ready(function () {

    const map = L.map('map', {
        minZoom: 1,
        maxZoom: 15
    }).setView([0, 0], 2);
    
    L.control.scale({
        maxwidth: 300,
        imperial: false,
        metric: true,
        position: 'bottomright'
    }).addTo(map);

    L.control.coordinates({
        position: "bottomleft",
        decimals: 3,
        decimalSeperator: ",",
        labelTemplateLat: "Latitude: {y}",
        labelTemplateLng: "Longitude: {x}"
    }).addTo(map);

    const esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    const volcanoGeoJSON = './json/volcano.geojson';

    const volcanoIcon = L.icon({
        iconUrl: './images/volcano-icon.png',
        iconSize: [25, 25],
        iconAnchor: [12.5, 23],
        popupAnchor: [0, -20],
    });

    const volcano = new L.GeoJSON.AJAX([volcanoGeoJSON], {
        pointToLayer: function (geoJsonPoint, latlng) {
            let content = geoJsonPoint.properties;
            return L.marker(latlng, {
                icon: volcanoIcon,
                tooltip: {
                    html: `<span class="toolTip">${content.volcanoNam}, ${content.country}</span>`
                }
            });
        },
        onEachFeature: popUp
    }).addTo(map);

    volcano.on('click', function (e) {
        map.setView([e.latlng.lat, e.latlng.lng], 10);
        setTimeout(function () {
            $('.leaflet-popup-close-button').on('click', () => {
                map.setView([0, 0], 2);
            });
        }, 50);
    });

    // === Functions ===

    function popUp(f, l) {
        const out = [];
        if (f.properties) {
            for (key in f.properties) {
                let alias;
                switch (key) {
                    case 'volcanoNam':
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
                if (key != 'FID') {
                    out.push(alias + ": " + f.properties[key]);
                };
            }
            l.bindPopup(out.join("<br />"), {
                'className': 'popupCustom'
            });
        }
    };
});
