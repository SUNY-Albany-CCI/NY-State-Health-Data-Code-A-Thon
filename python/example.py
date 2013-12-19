#!/usr/bin/env python

import sys
import requests

# r = requests.get('https://health.data.ny.gov/resource/child-and-adult-care-food-program-participation-beginning-2007.json?recall_id=94', headers={'X-App-Token': sys.argv[1]})
r = requests.get('https://health.data.ny.gov/resource/child-and-adult-care-food-program-participation-beginning-2007.json?', headers={})

print r.status_code
print r.text
