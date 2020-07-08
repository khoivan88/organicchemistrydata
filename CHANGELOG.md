# CHANGELOG

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
