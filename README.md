# TPF Streaming Query Executor Demo

This is a repository for the live [TPF Streaming Query Executor](https://github.com/rubensworks/TPFStreamingQueryExecutor) train shedule demo.

## Problems
* At the ldf-client node_module, change the accept-header in `lib/util/request-browser.js` to `application/n-quads;q=1.0,text/turtle;q=0.9,application/n-triples;q=0.7,text/n3;q=0.6`.
* At the time-annotated-query node_module, fix the variable `require()`.