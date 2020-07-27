import re
from pathlib import Path

from bs4 import BeautifulSoup


def main(infile, outdir):
    # !Important to convert the outfile here, it would be changed from 'Pathlib' object
    # to IOText object after the 'with' block
    outfile = outdir / '{}.html'.format(infile.stem.replace('{', '').replace('}', '').lower())

    copyright_tag = ''
    with open(infile, 'r', encoding='utf-8') as infile:
        infile_soup = BeautifulSoup(infile.read(), 'html.parser')
        title = infile_soup.find('title')
        fnt_div = infile_soup.find('div', id='fnt')
        if not fnt_div:
            # print(infile)
            fnt_div = infile_soup.find('body')

        if fnt_div:    # incase there is no 'body'
            # print(infile)

            # copyright_tag = fnt_div.find('p', string=re.compile(r'&#169;', re.UNICODE))    # does not work for some reason
            # copyright_tag = fnt_div.find('span', string=re.compile(r'©', re.UNICODE))
            # copyright_tag = fnt_div.find_all('p', string=re.compile(r'copyright', re.IGNORECASE))
            ''' ! other selections for copyright do not work. Right now, use: '<p align=right>'
            to select copyright block. Be careful with pages that has this '<p align=right>' '''
            copyright_tag = fnt_div.find('p', attrs={'align': 'right'})

            # Find '<a name="something">' tags and change its parent <p> tags to have the same 'id'
            # also, remove the '<a name="blahblah"' tag but keep it content
            wrong_a_tags = fnt_div.find_all('a', attrs={ 'name': re.compile(r'.*')})
            for tag in wrong_a_tags:
                # Get the most adjacent 'p' tag
                parent_p_tag = tag.find_parent('p')
                new_content = parent_p_tag.get_text()

                # For those heading containing '<span style="font-size:12pt; color:#B6120A;">, replace with <h5> tag. Note: could be different color,
                if tag.find_parent('span', attrs={ 'style': re.compile(r'color')}):
                    new_tag = infile_soup.new_tag('h5')
                    # Put the id into it parent p tag
                    new_tag['id'] = tag['name']
                    # Add Bootstrap 4 format class
                    new_tag['class'] = 'pt-5 text-danger font-weight-bold'
                    new_tag.append(new_content)
                    parent_p_tag.replace_with(new_tag)

                # Else keep the same p tag but simplify it
                else:
                    # Put the id into it parent p tag
                    parent_p_tag['id'] = tag['name']
                    tag.unwrap()
                    # # Add Bootstrap 4 format class
                    # parent_p_tag['class'] = 'lead text-danger font-weight-bold'
                    # # Get the text inside the <p> tags and strip of all format tags
                    # parent_p_tag.clear()
                    # parent_p_tag.append(new_content)

                # print(parent_p_tag)

    # print(infile_soup)

    try:
        # Remove copyright
        if copyright_tag:
            copyright_tag.decompose()

        title_line = ''
        if title:
            title_line = '---\ntitle: "{}"\n---\n'.format(title.text)

        body = str(fnt_div)
        # body = ''.join(str(el) for el in fnt_div.contents)
        # print(body)

        # Replace `<span id='fnt-2'>`
        body = body.replace('<blockquote>', '<p class="pl-3">').replace('</blockquote>', '</p>')
        modified_body = re.sub(r'{|}|((?<=src=\")|(?<=href=\"))(?:\d-)', r'', body)

        # Rewrite img src to include 11ty template
        re_src = re.compile(r'src="([^"]*?)"', re.UNICODE)
        modified_body = re_src.sub(lambda m: 'src="{{{{ (img_url_prefix + \'{}\') | url }}}}" class="img-fluid"'.format(m.group(1).lower()), modified_body)

        # Remove unnecessary parts
        re_remove = re.compile(r'''
                            #    (?<=>)[\s\t]*(?=<|\w)           # space between open tag and its content
                            # |(?<=.)[\s\t]*(?=</)             # space between its content amd closing tag
                            # |^\s*$                           # blank line
                            # |^\s*                            # blank space at the beginning of line
                            # |(?<=</p>)\s*<br/>               # remove `<br>` after `</p>`
                            # |(?<=p\sclass="pl-3">)\s*<br/>   # remove `<br>` after opening `<p>`
                            |\s*target=".*?"                 # remove any `target="..."` tags
                            |&nbsp;*                         # UNICODE blank space
                            |(?<=img)\s*border="1"           # remove 'border="1"' for img tags
                            # |\n^(?=\s*\w|<su)                    # remove new lines start with word (likely original html error)
                            # |(?<=</a>)\s*(?=<br/>)           # remove spaces and blank lines between ending a tags ang `<br>`
                            # |<div\sid="fnt">                  # remove the first div
                            # |(</br>)*</p></div>               # this exact term at the end
                            # |<spanid='fnt2'>                 # error span
                            # |(?<=>)\d{1,2}\.\d{1,2}\s*-\s*(?=.*?<)    # Remove the number heading such as '5.00' in '5.00 - NMR experiment'
                            ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
        modified_body = re_remove.sub(r'', modified_body)

        # Remove '.htm' in a href and add '#' in href;
        # Also add ' onclick="location.reload()"' so that it goes to these links
        modified_body = re.sub(r'href=\"(?!http)([^\"]*?)\.htm([^\"]*?)\"',
                                r'href="#\1\2" onclick="window.scrollTo(0,0); setTimeout(location.reload.bind(location), 1)"',
                                modified_body)

        # Add 'target="_blank" rel="noopener"' for external link
        modified_body = re.sub(r'(<a\s*?href=\"(?:http|https)[^\"]*?\")[^>]*>', r'\1 target="_blank" rel="noopener">', modified_body)
        # Fix path for chem605 pdf
        modified_body = re.sub(r'(?<=<a href=\")\.\./(?=chem605)', r'', modified_body)
        # Fix path for other pdf
        modified_body = re.sub(r'(?<=<a href=\")(notes)', r'nmr_data/\1', modified_body, flags=re.IGNORECASE)

        # Replace '<a href="#index">Home</a>' with '<a href=".">Home</a>',
        # ! IMPORTANT: run this after converting the href above, otherwise the regex will not work
        modified_body = re.sub(r'href=\"#index\"', r'href="."', modified_body)

        # Replace href to all the file in 'NMR-Spectra' to 'nmr-spectra' with correct path,
        modified_body = re.sub(r'(?<=href=\")[^\"]*NMR-Spectra([^\"]*)', r'nmr-spectra\1', modified_body)

        # Rewrite a tags that have 'class="hover-lib" because these have tooltip with image of structure
        re_tooltip = re.compile(r'''
                                (?<=<a)[^>]*                                # only choose a tag
                                class=(?:\"|\')hover-lib(?:\"|\')           # that has 'class="hover-lib"
                                ([^>]*href=(?:\"|\').*?(?:\"|\')[^>]*)      # capture the 'href' value
                                id=(?:\"|\')(.*?)(?:\"|\')(?=>)             # capture the 'id' value for reusing
                                ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
        modified_body = re_tooltip.sub(r'\1 data-toggle="tooltip" title="<img src='+ r"'{{ (img_url_prefix + '\2') | url }}'/>" + '"', modified_body)

        with open(outfile, 'w', encoding='utf-8', newline='') as fout:
            fout.write(title_line)
            fout.write(modified_body)

    except Exception as e:
        print(infile)
        print(e)


if __name__ == "__main__":
    indir = 'nmr_data_original'
    outdir = 'nmr_data_new'

    # htm_files = Path(indir).glob('*.htm')
    htm_files = {f.resolve() for f in Path(indir).glob('**/*') if f.suffix in ['.htm', '.html']}
    for file in htm_files:
        main(file, Path(outdir))
