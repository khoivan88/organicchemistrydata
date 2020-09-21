import re
from pathlib import Path

# from bs4 import BeautifulSoup


def main(infile, outdir):
    # print(infile)
    # !Important to convert the outfile here, it would be changed from 'Pathlib' object
    # to IOText object after the 'with' block
    outfile = outdir / '{}.html'.format(infile.stem.replace('{', '').replace('}', '').lower())

    with open(infile, 'r', encoding='utf-8') as infile:
        content = infile.read()

    # Add 'synthesis' class for each img
    modified_body = re.sub(r'(?<=class=")(?=img-fluid")', 'synthesis ', content)
    # Remove unnecessary parts
    re_remove = re.compile(r'''
                        #    (?<=>)[\s\t]*(?=<|\w)              # space between open tag and its content
                        # |(?<=.)[\s\t]*(?=</)                  # space between its content amd closing tag
                        # |^\s*                                 # blank space at the beginning of line
                        # |(?<=</p>)\s*<br/>                    # remove `<br>` after `</p>`
                        # |(?<=p\sclass="pl-3">)\s*<br/>        # remove `<br>` after opening `<p>`
                        # |&nbsp;*                              # UNICODE blank space
                        |<!--that\swhich\sshall\shold\sthe\sdot-->   # this specific string
                        |<span\sstyle="font-size:7pt;\sfont-family:arial,\shelvetica;">   # this specific string
                        |<div\sid="dot"></div>                   # this specific string
                        |\s*style=\"[^\"]*\"                    # anything inside style tag
                        |\s*bgcolor='[^']*'                  # this specific string
                        |^\s*                              # blank line
                        ''', re.MULTILINE|re.UNICODE|re.VERBOSE)
    modified_body = re_remove.sub(r'', modified_body)

    # Remove these font size tag
    modified_body = re.sub(r'<font size=2>(.*?)</font>', r'\1', modified_body)

    # Remove these font size tag
    modified_body = re.sub(r'<table>', r'<table class="table table-striped">', modified_body)

    modified_body = re_remove.sub(r'', modified_body)

    try:
        with open(outfile, 'w', encoding='utf-8', newline='') as fout:
            # fout.write(title_line)
            fout.write(modified_body)

    except Exception as e:
        print(infile)
        print(e)


if __name__ == "__main__":
    indir = 'syntheses_data_original'
    outdir = 'syntheses_data_new'

    # htm_files = Path(indir).glob('*.htm')
    htm_files = {f.resolve() for f in Path(indir).glob('**/*') if f.suffix in ['.htm', '.html']}
    for file in htm_files:
        # print(file)
        main(file, Path(outdir))
