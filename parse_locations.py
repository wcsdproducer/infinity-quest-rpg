import re

text = open('pdf_text_dump.txt').read()

sectors = {
    '01': 'DRY DOCK',
    '02': 'STELLAR BURN',
    '03': 'CHOP SHOP',
    '04': 'ICE BOX',
    '05': 'THE FARM',
    '06': 'CANYONHEAVY',
    '07': 'THE COURT',
    '08': 'TEMPEST CO',
    '09': 'DOPTOWN',
    '10': 'THE CHOKE'
}

for num, name in sectors.items():
    print(f"\n--- {num} {name} ---")
    safe_name = name.replace('.', '\\.')
    pattern = r"(?i)" + num + r"\.?\s+(?:THE\s+)?" + safe_name
    match = re.search(pattern, text)
    if match:
        start = match.start()
        chunk = text[start:start+4000]
        locations = re.findall(r'(?:\n|^)\s*(\d{1,2}\.\s+[A-Z\s]+)', chunk)
        for loc in locations:
            loc = loc.strip().replace('\n', ' ')
            if len(loc) < 50 and not "BODY SAVES" in loc and not "CREDSTICK" in loc:
                print(loc)
    else:
        print("Header not found")
