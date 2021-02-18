$(document).ready(function () {

    let map = L.map('map').setView([0, 0], 2);

    L.control.scale({
        maxwidth: 300,
        imperial: false,
        metric: true,
        position: 'bottomleft'
    }).addTo(map);

    let esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    let volcano = new L.GeoJSON.AJAX(['/json/volcano.geojson'],{onEachFeature:popUp}).addTo(map);

    volcano.on('click', function(e){
        map.setView([e.latlng.lat, e.latlng.lng], 4);
    });

    function popUp(f,l){
        var out = [];
        if (f.properties){
            for(key in f.properties){
                out.push(key+": "+f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
        }
    }
});