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
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community | <a href="https://www.ngdc.noaa.gov/hazel/view/hazards/volcano/loc-data" target="_blank">National Centers for
        Environmental Information</a>`
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
                    html: `<span class="toolTip">${content.Volcano_Na}, ${content.Country}</span>`
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
                    case 'Number':
                        alias = 'Номер';
                        break;
                    case 'Volcano_Na':
                        alias = 'Название';
                        break;
                    case 'Country':
                        alias = 'Страна';
                        break;
                    case 'Location':
                        alias = 'Расположение';
                        break;
                    case 'Type':
                        alias = 'Тип';
                        break;
                    case 'Latitude':
                        alias = 'Широта (дес.гр.)';
                        break;
                    case 'Longitude':
                        alias = 'Долгота (дес.гр.)';
                        break;
                    case 'Elevation':
                        alias = 'Высота (м)';
                        break;
                    case 'Status':
                        alias = 'Статус';
                        break;
                    case 'Last_Known':
                        alias = 'Последнее извержение';
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
