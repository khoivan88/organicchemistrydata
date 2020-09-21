# Editing Content of organicchemistrydata.org

***This document is being update constantly so please check back regularly. Please feel free to edit the document if you find any errors.***

This is a general guide on how to edit content of this repo. For more spefic guide, please see documents inside [**docs**](docs) folder
<br>

## Overviews

- [Editing Content of organicchemistrydata.org](#editing-content-of-organicchemistrydataorg)
  - [Overviews](#overviews)
  - [General Steps to Edit directly on Github](#general-steps-to-edit-directly-on-github)
  - [General Steps to Edit from your own machine](#general-steps-to-edit-from-your-own-machine)
  - [Folder Structure](#folder-structure)
  - [More Resources:](#more-resources)
<br>

## General Steps to Edit directly on Github

This is for small content changes (e.g. text, data). If you need to edit the site more extensively (e.g. formatting, creating more content, please see the [following section](#general-steps-to-edit-from-your-own-machine))

1. If you don't have a github account, please register for an account here: https://github.com/
2. Please share your github username with KV and ask to be added to "Collaborators" list
3. You can access the repo here: https://github.com/khoivan88/organicchemistrydata
4. Access the specific file you want to edit (See [Folder Structure](#folder-structure) section for more info.)
5. Click on the `Edit` button (Pencil image) to edit the content. You can click on the "Preview Changes" to see your changes.
6. When done with the editing, go down to "Commit changes" section. Add:
   - In the first text box, and a 1 line summary of what you change (e.g. "Fix spelling issue"). This is required!
   - In the second text box, you can add additional info about the change you make. This box is optional. However, if you change is more than trivial, it is encourage to add the reason for your changes (focus on WHY aspect and not  HOW)
   - Consider: [Git Commit Best practice](https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices)
7. Choose `Commit directly to the master branch` FOR NOW (subject to change)
8. Click on `Commit changes` button
<br>

## General Steps to Edit from your own machine

This will show you how to edit this repo from your own machine and run a local test server before your commit

1. Download, install and familiarize yourself with `git` and `github`. This is an [excellent tutorial](https://www.youtube.com/watch?v=HVsySz-h9r4) (This tutorial is on Mac but should apply for most OS)
2. Install `Node.js` and `npm`. This is an example [guide](https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/). **Note**: if you follow this guide, stop before 'Create a Project' step.
3. Clone this repo with the following command in your command-line environment (e.g. `Terminal` for MacOS and Linux, `PowerShell` or `CMD` for Windows)

   ```bash
   cd path/desired-directory    # change to your desired directory
   git clone https://github.com/khoivan88/organicchemistrydata.git    # clone the repo to your local machine
   cd organicchemistrydata    # change into the repo directory
   ```

4. Install required packages (e.g. `11ty`). The below commands are continued from the above steps

   ```bash
   npm install    # this should install all the required packages for node.js to run
   ```

5. At this point, you are ready to edit the content of the repo. Use any text editor of your choice (vscode, atom, sublime, bbedit, etc.) to edit the content of the file(s) you want.
   
   ***Because this repo is constantly being updated, it is important that you run a `git pull` either before you start your edit or before pushing your commit so that all new commits are updated in your local repo***
   
6. When you are done editing, run the 11ty test server by running the following command: (**Note**, you need to be in the `organicchemistrydata` folder)

   ```bash
   npx @11ty/eleventy --serve
   ```

   Your terminal should output something ending like this:

   ```bash
   [Browsersync] Access URLs:
    -------------------------------------
          Local: http://localhost:8080
        External: http://192.168.1.14:8080
    -------------------------------------
              UI: http://localhost:3001
    UI External: http://localhost:3001
    -------------------------------------
    [Browsersync] Serving files from: _site
    ```

7. Check your new content by opening your internet browser of choice and go to the output url above (e.g. `http://localhost:8080`)
8. If you are not satisfied, you can continue the editing process (step 5), the server is live so it should automatically reload your page above. **Note**: considering that if you have a lot of edits, stop the live server by pressing `Ctrl-C` **TWICE** in the terminal in step 6.
9.  After you satified with your change, add all of your content, commit and push to the repo using the following commands:  (**Note**, you need to be in the `organicchemistrydata` folder)

   ```bash
   git add .    # don't forget the period at the end, this is to add all files that were changed into the staging area
   git commit -m 'Your short commit message here'    # Add your commit message, considering the alternative below if you have a long commit message
   git pull origin master    # (Optional) Required if there are new commits to the repo by other contributors
   git push origin master
   ```

   Instead of `git commit -m 'Your short commit message here'`, you can use `git commit`, it should open your default text editor and you can type in your short commit message in the first line, followed by a blank line and then following by a longer message (remember that it is generally more important to talk about the WHY of the change and not the HOW, the HOW can be seen from the content you edited)

**DONE**. You should be all set at this point, you can navigate to [the repo commit listing](https://github.com/khoivan88/organicchemistrydata/commits/master) to check your commit. A green check mark after your commit means that it was built and deployed successfully to the server. **CONGRATULATION**
<br>

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
<br>

## More Resources:

- Git:
  - Github basic tutorial (**HIGHLY RECOMMENDED**): https://www.youtube.com/watch?v=HVsySz-h9r4
  - General:
    - http://swcarpentry.github.io/git-novice/
    - https://try.github.io/
  - Visualizing git tree: http://git-school.github.io/visualizing-git/
  - Collaboration on github: https://education.molssi.org/python-package-best-practices/06-collaboration/index.html
