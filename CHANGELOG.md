# CHANGELOG

**More detailed changes can be found in the [commit list of the repo](https://github.com/khoivan88/organicchemistrydata/commits/master)**

## 2020-11-01

- Change: Switch to `?page=` for pages in collection with dynamic loading. Earlier use of `#` was not indexed by Google search
- Add: `aria-current="page"` for menu to increase accessibility for users with screen readers
- Add: `aria-current="location"` for side menu links to increase accessibility for users with screen readers
- Add highlight for current page in collection's menu on topnav as well as for links on side menu if applicable

## 2020-08-31

- Add lazy loading for images in the site
- Add multiple resources to 'Links' page
- Change a tag link color to make give it more contrast, in an effort to make the site more accessible
- Compress all gif images (saved about 80 MB)

## 2020-08-24

- Add lazy loading for images in the site
- Add Advisory Board page and link to it in the footer
- Add meta tags and descriptions to multiple pages in 'Reich Collection'
- Fix multiple broken links to 'Total Syntheses' section for pages in 'Organometallic', 'Redox', 'Carbonyl chemistry', etc.
- Change 'Reich collection' logo, provided by the Advisory Board
- Change text in 'Reich Collection' landing page, provided by the Advisory Board


## 2020-08-11

- Add 'NMR gallery' into 'Reich Collection' > 'NMR'
- Add tooltip to display compounds' structure upon hovering mouse over the name or formula in 'NMR gallery'
- Add option to display last update date if exists in the footer
- Add Google Search engine for the site (thanks to Joe Ward for setting it up)
- Modify [sitemap.xml](/src/sitemap/sitemap.njk) file to include dynamically loaded pages to submit to google search index
- Upgrade search function for pages using 'sidemenu_with_dropdown_template':
  - Display number of found queries
  - Display button to go to the next found item or go back to the previous one
- Fix variety of codes in pages in 'NMR' section to HTML 5 code and remove bad codes

## 2020-07-31

- Add 'NMR' section into 'Hans Reich collection'
- Add chemical shift and coupling pages into 'Reich Collection' > 'NMR'
- Move solvent page to its own page without template for faster loading
- Add submenu items for top navbar
- Change style for Hans Reich quote on 'Reich Collection' landing page

## 2020-07-22

- Add 'Carbonyl chemistry' section into 'Hans Reich collection'
- Add 'Redox chemistry' section into 'Hans Reich collection'
- Add 'Pericyclic reactions' section into 'Hans Reich collection'
- Add 'Fundamentals of Organic Chemistry' section into 'Hans Reich collection'
- Add sections in Hans Reich's Chem 547 course into: 'Organometallic'

## 2020-07-19

- Add [additional instruction](/docs/editing_links_in_organometallic.md) on how to edit broken links in 'Reich' > 'Organometallic' section
- Add red text indication to internal Hans Reich pages to the 'Links' page
- Add 'Organic Reference Resolver' on 'Links' page
- Add 'Organometallic' section into 'Hans Reich Collection'
- Add search and scroll to found query for all pages using 'side_menu_with_dropdown' template
- Add instruction for citation title for pages in Hans Reich collection in the footer
- Change: redesign 'Total Syntheses' to have index page inside the side menu
- Change: remove some extra code in 'Total Syntheses' index pages; and split large pages to multiple pages (e.g. 'Reaction types' and 'Reagent types')

## 2020-07-07

- Create and Update `CONTRIBUTING.md`
- Fix naming issue
- Replace text in img with some html text
- Make homepage jumbotron span entire width
- Fix navbar menu text too wide and too long in small screen
- Make each hexagon on homepage clickable as a whole and will lead to the `/collections` page
- Add format for the each hex description
- Add 'Electronegativies' page
- Change headers font and style
- Restructure top navbar
- Make heading font size responsive on screen md and smaller
- Add toggle to display descriptions of each hex in xs screen
- Add sitemap
- Make heading font responsive in small screen and lower only.

## 2020-06-30

- Add ability to close indices navbar after clicking on a index link
- Force sidebar visible on all screen sizes when a index menu is clicked
- Automatically close side menu after clicking on a specific synthesis link
- When the index navbar ('names', 'years', etc.) already in collapse state (only display the toggle button), close it after clicking on an index in small screen
- Restructure and Add new landing page
- Fix issue of repeating codes of 'sideMenu.js' in 'synthesesPages.js'
- Change site-credit
- Add research description
- Add awards; Fix alt text
- Add 'Nomenclature' page
- Add 'Last updated: ' for each page
- Make 2 separated footers for main and Hans Reich's sections
- Change content display in indices pages for 'Total Syntheses' section from numbers to names of Natural Products
- Add placeholders for meta tags
- Create Github action for automatic build and deploy to server

## 2020-06-26

- Add 'Total Syntheses' Collection
- Add 'Electron Pushing' page
- Fix 'Organolithium' page gif files to work with scrollspy; Remove duplicate listing in content
- Add side menu heading for template
- Add heading for side menu for 'Electron Pushing' page
- Change wording for included PDF; Add conditionals for external links
- Move words in gif files into header for better accessibility
- Change to get tighter selection of the page footer in case other footers are included
- Change to share link with hash is included [this commit](https://github.com/khoivan88/organicchemistrydata/commit/2f5519112937df7cf8595a567d6eb77b52a1d4ee)
- Add link to NMR site
- Change the side bar menu to mobile first style

## 2020-06-19

- Add: Page not found now have full general layout
- Add row property for social media on footer
  - Why: earlier, in mobile view, the "Visit Us" and "Share this page" sections are still shown as 2 columns. This commit make them split into 2 rows in smaller devices
- Add 'lazy-image' plugin for 11ty
- Add JS to handle click to section function
  - Why: earlier, click to section was simply handle with HTML id attr and css 'scroll-padding-top' option. While this works well on Chrome and Firefox, Safari always scrolls pass the section. Other trick of adding padding or use CSS to offset did not work.
- Add link to PDF in 'Organolithium Reagents' page
- Add gif files for 'Acronyms' page
- Add 'Named Reagents' page
- Add scrollspy for side menu; Fix some formats for better compatibility with scrollspy
- Fix file names because curly bracket does not work with scrollspy

## 2020-06-14

- Fix: footer, smaller icons for social media sharing
- Fix: layouts for pages with side menu. Specifically, layout now pulled out to specific page
- Add: footers to all pages, including those with side menu. For those with side menu, footer is moved to after reference section by Javascript
- Change: side menu, in small device:
  - Take full width when open
  - Automatically closed when a link is clicked (Javascript)

## 2020-06-13

- Fix: Add header title for all pages
- Fix: make sure `target` attribute is not empty
