mapboxgl.accessToken = 'pk.eyJ1IjoibW1uaGF0IiwiYSI6ImNra3o5NHdpYTA5ajYyeW55eTc2ejlobnAifQ.qQBw5oTAA0KlC6ctu7j6zg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 9,
    center: [106.68644, 10.74401]
});
async function getProperties() {
    var url = window.location.href;
    var idproperty = url.split('/')
        // console.log(idproperty[4]);
    const res = await fetch("/admin/api/property?idproperty=" + idproperty[4] + "");
    const data = await res.json();

    const houses = data.data.map(property => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    property.location.coordinates[0],
                    property.location.coordinates[1]
                ]
            },
            properties: {
                price: property.price,
                image: property.image[0],
                description: property.description,
                Address: property.location.formattedAddress,
                icon: 'shop'
            }
        };
    });

    loadMap(houses);
}
// Load map with stores
function loadMap(houses) {
    map.on('load', function() {
        map.addSource('places', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: houses
            }
        });
        map.addLayer({
            id: 'places',
            type: 'symbol',
            source: 'places',
            layout: {
                'icon-image': '{icon}-15',
                'icon-size': 1.5,
                'text-field': '{storeId}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            }
        });
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
            var address = e.features[0].properties.Address;
            var img = e.features[0].properties.image;
            var price = e.features[0].properties.price;
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML('<img src="/img/' + img + ' " alt="" style ="max-width:100%;"> <br> <h1 style="font-size: 22px;">' + address + ' </h1> <br><p>'+description+'</p> <h4><b>'+price+'$</b>/day</h4>')
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function() {
            map.getCanvas().style.cursor = '';
        });
    });
}
getProperties();