# Running Vagrant VM

The Vagrant VM distribution of RV-Match is the preferred method for running RV-Match on Windows and Mac OS X. It contains a Linux virtual machine with the Linux version of RV-Match, with full library support.

## Setting up Vagrant VM

Before you setup Vagrant VM, you need to install VirtualBox, Git, and Vagrant:

1. Download and install [Virtualbox](https://www.virtualbox.org/wiki/Downloads).
2. If you are on Windows, download and install [Git for Windows](https://git-scm.com/download/win). You must select the “use Git and optional Unix tools from the Windows Command Line” option during installation. Restart any command prompt windows and make sure running `ssh` works and prints usage information.
3. Download and install [Vagrant](http://www.vagrantup.com/). If you use a package manager, make sure your version is at least 1.5.2 (or install from the website).

To setup Vagrant VM, please follow the following steps:

First, open `terminal` (on Windows, open `Git Bash` program), then run the following commands:

```bash
$ mkdir rv-match-vagrant           # Make a directory named as rv-match-vagrant
                                   # You can give it another name if you like.
$ cd rv-match-vagrant              # Go to that directory
$ vagrant init                     # Init Vagrant project
$ vagrant box add ubuntu/xenial64  # Install Ubuntu 16.04 box
```

This will place a `Vagrantfile` in your current directory.

Next, open the `Vagrantfile` generated from the previous step with your favorite editor, change the line `config.vm.box = "base"` to `config.vm.box = "ubuntu/xenial64"`. Then run the following commands:

```bash
$ vagrant up                       # Create Vagrant VM
$ vagrant ssh                      # SSH to Vagrant VM
                                   # You can then run commands in Vagrant VM
```

You can then run `vagrant ssh` in that directory any time to connect to the Vagrant VM.

To destroy the Vagrant VM, simply run `vagrant destroy` in that directory.

For more information on advanced Vagrant options and configuration, [see here](https://docs.vagrantup.com/).

> Note
> 
> If Vagrant gives a host error in Virtualbox, make sure hardware virtualization is [enabled in the BIOS](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/5/html/Virtualization/sect-Virtualization-Troubleshooting-Enabling_Intel_VT_and_AMD_V_virtualization_hardware_extensions_in_BIOS.html), and that Virtualbox is able to start a machine with 4 cores. If this doesn’t work, please [contact our support](https://runtimeverification.com/contact).

## Installing RV-Match in Vagrant VM

First, run `vagrant ssh` in `rv-match-vagrant` directory that you created in previous section to connect to our Vagrant VM. Then run the following commands to install `RV-Match`:

```bash
# Install Java 8:
$ sudo apt-get update
$ sudo apt-get install openjdk-8-jdk -y

# Download and run the RV-Match installer
$ curl https://runtimeverification.com/match/match-linux.jar -o match-install.jar
$ sudo java -jar match-install.jar -console
```

Follow the instructions of installer to finish the installation. After that, simply run `kcc` from that environment to compile programs.

To upgrade the RV-Match, download and run the installer again.

Please see `/opt/rv-match/README.md` for more information on using RV-Match.

If you have any issues with RV-Match licensing in your corporate environment, please [contact support](https://runtimeverification.com/contact) for troubleshooting or instructions on installing offline.
