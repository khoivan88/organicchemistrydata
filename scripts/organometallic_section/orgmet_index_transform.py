import re
from pathlib import Path

from bs4 import BeautifulSoup


def main(infile, outdir):
    # !Important to convert the outfile here, it would be changed from 'Pathlib' object
    # to IOText object after the 'with' block
    outfile = outdir / '{}.html'.format(infile.stem.split('-')[0].lower())


    with open(infile, 'r') as infile:
        infile_soup = BeautifulSoup(infile.read(), 'html.parser')
        fnt_div = infile_soup.find('div', id='fnt')
    # print(''.join(str(tag) for tag in fnt_div.contents))

    # Remove parent 'div#fnt'
    output = ''.join(str(tag) for tag in fnt_div.contents)
    # Replace the original "span" heading and add "list" component
    output = re.sub(r'<b><span.*?>(.*)</span></b>', r'<p class="lead">\1</p>\n<ol class="pl-3">', output)
    output += '</ol>'
    # Replace manual numbers with "li"
    output = re.sub(r'<br/>.*?(<a.*?</a>)', r'\t<li>\1</li>', output)
    # Replace "href" and remove "target"
    output = re.sub(r'<a href="(.*?).htm.*?>', r'<a href="#\1">', output)
    # Change the 'href' content into lower case
    output = re.sub(r'(?<=<a href=\"#)(.*?)(?=\">)', lambda m: m.group(1).lower(), output)

    # Remove curly bracket
    output = re.sub(r'{|}|(?:_chem842-\d\d-)', r'', output)
    # print(output)

    with open(outfile, 'wb') as f_out:
        f_out.write(output.encode('utf-8'))


if __name__ == "__main__":
    indir = 'orgmet_index_original'
    outdir = 'orgmet_index_new'

    htm_files = Path(indir).glob('*.htm')
    for file in htm_files:
        # print(file.stem)
        main(file, Path(outdir))
