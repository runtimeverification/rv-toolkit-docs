# Installing
## Native Linux

> **Note**
> 
> We only currently officially support automated installation for Ubuntu and Debian. If you would like to use a different distribution, [contact support](https://runtimeverification.com/contact) and we will be happy to add support for you.

Native Linux is the preferred distribution of RV-Match, as it comes with full library support and the fastest execution speed of any of our distributions. Only 64-bit Linux variants are supported.

To install RV-Match on native Linux, simply:

1. Download and install the Oracle Java 8 (or higher) JRE or OpenJDK 8 JRE for your architecture.
2. Download the native version of [RV-Match for Linux](https://github.com/runtimeverification/match/releases).
3. Run the JAR file and follow on-screen instructions with `sudo java -jar rv-match-linux-64-1.0-SNAPSHOT.jar`.

See `/opt/rv-match/README.md` for more information on using RV-Match.

To uninstall RV-Match for Linux, run `./uninstall` in `/opt/rv-match`.

### Connecting through a Proxy

In order to verify the validity of your RV license at first install, our installer will make a single connection to our server. We support HTTP, HTTPS, and SOCKS5 proxies for this connection. By default, the installer will attempt to automatically detect proxy settings from your environment. Both GNOME 2.x proxy settings and the $HTTP\_PROXY and $HTTPS\_PROXY environment variables are supported for automatic detection.

To manually configure proxy files, download and save our [sample proxy configuration](https://runtimeverification.com/match/proxy.properties). By default, the installer will look for this file in ~/proxy.properties. You can manually specify the location of this file by running `sudo java -Dproxyconf=proxy.properties -jar [installer jarfile]`.

Any settings entered in the configuration file will override automatically detected system settings.

If you have any issues with RV-Match licensing in your corporate environment, please [contact support](https://runtimeverification.com/contact) for troubleshooting or instructions on installing offline.

### Upgrading an Existing Installation

To upgrade an existing installation of RV-Match, simply run `wget https://runtimeverification.com/match/upgrade.sh -O upgrade.sh && sh upgrade.sh` from any bash terminal and follow the on-screen instructions.

## Windows 10 (Via Windows Subsystem for Linux)

To install a version of RV-Match capable of executing C code which does not depend on any Windows target libraries, you can use the Windows Subsystem for Linux, if you have a copy of Windows 10.

To install RV-Match on native Windows, simply:

1. Download the [installer](https://github.com/runtimeverification/match/releases) for RV-Match for Windows 10.
2. Install the [Windows Subsystem for Linux](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide) according to the provided installation instructions, if it has not already been installed. Note that we only support the Ubuntu version of Windows Subsystem for Linux.
3. Run `sudo apt-get update; sudo apt-get install default-jre` to install Java within your Windows Subsystem for Linux installation. Note that running the installer with a native Windows installation of Java will not work correctly.
4. Run `sudo java -jar rv-match-windows-1.0.jar` in the directory containing the installer from within a Bash terminal.

See `/opt/rv-match/README.md` within your Windows Subsystem for Linux installation for more information on using RV-Match. Note that you will have to be within a Bash terminal to use the installed software.

To uninstall RV-Match for Windows, run `./uninstall` in `/opt/rv-match` from within the Bash terminal.
