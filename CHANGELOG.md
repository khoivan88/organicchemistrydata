# CHANGELOG

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
