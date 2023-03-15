import json
from pathlib import Path
import urllib.request
import os

home = str(Path.home())
cache_dir = os.environ['alfred_workflow_cache']

formatted_results = []
iconURL='{"type": "fileicon","path": "/Applications/Google Chrome.app"}'

file = open(home + "/Library/Application Support/Google/Chrome/Local State", "r")
example = file.read()
file.close()

parsedJSON = json.loads(example)
profile = parsedJSON['profile']
profil = profile['info_cache']

for item in profil:
    filename = profil[str(item)]['last_downloaded_gaia_picture_url_with_size'].split("/")[-1] + ".png"
    filename = cache_dir+'/'+filename
    if not os.path.isfile(filename):
     urllib.request.urlretrieve(profil[str(item)]['last_downloaded_gaia_picture_url_with_size'], filename)

    result = {
            "title": str(profil[str(item)]['name']),
            "subtitle":"⏎ to open in this profile",
            "arg": str(item),
            "uid": str(item),
            "icon": {
            "path": filename
            }
        }
    formatted_results.append(result)


values = ','.join(str(v) for v in formatted_results)
output = '{"items": ['+ values + ']}'
output = output.replace('pic',iconURL)
output = output.replace("'",'"')
output = output.replace('"{"type"','{"type"')
output = output.replace('}"}','}}')

print(output)
