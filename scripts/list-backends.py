import json, urllib.request

with open('/Users/johnfreeman/.config/configstore/firebase-tools.json') as f:
    d = json.load(f)

token = None
for acct in d.get('additionalAccounts', []):
    if isinstance(acct, dict):
        email = acct.get('user', {}).get('email', '')
        if 'velorin' in email:
            token = acct['tokens']['access_token']
            break

PROJECT = "studio-9711986680-85356"

# List App Hosting backends
url = f"https://firebaseapphosting.googleapis.com/v1beta/projects/{PROJECT}/locations/-/backends"
req = urllib.request.Request(url)
req.add_header('Authorization', f'Bearer {token}')

try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
        backends = result.get('backends', [])
        print(f"Found {len(backends)} backends:")
        for b in backends:
            name = b.get('name', '?').split('/')[-1]
            uri = b.get('uri', 'no uri')
            domains = b.get('domains', [])
            print(f"\n  Backend: {name}")
            print(f"  URI: {uri}")
            print(f"  Domains: {len(domains)}")
            for dom in domains:
                dname = dom.get('name','?').split('/')[-1]
                dtype = dom.get('type','?')
                status = dom.get('customDomainStatus', {})
                print(f"    - {dname} ({dtype}): {status}")
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode()[:300]}")
