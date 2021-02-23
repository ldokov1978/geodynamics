$(document).ready(function () {

    // === Карта ===
    const map = L.map('map', {
        minZoom: 1, // Минимальный Zoom
        maxZoom: 15 // Максимальный Zoom
    }).setView([0, 0], 2); // Цетр карты при загрузке и 2 уровень

    // Масштабная линейка
    L.control.scale({
        maxwidth: 300, // Максимальная ширина окна
        imperial: false,
        metric: true, // Метрические единицы
        position: 'bottomright' // Правый нижний угол
    }).addTo(map);

    // Положение курсора (координаты)
    L.control.coordinates({
        position: "bottomleft", // левый нижний угол
        decimals: 3, // три знака после запятой
        decimalSeperator: ",", // разделитель
        labelTemplateLat: "Latitude (широта): {y}",
        labelTemplateLng: "Longitude (долгота): {x}"
    }).addTo(map);

    // Загрузка базовой карты ArcGIS Imagery
    const esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community | <a href="https://www.ngdc.noaa.gov/hazel/view/hazards/volcano/loc-data" target="_blank">National Centers for
        Environmental Information</a>`
    }).addTo(map);

    // Загрузка файла JSON
    const requestURL = './json/volcano.geojson';
    const request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = main;

    function main() {
        let volcanoGeoJSON = request.response;

        // Маркер вулкана
        const volcanoIcon = L.icon({
            iconUrl: './images/volcano-icon.png',
            iconSize: [25, 25],
            iconAnchor: [12.5, 23],
            popupAnchor: [0, -20],
        });

        // Загрузка geoJSON в карту + icon + popup + tooltip 
        const volcano = L.geoJSON(volcanoGeoJSON, {
            pointToLayer: function (geoJsonPoint, feature) {
                let latlng = [feature.lat, feature.lng];
                return L.marker(latlng, {
                    icon: volcanoIcon,
                }).bindTooltip(`<span>${geoJsonPoint.properties.Volcano_Na}, ${geoJsonPoint.properties.Country}</span>`, {
                    offset: [0, -25],
                    direction: 'top',
                    permanent: false,
                    className: 'leaflet-tooltip-container',
                }).openTooltip()
            },
            onEachFeature: markerPopup, // PopUp с информацией
            //filter: markerFilter
        }).addTo(map);

        // console.log(volcano);

        // Клик по маркеру
        volcano.on('click', function (e) {
            map.setView([e.latlng.lat, e.latlng.lng], 10);
            setTimeout(function () {
                $('.leaflet-popup-close-button').on('click', () => {
                    map.setView([0, 0], 2);
                });
            }, 50);
        });

        //Функция вывода данных PopUp
        function markerPopup(feature, layer) {
            const out = [];
            if (feature.properties) {
                for (key in feature.properties) {
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
                        out.push(alias + ": " + feature.properties[key]);
                    };
                }
                layer.bindPopup(out.join("<br />"), {
                    'className': 'popupCustom'
                });
            }
        };

        // // Функция фильтрации
        // function markerFilter(feature) {
        //     if (feature.properties.Country === 'Russia') {
        //         return true
        //     };
        // };

        // // Функция получения уникальных значений
        // function reciveUnque(objects, propName) {
        //     let objectsList = [];
        //     let objectsAll = objects._layers;
        //     for (key in objectsAll) {
        //         objectsList.push(objectsAll[key].feature.properties[propName]);
        //     };
        //     let uniqObjects = ([...new Set(objectsList)]).sort();
        //     return uniqObjects
        // };
        //console.log (reciveUnque(volcano, 'Country'));
        //console.log (reciveUnque(volcano, 'Volcano_Na'));
    };
});