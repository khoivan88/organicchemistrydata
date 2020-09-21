# PowerShell 7 script to compress gif files
# This one is for windows 10, you would need magickImage installed as well, you can use chocolatey to install magickImage

# This code below will get all .gif files inside currect folder and subfolder,
# then for each file, run the magickImage compress with 'none' type and replace the current image
Get-ChildItem -Recurse -Filter *.gif | ForEach-Object { magick convert -compress none $_ $_ }