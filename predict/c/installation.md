# Installation

## Requirements

Note

We only currently officially support RV-Predict/C on 64-bit Ubuntu Linux 16.04 and greater. If you would like to use a different distribution, [contact support](https://runtimeverification.com/contact#nav-embedded-systems) and we will try to support you.

## GUI Installer

1. Download and install the Oracle Java 8 (or higher) JRE or OpenJDK 8 JRE for your architecture.
2. Download the [RV-Predict/C GUI installer](https://github.com/runtimeverification/predict/releases).
3. Run the `.jar` file with `java -jar rv-predict-c-installer.jar`. Follow the instructions to finish the installation.

## Debian package

1. Download the [RV-Predict/C Debian package](https://github.com/runtimeverification/predict/releases).
2. Install the `.deb` file with `sudo apt-get update; sudo dpkg -i rv-predict-c.deb; sudo apt-get install -f -y`.
