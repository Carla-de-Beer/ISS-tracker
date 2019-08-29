// Carla de Beer
// August 2019
// A real-time tracker for the ISS.
// Based on Daniel Shiffman's Coding Train video example: https://www.youtube.com/watch?v=uxf0--uiX0I
// ISS coordinates: https://api.wheretheiss.at/v1/satellites/25544/
// Map API: https://leafletjs.com/reference-1.5.0.html#polyline
// Map tiles: https://www.openstreetmap.org
// Earth shadow Leaflet plugin: https://unpkg.com/browse/@joergdietrich/leaflet.terminator@1.0.0/
// ISS image: https://commons.wikimedia.org/wiki/File:International_Space_Station.svg

let latlngs = [];
const zoom = 4;
let firstTime = true;
const url = "https://api.wheretheiss.at/v1/satellites/25544/";
const attribution =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const tile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const worldMap = drawMap();
const marker = drawMapMarker();
const footprintMarker = drawFootprintMarker();

centreMap();
drawMapShadow();

setInterval(getISS, 1000);

setTimeout(() => {
  marker.closeTooltip();
}, 2000);

marker
  .bindTooltip("<p>Loading data ...</p>", {
    opacity: 0.8,
    offset: L.point(0, 0)
  })
  .openTooltip();

async function getISS() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const {
      id,
      latitude,
      longitude,
      footprint,
      altitude,
      velocity,
      timestamp,
      visibility
    } = data;

    const latLng = [latitude, longitude];

    if (firstTime) {
      worldMap.setView(latLng, zoom);
      firstTime = false;
    }

    marker.setLatLng(latLng);
    footprintMarker.setLatLng(latLng);
    footprintMarker.setRadius(footprint * 1000);

    const date = new Date(0);
    date.setUTCSeconds(timestamp);

    const issId = `<strong>ISS id</strong>: ${id}`;
    const latText = `<strong>latitude</strong>: ${latitude.toFixed(3)}°`;
    const lonText = `<strong>longitude</strong>: ${longitude.toFixed(3)}°`;
    const altText = `<strong>altitude</strong>: ${altitude.toFixed(3)} km`;
    const velText = `<strong>velocity</strong>: ${convertToCommaString(
      parseInt(velocity)
    )} km/h`;
    const dateText = `${formatDate(date)}`;
    let visibilityIcon = "";

    if (visibility.toLowerCase() === "eclipsed") {
      visibilityIcon = '<span style="font-size: 20px">&#127761;</span>';
    } else if (visibility.toLowerCase() === "daylight") {
      visibilityIcon = '<span style="font-size: 20px">&#127765;</span>';
    } else if (visibility.toLowerCase() === "visible") {
      visibilityIcon = '<span style="font-size: 20px">&#127763;</span>';
    }

    marker.setTooltipContent(
      "<p>" +
        visibilityIcon +
        "</br>" +
        issId +
        "</br>" +
        latText +
        "</br>" +
        lonText +
        "</br>" +
        altText +
        "</br>" +
        velText +
        "</br></br>" +
        dateText +
        "</p>"
    );

    latlngs.push(latLng);
    if (latlngs.length > 1) {
      L.polyline(latlngs, {
        color: "#ff4040",
        weight: 2
      }).addTo(worldMap);
    }
  } catch (error) {
    marker.setTooltipContent(
      '<p><span style="font-size: 20px">&#9201;</span></br>There are too many data requests at present.</br>Try again later.</p>'
    );
  }
}

function drawMap() {
  const worldMap = L.map("issMap").setView([0, 0], zoom);
  L.tileLayer(tile, {
    maxZoom: 25,
    minZoom: 1.8,
    attribution: attribution
  }).addTo(worldMap);
  return worldMap;
}

function centreMap() {
  let width = 1050;
  let mapDiv = document.getElementById("issMap");

  if (navigator.userAgent.match(/iPhone|iPad/i) !== null) {
    if (navigator.userAgent.match(/iPhone/i) !== null) {
      mapDiv.style.width = window.innerWidth - 60 + "px";
      mapDiv.style.height = window.innerHeight - 80 + "px";
      mapDiv.style.marginTop = "15px";
    } else {
      mapDiv.style.marginTop = "35px";
      mapDiv.style.width = window.innerWidth - 60 + "px";
      if (window.innerHeight < window.innerWidth) {
        mapDiv.style.height = window.innerHeight - 130 + "px";
      }
    }
  } else {
    mapDiv.style.width = width + "px";
    mapDiv.style.left = (window.innerWidth - width - 60) * 0.5 + "px";
    mapDiv.style.marginTop = "35px";
  }
}

function drawMapShadow() {
  const shadowLine = L.terminator({
    fillOpacity: "0.12"
  });
  shadowLine.addTo(worldMap);
  setInterval(() => {
    updateTerminator(shadowLine);
  }, 10000);

  function updateTerminator(t) {
    var t2 = L.terminator();
    t.setLatLngs(t2.getLatLngs());
    t.redraw();
  }
}

function drawMapMarker() {
  const issIcon = L.icon({
    iconUrl: "resources/iss200.png",
    iconSize: [50, 32],
    iconAnchor: [25, 16]
  });

  return L.marker([0, 0], {
    icon: issIcon
  }).addTo(worldMap);
}

function drawFootprintMarker() {
  return L.circle([0, 0], {
    radius: 4500 * 1000,
    stroke: true,
    color: "#3388ff",
    weight: 1
  }).addTo(worldMap);
}

function formatDate(date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const zone = date
    .toLocaleTimeString("en-us", {
      timeZoneName: "short"
    })
    .split(" ")[2];

  return (
    '<span style="font-size: 12px">' +
    day +
    " " +
    monthNames[monthIndex] +
    " " +
    year +
    " " +
    "</br>" +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    " " +
    zone +
    "</span>"
  );
}

function convertToCommaString(value) {
  String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };

  let resString = value.toString();
  if (value >= 1000) {
    if (value >= 1000 && value < 10000) {
      resString = resString.splice(1, 0, ",");
    } else if (value >= 10000) {
      resString = resString.splice(2, 0, ",");
    }
  }
  return resString;
}
