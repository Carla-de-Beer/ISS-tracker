# ISS Tracker

A real-time 2D tracker for the International Space Station. The tracker displays the following data:

- The current position of the ISS.
- The satellite's trajectory since the session started.
- The satellite's footprint.
- Some additional statistics.
- An indication as to whether the satellite is `visible`, `eclipsed` or observable in `daylight`.

Based on Daniel Shiffman's Coding Train video example: https://www.youtube.com/watch?v=uxf0--uiX0I

Resources:

- ISS coordinates: https://wheretheiss.at/w/developer
- Map API: https://leafletjs.com/reference-1.5.0.html#polyline
- Map tiles: https://www.openstreetmap.org
- Earth shadow Leaflet plugin: https://unpkg.com/browse/@joergdietrich/leaflet.terminator@1.0.0/
- ISS image: https://commons.wikimedia.org/wiki/File:International_Space_Station.svg

## Links

The website can be viewed via the following URL: https://carla-de-beer.github.io/ISS-tracker/

<p align="center">
  <img src="images/screenShot-04.png"/>
  <img src="images/screenShot-01.png"/>
  <img src="images/screenShot-02.png"/>
</p>

NOTE: The API is rate-limited, meaning that there are times when it can't respond due to too many requests. In this case, an error message is shown inside the tooltip.

<p align="center">
    <img src="images/screenShot-05.png" width="450px"/>
</p>
<p align="center">
    <img src="images/screenShot-03.png"/>
</p>
