import json
import re

def links_to_json():
    with open('page.txt', 'r') as fin, open('links.json', 'w') as fout:
        results = []
        result = {}
        for line in fin:
            line = line.strip()
            if re.search(r'\[.*?\]', line):
                # print(line)
                extract = re.search(r'([^\[]*?)\[([^\]]*?)\]', line)
                result['links'].append({
                    'name': extract.group(1).strip(),
                    'url': extract.group(2)
                })
            else:
                results.append(result)
                result = {'title': line, 'links': []}

        results.append(result)
        fout.write(json.dumps(results, indent=4, ensure_ascii=False))


if __name__ == "__main__":
    links_to_json()
