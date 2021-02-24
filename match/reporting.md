# Creating Error Reports

In addition to the standard way for `kcc` to report warnings on the command line, it is also possible to create a graphical error report highlighting each error and allowing for search, filtering, sorting, and examination of defects by file in your browser. This utilizes the html report generator provided with an installation of rv-match, `rv-html-report`.

## Generating a data set for reporting

Generally speaking, it is most interesting to analyze an error report in aggregate that combines all the static and dynamic errors from building and testing your application. In order to do this, it is necessary first to collect the errors from a run of your build system into a single file. The `-fissue-report` flag to `kcc` does this. For example, if your C application lives in your home directory in rthe `myapp` folder, and is built using autotools, you can generate such a data set for your application with the following set of commands:

```bash
CC=kcc LD=kcc CFLAGS=-fissue-report=~/myapp/my_errors.json ./configure
make
make check
```

Here we specify an absolute path to the json file in order that all errors go in the same file regardless of working directory. Then we build and run the tests normally. It is necessary to choose a `.json` file extension because this is the format that the report generator understands.

## Generating the report

Once you have obtained a set of errors in json format, you can generate an html report quite easily:

```
rv-html-report ~/myapp/my_errors.json -o ~/myapp/my_html_report
```

The -o flag creates a directory in which the html report is placed. You can thus open the report in any browser by navigating to `file:///path/to/home/directory/myapp/my_html_report/index.html`.

## Navigating report pages

Once you have the main view of the report open, several things are possible in the initial table view. You can reorder columns by dragging the column header to the position you want; you can sort by column by clicking the column headers (Please note that the table will sort from the leftmost column to the right); you can search on all fields by typing words into the search bar; you can search on a particular field using a labeled syntax (i.e., search for errors on line 98 by entering `line:98` in the search bar). Note that the labels for each field are the name of the column header in lowercase with spaces replaced by underscores. You can also click the links to navigate to one of the other pages. The ID and Error columns link to a detailed page for each error, and the File column links to a code view with all errors in the file highlighted.

On the code view, you can click on any underlined red line to link to the details page for that error. When multiple errors exist on a line, you can click the line to expand a list of all such errors, with links to their respective pages, and you can also click the back link to take you back to the table view.

On the error details page, you can click on each stack frame to collaps or expand a code snippet showing the highlighted line of code pertaining to that frame of the stack trace of the error. You can click the links to the citations to be referred to relevant language standards and code safety standards of interest relevant to the error, and you can click the back link to take you back to the table view.
