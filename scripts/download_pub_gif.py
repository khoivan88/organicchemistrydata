import re
import traceback
from pathlib import Path

import requests
from bs4 import BeautifulSoup


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
}


def download_pub_gif():
    try:
        # gif_urls = list(find_gif_urls())
        # print(gif_urls)
        # exit(0)
        for file_name, url in find_gif_urls():
            download(file_name=file_name, url=url, rel_download_path='gif')

    except Exception as error:
        if debug:
            traceback_str = ''.join(traceback.format_exception(etype=type(error), value=error, tb=error.__traceback__))
            print(traceback_str)


def find_gif_urls():
    root_url = 'https://www2.chem.wisc.edu/areas/reich/group'
    adv_search_url = f'{root_url}/main.htm'

    try:
        with requests.Session() as s:
            res = s.get(adv_search_url, headers=headers, timeout=10)
            if res.status_code == 200 and len(res.history) == 0:
                # res.text
                html = BeautifulSoup(res.text, 'html.parser')
                # print(html.prettify()); exit(1)

                img_tags = html.find_all('img', attrs={'src': re.compile(r'students/(.+?\.gif)')})
                # print(img_tags)

                url_suffix = re.compile(r'(students/(.+?\.gif))')
                # gif_urls = (f'{root_url}/{url_suffix.search(img_tag["src"]).group(1)}' for img_tag in img_tags)
                for img_tag in img_tags:
                    file_name = url_suffix.search(img_tag["src"]).group(2)
                    url = f'{root_url}/{url_suffix.search(img_tag["src"]).group(1)}'
                    yield file_name, url

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
    download_pub_gif()
