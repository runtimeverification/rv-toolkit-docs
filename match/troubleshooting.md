# Problems running RV-Match?

We list below some possible issues occurring when using RV-Match and ways to address them. For any unlisted issue you might experience, or for any questions or suggestions, please contact us at the [RV Contact](https://runtimeverification.com/contact/).

## Java 8 is required

If you get installation errors or errors when calling `kcc`, make sure that you run Java 8 or higher. We tested RV-Match with [Oracle Java 8 JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), but the JRE should be sufficient.

## Program does not terminate

Due to the complex analyses performed, both `kcc` and the `kcc`-compiled program are orders of magnitude slower than `gcc` and the `gcc`-compiled program. If waiting longer or getting a faster machine is not possible, then try to minimize your program and/or its input. For example, it may be a good idea to run unit-tests, or to execute each function separately.

## [Windows] Editing programs

You can either execute existing C programs, or write new ones using your favorite editor or IDE from Windows itself. The RV-Match terminal opens in your home directory under the MSYS2 installation, which should be at `C:/RV-Match/msys/home`. The MSYS environment behaves exactly like Windows Powershell or cmd. In case you want to install a text editor under MSYS2 itself, you can do with something like:

```
pacman -S nano vim
```

You can also use Windows text-editors from the RV-Match terminal by referring to their executables (they must be on the Windows PATH, accessible from Windows cmd, and MSYS2 must be restarted after adding them to the path):

```
notepad [file]
C:/Program Files (x86)/Notepad++/notepad++.exe [file]
(or notepad++ [file] with notepad on the Windows PATH)
```

## [Windows] Installing Additional Packages

The RV-Match terminal uses MSYS2. The default MSYS2 environment for running RV-Match comes with the Pacman package manager, which can be used for installing or upgrading the software packages available to this environment. This includes installing additional libraries, compilers, or dependencies. A guide on installing packages in MSYS2 is here: [http://sourceforge.net/p/msys2/wiki/MSYS2%20installation/](http://sourceforge.net/p/msys2/wiki/MSYS2%20installation/)

## [Windows] Kerberos

MSYS2 comes installed by default with Kerberos, which includes an executable named `kcc`, same like our tool. We have renamed this program for convenience to avoid conflicts on the path to `/usr/bin/kcc_kerberos.exe`. If you find that this causes any issues, you can rename the file back to `kcc.exe` to restore default settings, and access the RV-Match `kcc` using its alias kclang.
