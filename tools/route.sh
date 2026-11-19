#!/bin/bash
mkdir -p out/route
# Dixie Chicken (College Station) -> Somerville PHL Nails Creek bridge parking, and to the NE entry
curl -s "https://router.project-osrm.org/route/v1/driving/-96.3417,30.6187;-96.72413,30.27104?overview=false&steps=true" > out/route/bridge.json
curl -s "https://router.project-osrm.org/route/v1/driving/-96.3417,30.6187;-96.6961,30.2868?overview=false" > out/route/ne.json
ls -la out/route
