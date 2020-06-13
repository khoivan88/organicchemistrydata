import re
import traceback
from pathlib import Path

import requests
from bs4 import BeautifulSoup
import yaml

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
}


def download_pka_gif():
    try:
        # gif_urls = list(find_gif_urls())
        # print(gif_urls)
        # exit(0)

        title_id = []
        for file_name, url, id_field, title in find_gif_urls():
            # print(file_name, url, id_field, title)
            title_id.append({'title': title, 'id': id_field})

            download(file_name=file_name, url=url, rel_download_path='pka_data')

        # print(title_id)
        with open('pka_info.yaml', 'w') as fout:
            yaml.dump(title_id, fout)

    except Exception as error:
        if debug:
            traceback_str = ''.join(traceback.format_exception(etype=type(error), value=error, tb=error.__traceback__))
            print(traceback_str)


def find_gif_urls():
    root_url = 'https://www2.chem.wisc.edu/areas/reich/pkatable'
    adv_search_url = f'{root_url}/kacont.htm'

    try:
        with requests.Session() as s:
            res = s.get(adv_search_url, headers=headers, timeout=10)
            if res.status_code == 200 and len(res.history) == 0:
                # res.text
                html = BeautifulSoup(res.text, 'html.parser')
                # print(html.prettify()); exit(1)

                a_tags = html.find_all('a', attrs={'href': re.compile(r'(.+?\.gif)')})
                # print(a_tags)

                filename_reg = re.compile(r'(.+?)\.gif')
                # gif_urls = (f'{root_url}/{url_suffix.search(a_tag["src"]).group(1)}' for img_tag in a_tags)
                for a_tag in a_tags:
                    file_name = a_tag["href"]
                    url = f'{root_url}/{file_name}'
                    id_field = filename_reg.search(file_name).group(1)
                    title = a_tag.text
                    yield file_name, url, id_field, title

    except Exception as error:
        if debug:
            traceback_str = ''.join(traceback.format_exception(etype=type(error), value=error, tb=error.__traceback__))
            print(traceback_str)


def download(file_name: str, url: str, abs_download_path: str = None, rel_download_path: str = None):
    """Download SDS from variety of sources

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
    download_path = ''
    if not abs_download_path and not rel_download_path:
        download_path = Path(__file__).resolve().parent / 'downloads'
    elif rel_download_path:
        download_path = Path(__file__).resolve().parent / rel_download_path
    elif abs_download_path:
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
    download_pka_gif()
