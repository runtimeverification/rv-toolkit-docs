# Running Examples

We provide several examples showcasing various capabilities of RV-Match’s `kcc` tool, in a folder [examples](https://github.com/kframework/c-semantics/tree/master/examples/c). We recommend [examples/demo](https://github.com/kframework/c-semantics/tree/master/examples/c/demo) as a good starting point for exploring the bug finding capabilities of `kcc`. For any file in that directory, simply run `kcc [file].c` to compile it, followed by `./a.out` to execute it. We next discuss some of the programs in the demo folder, mentioning that they only cover a small subset of the errors that `kcc` can report.

## Unsequenced Side Effects

At its most basic level, `kcc` can detect undefined behaviors in programs. Consider the following three-line `1-unsequenced-side-effect.c` program:

```c
int main() {
  int x = 0;
  return (x = 1) + (x = 2);
}
```

If you compile it using `clang`, you get a warning about the undefined behavior, but it returns 3 like one might expect. A developer might choose to ignore this warning, not understanding its significance. However, then one day you decide to switch compilers and run this program with `gcc`. Suddenly, you get the entirely unexpected value of 4. How is this possible? Well, compilers are allowed to optimize however they choose as long as they do not affect the behavior of well-defined programs. So what `gcc` has chosen to do is to hoist the side effects out of the addition expression so that they happen before. Thus this program becomes:

```c
int x = 0;
x = 1;
x = 2;
return x + x;
```

This example demonstrates how the increased optimization of compilers means that even quite simple and harmless-seeming undefined behaviors can actually affect the behavior of the program. As a developer, you should avoid writing such programs with undefined behaviors. When compiled with `kcc`, you get the following error message when you run the same program:

```
Unsequenced side effect on scalar object with side effect of same object.
  at main(1-unsequenced-side-effect.c:25:3)
 Undefined behavior (UB-EIO8).
  see C11 section 6.5:2 http://rvdoc.org/C11/6.5
  see C11 section J.2:1 item 35 http://rvdoc.org/C11/J.2
  see CERT-C section EXP30-C http://rvdoc.org/CERT-C/EXP30-C
```

The error message explains what the problem is and refers you to the specific sections in the [ISO C11 Standard](http://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=57853) that discuss it. There are more than 150 [error codes](https://github.com/kframework/c-semantics/blob/master/examples/c/error-codes/Error_Codes.csv) like UB-EIO8 above that kcc can report, as well as corresponding [canonical programs](https://github.com/kframework/c-semantics/tree/master/examples/c/error-codes) illustrating them.

## Buffer Overflows and Underflows

It is well-known that programs allowing buffer overflows or underflows are susceptible of security attacks, and thus should be avoided by any possible means. `kcc` is capable of detecting quite a wide variety of different buffer overflows. The file [2-buffer-overflow.c](https://github.com/kframework/c-semantics/blob/master/examples/c/demo/2-buffer-overflow.c) illustrates buffers with both internal, external, and no linkage, buffers with both static and automatic storage duration, and buffers aliased through both static- and automatic-storage pointers. In each case, `kcc` is able to detect the buffer overflow and print a stack trace on the command line of where it has occurred in the program. `kcc` can also detect buffer overflows within the subobjects of an aggregate type. Program `3-array-in-struct.c` shows a struct declared with an array followed by an integer:

```c
struct foo {
  char buffer[32];
  int secret;
};

int idx = 0;

void setIdx() {
  idx = 32;
}

int main() {
  setIdx();
  struct foo x = {0};
  x.secret = 5;
  return x.buffer[idx];
}
```

It is correct to assume that the struct is laid out sequentially in memory. However, nonetheless, it is a buffer overflow to access the 32nd index of this array because it was declared with size 32. `gcc` succesfully compiles this program and the secret 5 is returned when executed, showing how easily buffer overflows can leak sensitive information contained elsewhere in a struct. As expected, `kcc` correctly reports an error:

```
Dereferencing a pointer past the end of an array.
  at main(3-array-in-struct.c:24:3)
 Undefined behavior (UB-CER4).
  see C11 section 6.5.6:8 http://rvdoc.org/C11/6.5.6
  see C11 section J.2:1 items 47 and 49 http://rvdoc.org/C11/J.2
  see CERT-C section ARR30-C http://rvdoc.org/CERT-C/ARR30-C
  see CERT-C section ARR37-C http://rvdoc.org/CERT-C/ARR37-C
  see CERT-C section STR31-C http://rvdoc.org/CERT-C/STR31-C
```

Similarly, `kcc` can detect buffer underflows. For example, `4-buffer-underflow-external.c` shows a buffer underflow based on the initialized value of a global variable found elsewhere in the program:

```c
unsigned int gi = 0;

int main() {
  unsigned int i;
  unsigned int ary[2][50];
  i = gi;
  ary[0][i-1] = 2;
  return ary[0][i-1];
}
```

`gcc` compiles this program with no warnings or errors and the resulting executable returns 2. Because `kcc` is a dynamic analysis tool, we run the program and are thus actually aware of the value that `gi` has during its assignment statement. No matter what logic has modified `gi` up to this point, if its value is zero when we execute:

```c
i = gi;
ary[0][i-1] = 2;
```

we will detect the buffer underflow on the second dimension of the array. In fact, `kcc` detects several undefined behavior errors in this program.

## Input-Dependent Behavior

We now discuss an example showing that undefined behavior can depend on the non-deterministic environment in which the program is executed. Consider the program `5-buffer-overflow-environment.c`:

```c
static void sampleFunc(char *path, char *input) {
  char *argvptr;
  argvptr = input;
  if (argvptr)
    while ((*path++ = *argvptr++) != 0);
  return;
}

int main(int argc, char **argv) {
  char p[10];
  sampleFunc(p, argv[1]);
  return 0;
}
```

If we pass no argument to this executable, the while loop is not called. If we pass an argument with no more than 9 characters (10 with the null terminator), the program is also well-defined. However, if we pass a longer string as input, then a buffer overflow occurs. This buffer overflow may or may not result in a runtime error when the program is compiled with conventional compilers like `gcc`, depending on the size of the input; for example, you will most likely see no error when you pass it the 10-character input `abcdefghij`. When compiled with `kcc`, several undefined behavior errors are reported making it clear what the problem is and where:

```
A pointer (or array subscript) outside the bounds of an object.
  at sampleFunc(5-buffer-overflow-environment.c:18:5)
  by main(5-buffer-overflow-environment.c:24:3)
 Undefined behavior (UB-CEA1).
  see C11 section 6.5.6:8 http://rvdoc.org/C11/6.5.6
  see C11 section J.2:1 item 46 http://rvdoc.org/C11/J.2
  see CERT-C section ARR30-C http://rvdoc.org/CERT-C/ARR30-C
  see CERT-C section ARR37-C http://rvdoc.org/CERT-C/ARR37-C
  see CERT-C section STR31-C http://rvdoc.org/CERT-C/STR31-C
Found pointer that refers outside the bounds of an object + 1.
  at sampleFunc(5-buffer-overflow-environment.c:18:5)
  by main(5-buffer-overflow-environment.c:24:3)
 Undefined behavior (UB-CEE3).
  see C11 section 6.3.2.1:1 http://rvdoc.org/C11/6.3.2.1
  see C11 section J.2:1 item 19 http://rvdoc.org/C11/J.2
  see CERT-C section ARR30-C http://rvdoc.org/CERT-C/ARR30-C
  see CERT-C section ARR37-C http://rvdoc.org/CERT-C/ARR37-C
  see CERT-C section STR31-C http://rvdoc.org/CERT-C/STR31-C
Dereferencing a pointer past the end of an array.
  at sampleFunc(5-buffer-overflow-environment.c:18:5)
  by main(5-buffer-overflow-environment.c:24:3)
 Undefined behavior (UB-CER4).
  see C11 section 6.5.6:8 http://rvdoc.org/C11/6.5.6
  see C11 section J.2:1 items 47 and 49 http://rvdoc.org/C11/J.2
  see CERT-C section ARR30-C http://rvdoc.org/CERT-C/ARR30-C
  see CERT-C section ARR37-C http://rvdoc.org/CERT-C/ARR37-C
  see CERT-C section STR31-C http://rvdoc.org/CERT-C/STR31-C
Trying to write outside the bounds of an object.
  at sampleFunc(5-buffer-overflow-environment.c:18:5)
  by main(5-buffer-overflow-environment.c:24:3)
 Undefined behavior (UB-EIO2).
  see C11 section 6.5.6:8 http://rvdoc.org/C11/6.5.6
  see C11 section J.2:1 items 47 and 49 http://rvdoc.org/C11/J.2
  see CERT-C section ARR30-C http://rvdoc.org/CERT-C/ARR30-C
  see CERT-C section ARR37-C http://rvdoc.org/CERT-C/ARR37-C
  see CERT-C section MEM35-C http://rvdoc.org/CERT-C/MEM35-C
  see CERT-C section STR31-C http://rvdoc.org/CERT-C/STR31-C
```

If we pass it a string of fewer characters, say `abcdefghi`, then `kcc` reports no errors. Therefore, `kcc` is very precise, following the exact path explored during the actual execution of the program and thus reporting no false alarms. On the other hand, the price to pay for its precision is that it can miss errors; indeed, if all your tests for the program above have inputs of 9 characters or less, then `kcc` currently has no chance to detect the buffer overflow.

We plan to extend RV-Match in the future with (bounded model checking) technology that can explore the nondeterministic state space of a program based on its input conditions, which would eventually allow errors of this type to be detected even if the user cannot think of an input that exercises the bug. This will be possible still without the need for any false positives.

In the meanwhile, we recommend RV-Match to be used as a complementary approach to static analysis, and not as a replacement of it, by simply executing your existing unit tests compiled with `kcc` instead of `gcc` (or your usual compiler). This is currently the best way to maximize the benefits of `kcc`, because unit tests tend to provide good code/path coverage and to be fast.

## Implementation-Defined Behavior

`kcc` is also able to detect errors related to implementation-defined behavior, which the C standard defines as unspecified behavior where each implementation documents how the choice is made. `kcc` can be instantiated with different profiles corresponding to different implementation choices (type kcc -v to see the existing profiles; [contact us](https://runtimeverification.com/contact) if you are interested in a specific profile that is not available. An example of implementation-defined behavior is the conversion to a type that cannot store a specified value, thus triggering a loss of precision. Consider the following `6-int-overflow.c` program, which executes without any reported errors when compiled with conventional compilers like `gcc`:

```c
int main() {
  short int a = 1;
  int i;
  for (i = 0; i < 15; i++) {
    a *= 2;
  }
  return a;
}
```

When compiled with the default `kcc` profile (x86\_64 on linux), the program above reports an implementation-defined behavior error:

```
Conversion to signed integer outside the range that can be represented.
  at main(6-int-overflow.c:29:5)
 Implementation defined behavior (IMPL-CCV2).
  see C11 section 6.3.1.3:3 http://rvdoc.org/C11/6.3.1.3
  see C11 section J.3.5:1 item 4 http://rvdoc.org/C11/J.3.5
  see CERT-C section INT31-C http://rvdoc.org/CERT-C/INT31-C
```

However, no error is reported if you declare variable `a` as `int` instead of `short int`, or if you iterate 14 times instead of 15. What happens above is that the multiplication of `a` by 2 promotes the result to the `int` type at every step, and then converts it back to a `short int` in order to write `a`; at some moment during the execution of the program this conversion cannot be made without loss of precision, and at that moment the error above is reported by our tool. However, in actual fact, because the program above as written is implementation-defined, on some systems it may in fact raise an arithmetic signal terminating the application at the point of the lossy conversion. But of course there is no guarantee that it will happen and thus such a dangerous implementation-defined behavior may pass undetected during normal testing, crashing your application when deployed on a different platform.

Note that even the most experienced C programmers can get confused in the presence of implementation-defined behavior, and especially at the boundary between undefined behavior and implementation-defined behavior. For example, one may wrongly think that the program above manifests an integer overflow behavior, which according to the C standard is an undefined behavior. If you declared `a` as an `int` and iterated 31 times, you would then indeed see an undefined behavior corresponding to a true integer overflow.

## Out of Lifetime Access

Consider the program 7-out-of-lifetime.c:

```c
int *foo(int x) {
  int z = x;
  int *y = &z;
  return y;
}

int main() {
  int *x = foo(0);
  foo(255);
  return *x;
}
```

When this example is run with `gcc -O3`, the value stored in `z` can be seen when the program exits. However, if optimizations are disabled or if a different compiler is used, the layout of variables on the stack may change. This causes the call `foo(255)` to overwrite the same location in memory that was used for the integer `z` in the first call to `foo`. Because the variable `z`‘s lifetime has ended when `foo` returns, it is undefined for us to have returned a pointer to it from the function. Thus we find that the pointer `x` has an indeterminate value and can be changed by subsequent calls to `foo`. As a result of this, we see the value 255 returned from `main`, which is not what we expected. This again underscores the importance of avoiding undefined behavior in programs, because it can lead to unexpected behaviors like this. When run with `kcc`, the following errors are reported:

```
Referring to an object outside of its lifetime.
  at main(7-out-of-lifetime.c:22:3)
 Undefined behavior (UB-CEE4).
  see C11 section 6.2.4:2 http://rvdoc.org/C11/6.2.4
  see C11 section J.2:1 item 9 http://rvdoc.org/C11/J.2
  see CERT-C section DCL21-C http://rvdoc.org/CERT-C/DCL21-C
  see CERT-C section DCL30-C http://rvdoc.org/CERT-C/DCL30-C
  see CERT-C section MEM30-C http://rvdoc.org/CERT-C/MEM30-C
Referring to an object outside of its lifetime.
  at main(7-out-of-lifetime.c:23:3)
 Undefined behavior (UB-CEE4).
  see C11 section 6.2.4:2 http://rvdoc.org/C11/6.2.4
  see C11 section J.2:1 item 9 http://rvdoc.org/C11/J.2
  see CERT-C section DCL21-C http://rvdoc.org/CERT-C/DCL21-C
  see CERT-C section DCL30-C http://rvdoc.org/CERT-C/DCL30-C
  see CERT-C section MEM30-C http://rvdoc.org/CERT-C/MEM30-C
```

## Overflow and Optimizations

As an example of a program that seems to run perfectly in one environment but can crash or behave incorrectly in another environment consider the program `8-int-overflow-tricky.c`:

```c
#include<stdlib.h>
#include<limits.h>
#include<stdarg.h>

void foo(int n, ...) {
  va_list l;
  va_start(l, n);
  char *x = va_arg(l, char *);
  x[0];
  x[1];
  va_end(l);
}

void process_something(int size) {
  if (size < 0)
    abort();
  // check for overflow
  if (size > size+2)
    return;
  char *string = malloc(size+2);
  string[0] = 'f';
  string[1] = '\000';
  char x[2];
  foo(1, string);
}

int main() {
  process_something(INT_MAX);
}
```

Note the line annotated “check for overflow”. A user, on seeing this program, may assume that this check correctly handles the case where `size+2` overflows, and that this program will therefore exit normally after returning from the function without calling `malloc`. Indeed, if you compile this program with `gcc` using no flags, that is exactly what happens.

However, if at a later date someday you decide to change your compiler flags and build with `-O3`, suddenly this program will segfault. Why? Well, overflow on a signed integer is what is considered an exceptional condition, and according to the ISO C11 standard, this behavior is undefined. `gcc` is free to assume that undefined behavior can never occur and optimize accordingly, thus causing the line `if (size > size+2)` to be replaced in the resulting binary with `if (0)`.

`kcc` correctly reports the signed overflow error:

```
Signed integer overflow.
  at process_something(8-int-overflow-tricky.c:48:3)
  by main(8-int-overflow-tricky.c:59:3)
 Undefined behavior (UB-CCV1).
  see C11 section 6.5:5 http://rvdoc.org/C11/6.5
  see C11 section J.2:1 item 36 http://rvdoc.org/C11/J.2
  see CERT-C section INT32-C http://rvdoc.org/CERT-C/INT32-C
```

## Warnings, or Lint-Style Issues

There is a sharp distinction between *errors* and *warnings* in our C semantics and `kcc`. Errors violate the ISO C11 standard, so you must fix them immediately if you want your program to be standards-compliant and thus portable. On the other hand, warnings, which we also refer to as *lint-style issues*, may be indicative of potential defects in your program even though they can also occur in strictly-conforming C11 programs. Fixing warnings is optional. For example, most coding guidelines that aim at safer code, like [Misra-C](https://en.wikipedia.org/wiki/MISRA_C), *require* standard-compliance but are subjective in what regards lint-style issues, or warnings. `kcc` also provides a mechanism that can detect a collection of common lint-style issues, and it continues to expand it at our customer requests, which are reported as warnings when you use the `-Wlint` option/flag. For example, the program `9-memory-leak.c` below exhibits a memory leak, wherein memory is allocated by `malloc` but never freed:

```c
#include<stdlib.h>

int main() {
  int *x = malloc(sizeof(int));
  *x = 0;
  return *x;
}
```

No compiler reports any issues with this program and no runtime errors are reported when executed. Same with `kcc` by default, because indeed, this program does not violate any of the ISO C11 standard rules. However, if you compile this program with `kcc -Wlint` and execute it, then you get the following warning report:

```
Memory malloced but never freed.
 Malloced here:
  at malloc(9-memory-leak.c:26:3)
  by main(9-memory-leak.c:26:3)
 Possible unintended behavior (L-CEIE1).
  see CERT-C section MEM31-C http://rvdoc.org/CERT-C/MEM31-C
```

Besides memory leaks, `kcc` reports several other kinds of warnings such as unsigned integer overflow, terminating a thread while holding a lock, allocating more memory on the heap than is allowed by the operating system, etc.

The `-Wlint` flag does not alter the semantics of the program in any way aside from assigning a maximum memory size configurable using `-fheap-size`, beyond which heap-allocation functions like `malloc` will report a warning and return a null pointer. Some of the warnings reported when using the `Wlint` option may be unnecessary, in the sense that the behavior being reported was indeed your intention. Note, however, that `kcc` still reports no false positives, in the sense that if a warning is reported as a result of `Wlint`, then there really exists a real code execution for which the specific behavior being detected did occur.

## And Many More

The above are only a few of the different types of errors, like undefined behavior, that `kcc` is able to detect. Other undefined behaviors which have been discovered frequently in real code bases include use of functions that have not been declared, creation of incorrectly aligned pointers, comparison between pointers to different memory objects, and incorrect use of dynamic format strings to `printf`. If you want to see all the different types of errors or warnings that `kcc` can report, see its complete list of [error codes](https://github.com/kframework/c-semantics/blob/master/examples/c/error-codes/Error_Codes.csv) as well as the corresponding [canonical programs](https://github.com/kframework/c-semantics/tree/master/examples/c/error-codes) illustrating them.
