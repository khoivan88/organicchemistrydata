from bs4 import BeautifulSoup
import requests


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

    # outfile_url = f'{root_url}/years.html'
    # outfile_html = requests.get(outfile_url)
    # outfile_soup = BeautifulSoup(outfile_html.text, 'html.parser')
    with open(infile, 'r') as f_in, open(outfile, 'wb') as f_out:
        outfile_soup = BeautifulSoup(f_in.read(), 'html.parser')
        for el in outfile_soup.find_all('a', href=True):
            if el['href'] in linklist:
                el.string.replace_with(linklist[el['href']])
        output = str(outfile_soup)
        output = output.replace(":</b> ", ":</b><br/>&nbsp;&nbsp;")    # Add new line break + spaces after each section
        output = output.replace("</a>, ", "</a><br/>&nbsp;&nbsp;")   # Add new line break + spaces after each section
        output = output.replace("  <b>", "<b>")
    # print(output)
    # with open('years.html', 'wb') as f:
        f_out.write(output.encode('utf-8'))


if __name__ == "__main__":
    indir = 'groupby'
    outdir = 'new_groupby'

    # outfile_name = 'years'
    outfile_names = ['years', 'chemoselectivity', 'named_reactions', 'reactions', 'reagents', 'rings']
    for name in outfile_names:
        ref_file = f'{indir}/names.html'
        infile = f'{indir}/{name}.html'
        outfile = f'{outdir}/{name}.html'
        main(ref_file, infile, outfile)