# Eclipse Integration
## Installing

Our RV-Match Eclipse plugin currently requires the latest version of Eclipse, Eclipse Neon. To request support for the plugin on an earlier version of eclipse, please [contact support](https://runtimeverification.com/contact).

To install the plugin on Eclipse, simply select “Install New Software...” from the Help menu. The URL for the site containing the plugin is <https://runtimeverification.com/eclipse>

Simply enter the URL and follow the prompts to install the plugin.

## Configuring a Build Configuration

RV-Match’s primary component is a C compiler, kcc. In order to use the RV-Match Eclipse plugin, all that is required is to reconfigure your build system to use kcc as your C compiler and your linker. This step is not automated because it depends on how your project is built, however, a brief summary is given here for the most common types of Eclipse projects.

### GNU Autotools Project

In this type of project, GNU Autotools is used in order to execute a configure script and generate a Makefile. Configuring such a project to build with kcc is simple. First, right-click on the project and select “Properties”. In the resulting dialog, navigate to the “Autotools” \> “Configure Settings” pane. From there you should select the “Environment variables” item in the tree view. Once selected, simply add the following two environment variables to the configure script: `CC="kcc" LD="kcc"`.

Once this is done, you can proceed to the next section, “Running RV-Match”.

### Makefile Project

In a project in which the Makefile is being generated automatically, configuring the project to build with kcc is also simple. First, right-click on the project and select “Properties”. In the resulting dialog, navigate to the “C/C++ Build” \> “Settings” pane. From there you should select the “Tool Settings” tab. In the resulting tree view, highlight first the item for the C compiler, then the item for the C linker, and change the “Command” entry on the right to “kcc”.

Once this is done, you can proceed to the next section, “Running RV-Match”.

## Running RV-Match

At this point, you should be able to use the rest of your build and run configuration to build and execute your project the same way you would normally. When RV-Match executes, if it finds any errors, they will be added to the Problems pane. You may also view the errors reported in more detail in the “RV-Match Error Console” pane, which shows the errors along with their stack trace and links to the relevant citations in related C standards.
