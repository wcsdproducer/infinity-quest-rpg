import json, urllib.request

# Load token
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
REGION = "us-central1"
SERVICE = "infinity-quest-rpg"

url = f"https://run.googleapis.com/v2/projects/{PROJECT}/locations/{REGION}/services/{SERVICE}:setIamPolicy"

body = json.dumps({
    "policy": {
        "bindings": [
            {"role": "roles/run.invoker", "members": ["allUsers"]}
        ]
    }
}).encode()

req = urllib.request.Request(url, data=body, method='POST')
req.add_header('Authorization', f'Bearer {token}')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
        print("SUCCESS - Public access granted")
        for b in result.get('bindings', []):
            print(f"  {b.get('role')}: {b.get('members')}")
except urllib.error.HTTPError as e:
    body = e.read()
    print(f"Error {e.code}: {body.decode()[:300]}")
