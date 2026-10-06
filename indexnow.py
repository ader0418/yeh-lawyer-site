"""IndexNow 提交工具：python indexnow.py  → 把 sitemap.xml 裡所有網址通知 Bing/IndexNow
   python indexnow.py https://yyclaw.tw/articles/xxx.html  → 只提交指定網址"""
import re, sys, json, glob, urllib.request
HOST = 'yyclaw.tw'
KEY = open(glob.glob('*.txt')[0]).read().strip() if False else None
for f in glob.glob('*.txt'):
    if re.fullmatch(r'[0-9a-f]{32}\.txt', f):
        KEY = f[:-4]
urls = sys.argv[1:] or re.findall(r'<loc>(.*?)</loc>', open('sitemap.xml', encoding='utf-8').read())
body = json.dumps({'host': HOST, 'key': KEY, 'keyLocation': f'https://{HOST}/{KEY}.txt', 'urlList': urls}).encode()
req = urllib.request.Request('https://api.indexnow.org/indexnow', data=body, headers={'Content-Type': 'application/json; charset=utf-8'})
try:
    r = urllib.request.urlopen(req, timeout=30)
    print('IndexNow 回應:', r.status, r.reason, '| 提交網址數:', len(urls))
except urllib.error.HTTPError as e:
    print('IndexNow 錯誤:', e.code, e.reason, e.read().decode()[:300])
