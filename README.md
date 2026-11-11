# PublicScout

Free public-land hunting map. Live: https://austinheflin-star.github.io/hunt-atlas/

- `index.html` is the built app (what the site serves).
- `src/app.html` + `src/data.js` are the source; `src/build.py` joins them into `index.html`.
- `tools/loadtest.js` opens the built page on an emulated phone and fails on any page error. It runs before every deploy (`src/deploy.sh`).
- `data/` holds area rules and state guides; `img/` holds word-guide pictures.
