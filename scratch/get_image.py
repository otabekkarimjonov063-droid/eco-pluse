import urllib.request
import re

url = "https://elitebike.ua/v-centre-vnimaniya-populyarnyj-eko-transport-seev-citycoco"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'<img[^>]+src=["\'](.*?)["\']', html)
    print("\n".join(images))
except Exception as e:
    print(e)
