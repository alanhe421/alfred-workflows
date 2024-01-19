import json
from pathlib import Path
import urllib.request
import os
import hashlib

home = str(Path.home())
cache_dir = os.environ['alfred_workflow_cache']

formatted_results = []

icon = {"type": "fileicon","path": "/Applications/Google Chrome.app"}

file = open(home + "/Library/Application Support/Google/Chrome/Local State", "r")
example = file.read()
file.close()

parsedJSON = json.loads(example)
profile = parsedJSON['profile']
profil = profile['info_cache']

for item in profil:
    filename = ''
    subtitle='⏎ to open in this profile'
    if 'last_downloaded_gaia_picture_url_with_size' in profil[str(item)]:
        # Avoid long paths by using a shorter hash instead of the original filename
        fname_hash = str(hashlib.md5(profil[str(item)]['last_downloaded_gaia_picture_url_with_size'].encode()).hexdigest()) + ".png"
        filename = cache_dir + '/' + fname_hash
        if not os.path.isfile(filename):
            try:
                urllib.request.urlretrieve(profil[str(item)]['last_downloaded_gaia_picture_url_with_size'], filename)
            except (urllib.error.HTTPError, ValueError) as e:
                filename = 'icon.png'
    result = {
            "title": str(profil[str(item)]['name']),
            "subtitle": subtitle,
            "arg": str(item),
            "uid": str(item),
            "icon": {
                "path": filename
            }
    }
    formatted_results.append(result)

output = {
    "items": formatted_results
}

output_json = json.dumps(output, ensure_ascii=False, indent=4)
print(output_json)
