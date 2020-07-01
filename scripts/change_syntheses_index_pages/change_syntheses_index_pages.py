from bs4 import BeautifulSoup
import requests
from collections import Counter


def main(ref_file, infile, outfile):
    # root_url = 'https://raw.githubusercontent.com/khoivan88/organicchemistrydata/master/src/hansreich/resources/syntheses/groupby'
    # ref_file_url = f'{root_url}/names.html'
    # ref_html = requests.get(ref_file_url)
    linklist = {}
    with open(ref_file, 'r') as f_ref:
        ref_soup = BeautifulSoup(f_ref.read(), 'html.parser')
        for el in ref_soup.find_all('a', href=True):
            linklist[el['href']] = el.text
    # print(str(ref_soup))
    # print(linklist)

    all_hrefs = [el['href'] for el in ref_soup.find_all('a', href=True)]
    print(f'All a tags with href: {len(all_hrefs)}')
    distinct_hrefs = {el['href'] for el in ref_soup.find_all('a', href=True)}
    print(f'Number of unique href: {len(distinct_hrefs)}')

    # Find all href that has more than 1 count
    c = Counter(all_hrefs)
    repeated_href = [element for element, count in c.items() if count > 1]
    print(repeated_href)
    print(len(repeated_href))
    # print(len(c.most_common(34)))

    # with open(infile, 'r') as f_in, open(outfile, 'wb') as f_out:
    #     outfile_soup = BeautifulSoup(f_in.read(), 'html.parser')
    #     for el in outfile_soup.find_all('a', href=True):
    #         if el['href'] in linklist:
    #             el.string.replace_with(linklist[el['href']])
    #     output = str(outfile_soup)
    #     output = output.replace(":</b> ", ":</b><br/>&nbsp;&nbsp;")    # Add new line break + spaces after each section
    #     output = output.replace("</a>, ", "</a><br/>&nbsp;&nbsp;")   # Add new line break + spaces after each section
    #     output = output.replace("  <b>", "<b>")
    #     # print(output)

    #     f_out.write(output.encode('utf-8'))


def count_href(ref_file):
    linklist = {}
    with open(ref_file, 'r') as f_ref:
        ref_soup = BeautifulSoup(f_ref.read(), 'html.parser')
        for el in ref_soup.find_all('a', href=True):
            linklist[el['href']] = el.text
    # print(str(ref_soup))
    # print(linklist)

    all_hrefs = [el['href'] for el in ref_soup.find_all('a', href=True)]
    print(f'All a tags with href: {len(all_hrefs)}')
    distinct_hrefs = {el['href'] for el in ref_soup.find_all('a', href=True)}
    print(f'Number of unique href: {len(distinct_hrefs)}')

    # Find all href that has more than 1 count
    c = Counter(all_hrefs)
    repeated_href = [(element, count) for element, count in c.items() if count > 1]
    print(repeated_href)
    print(len(repeated_href))


if __name__ == "__main__":
    indir = 'groupby'
    outdir = 'new_groupby'

    ref_file = f'{indir}/names.html'
    # count_href(ref_file)

    outfile_names = ['years', 'chemoselectivity', 'named_reactions', 'reactions', 'reagents', 'rings']
    # outfile_names = ['years']

    for name in outfile_names:
        infile = f'{indir}/{name}.html'
        outfile = f'{outdir}/{name}.html'
        main(ref_file, infile, outfile)
