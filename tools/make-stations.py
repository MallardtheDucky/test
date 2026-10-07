import configparser
import json
import os
import re
import sys

AUDIO = ('.ogg', '.mp3', '.wav', '.m4a', '.flac', '.opus')
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
radio = os.path.join(base, 'radio')
stations = []

for folder in sorted(os.listdir(radio)):
    path = os.path.join(radio, folder)
    ini = os.path.join(path, 'station.ini')
    if not os.path.isdir(path) or not os.path.exists(ini):
        continue
    cfg = configparser.ConfigParser()
    cfg.read(ini)
    name = cfg.get('metadata', 'station_name', fallback=folder)
    ordered = cfg.getboolean('metadata', 'ordered', fallback=False)
    files = sorted(f for f in os.listdir(path) if f.lower().endswith(AUDIO))
    if not files:
        continue
    tracks = []
    for f in files:
        raw = os.path.splitext(f)[0].split('mus_')[-1]
        raw = re.sub(r'^(radio_)?(diamond|institute|minutemen|magnolia)_', '', raw)
        raw = re.sub(r'_(mix|radio)$', '', raw)
        title = raw.replace('_', ' ').replace('-', ' ').title()
        tracks.append({'title': title, 'file': 'radio/%s/%s' % (folder, f)})
    stations.append({'name': name, 'ordered': ordered, 'tracks': tracks})

with open(os.path.join(radio, 'stations.json'), 'w', encoding='utf-8') as out:
    json.dump(stations, out, indent=1)

print('Wrote %d stations, %d tracks' % (len(stations), sum(len(s['tracks']) for s in stations)))
sys.exit(0)
