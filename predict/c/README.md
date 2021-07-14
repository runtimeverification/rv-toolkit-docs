# RV-Predict/C

RV-Predict/C is the only dynamic data race detector that is both sound and maximal. *Dynamic* means that it executes the program in order to extract an execution trace to analyze. *Sound* means that it only reports races which are real (i.e., no false positives). And *maximal* means that it finds all the races that can be found by any other sound race detector analyzing the same execution trace. The technology underlying RV-Predict is best explained in the following papers:

> Jeff Huang, Patrick O'Neil Meredith, and Grigore Rosu. 2014. [Maximal sound predictive race detection with control flow abstraction](http://dx.doi.org/10.1145/2594291.2594315). In Proceedings of the 35th ACM SIGPLAN Conference on Programming Language Design and Implementation (PLDI '14). ACM, New York, NY, USA, 337-348.
>
> Traian-Florin Serbanuta, Feng Chen, and Grigore Rosu. 2012. [Maximal Causal Models for Sequentially Consistent Systems](http://dx.doi.org/10.1007/978-3-642-35632-2_16). In Proceedings of the 3rd International Conference on Runtime Verification (RV '12). LNCS Volume 7687, 2013, pp. 136-150

## Contents

* [Installation](./installation.md)
* [Quickstart](./quickstart.md)
* [Running Examples](./runningexamples.md)  
* [RV-Predict Blog](https://runtimeverification.com/blog/category/rv-predict)