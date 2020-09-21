import re
from pathlib import Path

from bs4 import BeautifulSoup

import sys
sys.setrecursionlimit(10000)

def main(infile, outdir):
    # print(infile)
    # !Important to convert the outfile here, it would be changed from 'Pathlib' object
    # to IOText object after the 'with' block
    outfile = outdir / '{}.html'.format(infile.stem.replace('{', '').replace('}', ''))

    try:
        print(infile)
        with open(f'groupby_ref/{infile.stem}-lookup.htm', 'r', encoding='utf-8') as ref_file:
            ref_soup = BeautifulSoup(ref_file.read(), 'html.parser')
            ref_links = ref_soup.find_all('a', href=True)

        with open(infile, 'r', encoding='utf-8') as infile:
            content_soup = BeautifulSoup(infile.read(), 'html.parser')
            content_links = content_soup.find_all('a', href=True)

        print(f'ref_links size: {len(ref_links)}')
        # print(ref_links[:9])
        print(f'content_links size: {len(content_links)}')
        # print(content_links[:9])

        # for link in content_links[:9]:
        #     print(link.href)
        #     for ref_link in ref_links:
        #         if link.href.replace('#', '') in ref_link.href:
        #             print(ref_link)

        # print(list(zip(content_links, ref_links))[:9])
        # print(len(list(zip(content_links, ref_links))))

        # print(len([link for link in ref_links if link not in [b for _,b in zip(content_links, ref_links)]]))
        # print([link for link in ref_links if link not in [b for _,b in zip(content_links, ref_links)]])
        # exit()

        for link, ref_link in zip(content_links, ref_links):
            # print(link['href'])
            # if link['href'].replace('#', '') in ref_link['href'].replace('(', '-').replace(')', ''):
            if link['href'].replace('#', '') in ref_link['href']:
                coordinate = re.search(r'\?(\d*)x(\d*)', ref_link['href'])
                link['data-top'] = coordinate.group(1)
                link['data-left'] = coordinate.group(2)
            else:
                print(link['href'].replace('#', ''))
                print(ref_link['href'])
                # print(ref_link['href'].replace('(', '-').replace(')', ''))
                print()

        # print(content_soup)
        # exit()

        # # Add 'synthesis' class for each img
        # modified_body = re.sub(r'(?<=class=")(?=img-fluid")', 'synthesis ', content)
        # # Remove unnecessary parts
        # re_remove = re.compile(r'''
        #                     #    (?<=>)[\s\t]*(?=<|\w)              # space between open tag and its content
        #                     # |(?<=.)[\s\t]*(?=</)                  # space between its content amd closing tag
        #                     # |^\s*                                 # blank space at the beginning of line
        #                     # |(?<=</p>)\s*<br/>                    # remove `<br>` after `</p>`
        #                     # |(?<=p\sclass="pl-3">)\s*<br/>        # remove `<br>` after opening `<p>`
        #                     # |&nbsp;*                              # UNICODE blank space
        #                     |<!--that\swhich\sshall\shold\sthe\sdot-->   # this specific string
        #                     |<span\sstyle="font-size:7pt;\sfont-family:arial,\shelvetica;">   # this specific string
        #                     |<div\sid="dot"></div>                   # this specific string
        #                     |\s*style=\"[^\"]*\"                    # anything inside style tag
        #                     |\s*bgcolor='[^']*'                  # this specific string
        #                     |^\s*                              # blank line
        #                     ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
        # modified_body = re_remove.sub(r'', modified_body)

        # # Remove these font size tag
        # modified_body = re.sub(r'<font size=2>(.*?)</font>', r'\1', modified_body)

        # # Remove these font size tag
        # modified_body = re.sub(r'<table>', r'<table class="table table-striped">', modified_body)

        # modified_body = re_remove.sub(r'', modified_body)

        with open(outfile, 'w', encoding='utf-8', newline='') as fout:
            # fout.write(title_line)
            # fout.write(str(content_soup.encode(formatter="html5")))
            # fout.write(str(content_soup))
            new_content = content_soup.encode(formatter="html5").decode()
            # Remove weird '</br>' tag
            new_content = re.sub(r'</br>*', '', new_content)
            fout.write(new_content)

    except Exception as e:
        print(infile)
        print(e)


if __name__ == "__main__":
    indir = 'groupby_original'
    outdir = 'groupby_new'

    # htm_files = Path(indir).glob('*.htm')
    htm_files = {f.resolve()
                 for f in Path(indir).glob('**/*')
                 if (f.suffix in ['.htm', '.html']) and ('-lookup' not in f.stem)}
    for file in htm_files:
        # print(file)
        main(file, Path(outdir))
