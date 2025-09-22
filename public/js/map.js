mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/standard',
  center: listing.geometry.coordinates, 
  zoom: 8
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h3>${listing.title}</h3><p>Full location after Booking</p>`
);

// Range element (circle)
const rng = document.createElement('div');
rng.style.width = '150px';
rng.style.height = '150px';
rng.style.border = '2px solid aqua';
rng.style.borderRadius = '50%';
rng.style.border = '2px solid rgb(6, 200, 225)';
rng.style.backgroundColor = 'rgba(34, 212, 231, 0.36)';
rng.style.position = 'relative';
rng.style.display = 'flex';
rng.style.alignItems = 'center';
rng.style.justifyContent = 'center';
rng.style.cursor = 'pointer'; // show hover works

// Marker element (dot + icon)
const el = document.createElement('div');
el.style.width = '30px';
el.style.height = '30px';
el.style.backgroundColor = 'rgb(6, 200, 225)';
el.style.borderRadius = '50%';
el.style.border = '2px solid white';
el.style.backgroundImage = "url('/images/home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png')";
el.style.backgroundImage = "url('/images/home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png')";
el.style.backgroundSize = '70%';
el.style.backgroundRepeat = 'no-repeat';
el.style.backgroundPosition = 'center';

// Append marker inside range
rng.appendChild(el);

// Add marker to map
new mapboxgl.Marker(rng)
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);

// --- Hover swap ---
rng.addEventListener('mouseenter', () => {
  el.style.backgroundImage = "url('/images/logopngW.png')";
});
rng.addEventListener('mouseleave', () => {
  el.style.backgroundImage = "url('/images/home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png')";
});

