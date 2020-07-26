import re
import traceback
from pathlib import Path

import requests
from bs4 import BeautifulSoup
import yaml

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
}


def download_and_summary():
    try:
        root_url = 'https://www2.chem.wisc.edu/areas/reich/nmr/h-data'
        page_name = 'hdata-cont.htm'

        data_filename = 'h_data'

        data = {'items': {'list': []}}

        for file_name, url, id_field, title in find_gif_urls(root_url=root_url, page_name=page_name):
            # print(file_name, url, id_field, title)

            # Change file name to remove curly bracket, if change this, make sure change in the `download()` as well
            new_data = {'title': title, 'id': id_field.replace('{', '').replace('}', '')}
            duplicate = any(item['id'] == new_data['id'] for item in data['items']['list'])
            if duplicate:
                data['items']['list'].append({**new_data, 'leave_empty': True})
            else:
                data['items']['list'].append(new_data)
            download(file_name=file_name, url=url, rel_download_path=data_filename)

        # print(data)
        data_file = Path(__file__).resolve().parent / f'{data_filename}.yaml'
        with open(data_file, 'w') as fout:
            yaml.dump(data, fout)

    except Exception as error:
        if debug:
            traceback_str = ''.join(
                traceback.format_exception(
                    etype=type(error), value=error, tb=error.__traceback__
                )
            )

            print(traceback_str)


def find_gif_urls(root_url, page_name):
    page_url = f'{root_url}/{page_name}'

    try:
        with requests.Session() as s:
            res = s.get(page_url, headers=headers, timeout=10)
            if res.status_code == 200 and len(res.history) == 0:
                # res.text
                html = BeautifulSoup(res.text, 'html.parser')
                # print(html.prettify()); exit(1)

                filename_reg = re.compile(r'(.+?)\.gif')
                # a_tags = html.find_all('a', attrs={'href': re.compile(r'(.+?\.gif)')})
                a_tags = html.find_all('a', attrs={'href': filename_reg})
                # a_tags = html.find_all('img', attrs={'src': filename_reg})
                # print(a_tags)

                # gif_urls = (f'{root_url}/{url_suffix.search(a_tag["src"]).group(1)}' for img_tag in a_tags)
                for a_tag in a_tags:
                    file_name = a_tag["href"]
                    # file_name = a_tag["src"]
                    url = f'{root_url}/{file_name}'
                    id_field = filename_reg.search(file_name).group(1)
                    title = a_tag.text
                    yield file_name, url, id_field, title

    except Exception as error:
        if debug:
            traceback_str = ''.join(traceback.format_exception(etype=type(error), value=error, tb=error.__traceback__))
            print(traceback_str)


def download(file_name: str, url: str, abs_download_path: str = None, rel_download_path: str = None):
    """Download file

    Parameters
    ----------
    cas_nr : str
        The CAS number of the molecule of interest
    download_path : str
        The path to download folder

    Returns
    -------
    None
    """
    # Sanitize filename
    file_name = file_name.replace('{', '').replace('}', '')

    download_path = ''
    if not (abs_download_path or rel_download_path):
        download_path = Path(__file__).resolve().parent / 'downloads'
    elif rel_download_path:
        download_path = Path(__file__).resolve().parent / rel_download_path
    else:
        download_path = Path(abs_download_path).resolve()

    # Check if download path directory exists. If not, create it
    # https://stackoverflow.com/questions/12517451/automatically-creating-directories-with-file-output
    # https://docs.python.org/3/library/os.html#os.makedirs
    Path.mkdir(download_path, exist_ok=True)

    download_file = Path(download_path) / file_name
    # Check if the file not exists and download
    # check file exists: https://stackoverflow.com/questions/82831/how-do-i-check-whether-a-file-exists
    if download_file.exists():
        print('{} already downloaded'.format(file_name))
        # print('.', end='')
    else:
        print('\nDownloading {} ...'.format(file_name))
        r = requests.get(url, headers=headers, timeout=20)
        # Check to see if give OK status (200) and not redirect
        if r.status_code == 200 and len(r.history) == 0:
            # print('\nDownloading {} ...'.format(file_name))
            with open(download_file, 'wb') as f:
                f.write(r.content)


if __name__ == "__main__":
    download_and_summary()
