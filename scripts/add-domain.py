import json, urllib.request, urllib.error

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
BACKEND = "studio"
DOMAIN = "infinityquestrpg.com"

# Add custom domain to App Hosting backend
# First try root domain
url = f"https://firebaseapphosting.googleapis.com/v1beta/projects/{PROJECT}/locations/us-central1/backends/{BACKEND}/domains?domainId={DOMAIN}"

body = json.dumps({
    "name": f"projects/{PROJECT}/locations/us-central1/backends/{BACKEND}/domains/{DOMAIN}",
    "type": "CUSTOM"
}).encode()

req = urllib.request.Request(url, data=body, method='POST')
req.add_header('Authorization', f'Bearer {token}')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
        print("Domain added successfully!")
        print(json.dumps(result, indent=2)[:1000])
except urllib.error.HTTPError as e:
    err_body = e.read().decode()
    print(f"Error {e.code}: {err_body[:500]}")
