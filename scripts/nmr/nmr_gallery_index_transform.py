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
        if not fnt_div:
            # print(infile)
            fnt_div = infile_soup.find('body')

        # Remove unnecessary elements
        if fnt_div:
            excess_title = fnt_div.find('h3', string=re.compile(r'Structure Determination Using NMR'))
            if excess_title:
                excess_title.extract()
            # fnt_div.find('h3', string=re.compile(r'Structure Determination Using NMR')).extract()
            excess_credit = fnt_div.find('h4', string=re.compile(r'by Hans J. Reich'))
            if excess_credit:
                excess_credit.extract()
            # fnt_div.find('h4', string=re.compile(r'by Hans J. Reich')).extract()
            excess_syllabus = fnt_div.find('a', string=re.compile(r'syllabus', re.IGNORECASE))
            if excess_syllabus:
                excess_syllabus.extract()
            # fnt_div.find('a', string=re.compile(r'syllabus', re.IGNORECASE)).extract()
            [el.extract() for el in fnt_div.find_all(string=re.compile(r'TODO'))]
            [el.extract() for el in fnt_div.find_all(string=re.compile(r'old PDF'))]

            # Find '<a name="something">' tags and change its parent <p> tags to have the same 'id'
            # also, remove the '<a name="blahblah"' tag but keep it content
            wrong_a_tags = fnt_div.find_all('a', attrs={ 'name': re.compile(r'.*')})
            for tag in wrong_a_tags:
                # print(tag)
                # Create a new 'p' tag
                new_tag = infile_soup.new_tag('p')
                new_tag['id'] = tag['name']
                new_tag['class'] = 'pt-5 text-danger font-weight-bold'
                tag.wrap(new_tag)
                tag.unwrap()

                parent_b_tag = new_tag.find_parent('b')
                inside_b_tag = new_tag.find('b')

                # Remove inside <b> tag
                if inside_b_tag:
                    inside_b_tag.unwrap()
                # Remove outside <b> tag
                if parent_b_tag:
                    parent_b_tag.unwrap()

    # Remove parent 'div#fnt'
    # output = ''.join(str(tag) for tag in fnt_div.contents)
    output = str(fnt_div)

    # # Change the 'href' content into lower case
    # output = re.sub(r'(?<=<a href=\"#)(.*?)(?=\">)', lambda m: m.group(1).lower(), output)

    # Replace h2 heading
    output = output.replace('<h2>', '<h4 class="mt-3">').replace('</h2>', '</h4>')
    # Replace `<span id='fnt-2'>`
    output = output.replace('<span id="fnt2">', '<p class="pl-3">').replace('</span>', '</p>')
    # Replace `table cellpadding="0" cellspacing="0" border="0"`
    output = output.replace('table border="0" cellpadding="0" cellspacing="0"', 'table class="table table-sm table-striped small"')
    # Replace `div style="font-size: 9pt;"`
    output = output.replace('div style="font-size: 9pt;"', 'div class="table-responsive"')
    # Replace `&nbsp;&nbsp; <a`
    output = re.sub(r'\s{2}<a', '<a class="pl-2"', output)
    # Replace `&nbsp;&nbsp;&nbsp;&nbsp; <a`
    output = re.sub(r'(?<=\s{4}<a)([^>]*)pl-2', r'\1pl-4', output)
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
                           |(?<=</a>)\s*(?=<br/>)           # remove spaces and blank lines between ending a tags and `<br>`
                           |<div\sid="fnt">                  # remove the first div
                           |(</br>)*</p></div>               # this exact term at the end
                           |<spanid='fnt2'>                 # error span
                           |\.\./nmr/                       # remove '../nmr' in href
                           |(?<=<body)[^>]*                 # remove format inside body tag
                        #    |(?<=>)\d{1,2}\.\d{1,2}\s*-\s*(?=.*?<)    # Remove the number heading such as '5.00' in '5.00 - NMR experiment'
                           ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
    output = re_remove.sub(r'', output)
    output = re_remove.sub(r'', output)    # ! IMPORTANT TO RUN IT AGAIN
    # print(output)

    # Fix path for a href to "../nmr/"
    output = re.sub(r'(?<=<a href=\")\.\./nmr/', r'', output)
    # Replace "href" and remove "target"
    # output = re.sub(r'<a href=\"(?!http)([^\"]*?).htm([^\"]*).*?>', r'<a href="#\1/\2">', output)
    # re_href = re.compile(r'<a[^>]*href=\"(?!http)([^\"]*?).htm([^\"]*).*?>')
    re_href = re.compile(r'href=\"(?!http)([^\"]*?).htm([^\"]*)\"')
    output = re_href.sub(lambda m: 'href="#{}/{}"'.format(m.group(1), m.group(2).replace(' ', '_').replace(',', '')), output)
    # Add 'target="_blank" rel="noopener"' for external link
    output = re.sub(r'(<a\s*?href=\"(?:http|https)[^\"]*?\")[^>]*>', r'\1 target="_blank" rel="noopener">', output)
    # Fix path for chem605 pdf
    output = re.sub(r'(?<=<a href=\")\.\./(?=chem605)', r'', output)
    # Fix path for other pdf
    output = re.sub(r'(?<=<a href=\")(notes)', r'nmr_data/\1', output, flags=re.IGNORECASE)
    # Add some line break
    output = re.sub(r'(?<=</p>)<br/>|(?<=<br/>)\s*(?=<a)|(?<=<br>)\s*(?=<a)|(?<=</a>)(?=<p)', r'\n', output, flags=re.MULTILINE|re.UNICODE)

    # Replace '<a href="#index">Home</a>' with '<a href=".">Home</a>',
    # ! IMPORTANT: run this after converting the href above, otherwise the regex will not work
    output = re.sub(r'href=\"#index\"', r'href="."', output)

    # Replace href to all the file in 'NMR-Spectra' to 'nmr-spectra' with correct path,
    output = re.sub(r'(?<=href=\")[^\"]*NMR-Spectra([^\"]*)', r'nmr-spectra\1', output)

    # Rewrite a tags that have 'class="hover-lib" because these have tooltip with image of structure
    re_tooltip = re.compile(r'''
                            (?<=<a)[^>]*                                # only choose a tag
                            class=(?:\"|\')hover-lib(?:\"|\')           # that has 'class="hover-lib"
                            ([^>]*href=(?:\"|\').*?(?:\"|\')[^>]*)      # capture the 'href' value
                            id=(?:\"|\')(.*?)(?:\"|\')(?=>)             # capture the 'id' value for reusing
                            ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
    output = re_tooltip.sub(r'\1 data-toggle="tooltip" title="<img src='+ r"'{{ (img_url_prefix + '\2') | url }}'/>" + '"', output)

    with open(outfile, 'wb') as f_out:
        f_out.write(output.encode('utf-8'))


if __name__ == "__main__":
    indir = 'nmr_gallery_index_original'
    outdir = 'nmr_gallery_index_new'

    # htm_files = Path(indir).glob('*.htm')
    htm_files = {f.resolve() for f in Path(indir).glob('**/*') if f.suffix in ['.htm', '.html']}
    for file in htm_files:
        # print(file.stem)
        main(file, Path(outdir))
