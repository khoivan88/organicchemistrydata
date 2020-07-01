# Editing Content of organicchemistrydata.org
(This document is being update constantly so please check back regularly. Please feel free to edit the document if you find any errors.)

## Overviews
- [Steps to Edit](#steps-to-edit)
- [Folder Structure](#folder-structure)
- [More Resources](#more-resources)

## Steps to Edit
1. If you don't have a github account, please register for an account here: https://github.com/
2. Please share your github username with KV and ask him to add you to "Collaborators" list
3. You can access the repo here: https://github.com/khoivan88/organicchemistrydata
4. Access the specific file you want to edit (e.g: https://github.com/khoivan88/organicchemistrydata/blob/master/src/hansreich/about_reich.html)
5. (Need edit) Click on the `Edit` button (Pencil image) to edit the content. You can click on the "Preview Changes" to see your changes. 
6. When done with the editing, go down to "Commit changes" section. Add:
   - In the first text box, and a 1 line summary of what you change (e.g. "Fix spelling issue"). This is required!
   - In the second text box, you can add additional info about the change you make. This box is optional. However, if you change is more than trivial, it is encourage to add the reason for your changes (focus on WHY aspect and not  HOW)
   - Consider: [Git Commit Best practice](https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices)
7. Choose `Commit directly to the master branch` FOR NOW (subject to change)
8. Click on `Commit changes` button


## Folder Structure
- '**scripts**': containing various scripts (mainly python) that was used to create, edit content for this site
- '**src**': containing the source files that will be used by [11ty](https://www.11ty.dev/) to convert to the actual site files
  - '**_includes**': containing various layout files
  - '**css**': containing css files
  - '**data**': containing various other data that do not fit into other folders
  - '**hansreich**': containing all source file for page under this url (e.g. 'domain.com/hansreich/'
  - '**img**': containing images that do not belong to any specific data set or other folders. 
  - '**js**': containing javascript files for the site
  - '**404.html**': template for 404 page
  - '**index.html**': landing page


## More Resources:
- Git:
  - General (**HIGHLY RECOMMENDED**): http://swcarpentry.github.io/git-novice/
  - General info: https://try.github.io/
  - Visualizing git tree: http://git-school.github.io/visualizing-git/
  - Collaboration on github: https://education.molssi.org/python-package-best-practices/06-collaboration/index.html
