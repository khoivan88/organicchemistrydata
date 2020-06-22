from pathlib import Path
import re
import codecs


def fix_synthesis_pages():
    dir_in = Path('syntheses_data_original')
    dir_out = Path('syntheses_data_modified')
    # print(list(dir_in.glob('**/*.html')))
    for file in dir_in.glob('**/*.html'):
        # print()
        file_out = Path(dir_out) / file.name
        fix_content(file_in=file, file_out=file_out)


def fix_content(file_in, file_out):
    # print(file_in)
    # with open('syntheses_data_original/abscisic-acid-constantino.html', 'r') as fin:
    content = codecs.open(file_in, 'r', 'utf-8').read()
    # with open(file_in, 'r') as fin, open(file_out, 'w') as fout:
        # content = fin.read()
    # print(content)
    title_line = ''
    title = re.search(r'<title>(.*?)</title>', content)
    if title:
        title_line = f"---\ntitle: '{title.group(1)}'\n---\n"
    # print(content)
    body = re.search(r'(<img.*</table>)', content, re.DOTALL|re.MULTILINE|re.UNICODE)
    # # print(title_line)
    # print(body.group(0))
    # <img src="{{ (img_url_prefix + 'abscisic-acid-constantino.gif') | url }}" class="img-fluid" alt="{{ page.fileSlug }}"></img>

    body_content = ''
    if body:
        body_content = body.group(0)
        # print(body_content)
        re_src = re.compile(r'src=\"([^\"]*?)\".*?alt=\".*?\"', re.UNICODE)
        url = re_src.search(body_content).group(1)
        # print(url)
        modified_body = re_src.sub('src="{{ (img_url_prefix + \'' + url + '\') | url }}" class="img-fluid" alt="{{ title }}"', body_content)
        # print(modified_body)
        with open(file_out, 'w', encoding='utf-8', newline='') as fout:
            fout.write(title_line)
            fout.write(modified_body)
    else:
        print(file_in)



if __name__ == "__main__":
    fix_synthesis_pages()

