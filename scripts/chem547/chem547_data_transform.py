import re
from pathlib import Path

from bs4 import BeautifulSoup


def main(infile, outdir):
    # !Important to convert the outfile here, it would be changed from 'Pathlib' object
    # to IOText object after the 'with' block
    outfile = outdir / '{}.html'.format(infile.stem.replace('{', '').replace('}', '').lower())


    with open(infile, 'r') as infile:
        infile_soup = BeautifulSoup(infile.read(), 'html.parser')
        title = infile_soup.find('title')
        fnt_div = infile_soup.find('div', id='fnt')
        # print(fnt_div)
        # copyright_tag = fnt_div.find('p', string=re.compile(r'&#169;', re.UNICODE))    # does not work for some reason
        copyright_tag = fnt_div.find('p', string=re.compile(r'©', re.UNICODE))

    # print(infile_soup)

    # Remove copyright
    if copyright_tag:
        copyright_tag.decompose()

    title_line = ''
    if title:
        title_line = f"---\ntitle: '{title.text}'\n---\n"

    body = str(fnt_div)
    # print(body)

    modified_body = re.sub(r'{|}|((?<=src=\")|(?<=href=\"))(?:\d-)', r'', body)

    # Rewrite img src to include 11ty template
    re_src = re.compile(r'src="([^"]*?)"', re.UNICODE)
    modified_body = re_src.sub(lambda m: 'src="{{{{ (img_url_prefix + \'{}\') | url }}}}" class="img-fluid"'.format(m.group(1).lower()), modified_body)

    # Remove '.htm' in a href
    modified_body = re.sub(r'href="([^"]*/)([^"]*?)\.htm"', r'href="\1#\2"', modified_body)

    with open(outfile, 'w', encoding='utf-8', newline='') as fout:
        fout.write(title_line)
        fout.write(modified_body)


if __name__ == "__main__":
    indir = 'chem547_data_original'
    outdir = 'chem547_data_new'

    htm_files = Path(indir).glob('*.htm')
    # main(next(htm_files), Path(outdir))
    for file in htm_files:
        main(file, Path(outdir))

    # main(Path('chem547_data_original') / 'orgli02.htm', Path(outdir))
