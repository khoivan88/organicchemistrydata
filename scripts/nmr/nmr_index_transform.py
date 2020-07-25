import re
from pathlib import Path

from bs4 import BeautifulSoup, Tag


def main(infile, outdir):
    # !Important to convert the outfile here, it would be changed from 'Pathlib' object
    # to IOText object after the 'with' block
    outfile = outdir / '{}.html'.format(infile.stem.split('-')[0].lower())


    with open(infile, 'r') as infile:
        infile_soup = BeautifulSoup(infile.read(), 'html.parser')
        fnt_div = infile_soup.find('div', id='fnt')

        # Remove unnecessary elements
        fnt_div.find('h3', string=re.compile(r'Structure Determination Using NMR')).extract()
        fnt_div.find('h4', string=re.compile(r'by Hans J. Reich')).extract()
        fnt_div.find('a', string=re.compile(r'syllabus', re.IGNORECASE)).extract()
        [el.extract() for el in fnt_div.find_all(string=re.compile(r'TODO'))]
        [el.extract() for el in fnt_div.find_all(string=re.compile(r'old PDF'))]

    # print(''.join(str(tag) for tag in fnt_div.contents))

    # Remove parent 'div#fnt'
    # output = ''.join(str(tag) for tag in fnt_div.contents)
    output = str(fnt_div)

    # # Change the 'href' content into lower case
    # output = re.sub(r'(?<=<a href=\"#)(.*?)(?=\">)', lambda m: m.group(1).lower(), output)

    # Replace h2 heading
    output = output.replace('<h2>', '<h4 class="mt-3">').replace('</h2>', '</h4>')
    # Replace `<span id='fnt-2'>`
    output = output.replace('<span id="fnt2">', '<p class="pl-3">').replace('</span>', '</p>')
    # print(output)
    # Remove unnecessary parts
    re_remove = re.compile(r'''
                        #    (?<=>)[\s\t]*(?=<|\w)           # space between open tag and its content
                           |(?<=.)[\s\t]*(?=</)             # space between its content amd closing tag
                           |^\s*$                           # blank line
                           |^\s*                            # blank space at the beginning of line
                           |(?<=</h\d>)\s*<br/>               # remove `<br>` after '</h3>' or '</h4>'
                           |(?<=</p>)\s*<br/>               # remove `<br>` after `</p>`
                           |(?<=p\sclass="pl-3">)\s*<br/>   # remove `<br>` after opening `<p>`
                           |\s*target=".*?"                 # reomove any `target="..."` tags
                           |&nbsp;*                         # UNICODE blank space
                           |\n^(?=\s*\w|<su)                    # remove new lines start with word (likely original html error)
                           |(?<=</a>)\s*(?=<br/>)           # remove spaces and blank lines between ending a tags ang `<br>`
                           |<div\sid="fnt">                  # remove the first div
                           |(</br>)*</p></div>               # this exact term at the end
                           |<spanid='fnt2'>                 # error span
                        #    |(?<=>)\d{1,2}\.\d{1,2}\s*-\s*(?=.*?<)    # Remove the number heading such as '5.00' in '5.00 - NMR experiment'
                           ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
    output = re_remove.sub(r'', output)
    output = re_remove.sub(r'', output)    # ! IMPORTANT TO RUN IT AGAIN
    # print(output)

    # Replace "href" and remove "target"
    output = re.sub(r'<a href=\"(?!http)([^\"]*?).htm([^\"]*).*?>', r'<a href="#\1/\2">', output)
    # Add 'target="_blank" rel="noopener"' for external link
    output = re.sub(r'(<a\s*?href=\"(?:http|https)[^\"]*?\")[^>]*>', r'\1 target="_blank" rel="noopener">', output)
    # Fix path for chem605 pdf
    output = re.sub(r'(?<=<a href=\")\.\./(?=chem605)', r'', output)
    # Fix path for other pdf
    output = re.sub(r'(?<=<a href=\")(notes)', r'nmr_data/\1', output, flags=re.IGNORECASE)
    # Add some line break
    output = re.sub(r'(?<=</p>)<br/>|(?<=<br/>)\s*(?=<a)|(?<=<br>)\s*(?=<a)|(?<=</a>)(?=<p)', r'\n', output, flags=re.MULTILINE|re.UNICODE)

    with open(outfile, 'wb') as f_out:
        f_out.write(output.encode('utf-8'))


if __name__ == "__main__":
    indir = 'nmr_index_original'
    outdir = 'nmr_index_new'

    # htm_files = Path(indir).glob('*.htm')
    htm_files = {f.resolve() for f in Path(indir).glob('**/*') if f.suffix in ['.htm', '.html']}
    for file in htm_files:
        # print(file.stem)
        main(file, Path(outdir))
