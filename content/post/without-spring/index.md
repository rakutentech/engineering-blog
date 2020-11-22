---
title:        Life without Spring
date:         2020-07-24
authors:      [Boaz Yaniv, Nemo]
draft:        false
hero:         /boaz-yaniv/tech-blog-demo/images/hero-2.jpg
excerpt:      >
  Spring does a lot. Spring is impossible to understand. Spring is industry
  standard. Spring is slow. Spring is easy. Spring is complex. Is it time to
  forget about spring?
---

> In MTSD we use Spring and we found that it works, but it is not the golden child of JVM web frameworks. However there is some disagreement in MTSD, some advocate for Spring, others against it. This is an edited version of [ESD's Tech Stack "How to program without Spring"](https://pages.ghe.rakuten-it.com/id-docs/tech-stack/code/without-spring/) to provide an outside perspective, based on the experiences in ESD, where Spring is used heavily. I made some minor changes to make it more approachable (i.e. a blog post rather than a guideline document), but the gist of it remains unchanged. At the end I draw conclusions from these ESD guideline.
>
> -- Nemo

## Spring is a heavyweight framework

![Heavy dumbbells in the hands of an athlete, about to work out.](./heavyweight.jpg)

Spring was originally conceived as a lightweight alternative to earlier Java frameworks such as early versions of Java EE and Struts. Despite its humble origins, by any modern standard Spring is a heavyweight framework.

### Many Lines of Code

The simplest metric for measuring a heavyweight framework is the amount of lines of code (LoC) that the framework code you're pulling in contains. Spring is quite modular, but a typical spring project often requires many Spring libraries easily reaching over 1 million lines of code imported for just Spring itself.

For comparison, a Java micro web framework such as [Spark](http://sparkjava.com/) sports 22.6k LoC, while an advanced highly-featured lightweight framework such as http4k (which supports many advanced features not even available in Spring, such typesafe contracts, as hot-reloading SPAs, auto-generated Swagger documentation, Kubernetes auto-configuration, etc.) sports a mere 64.1k lines of code with all libraries included!

Spring by comparison, takes 1.3 MLoC just for the base Spring Framework libraries, not including common staples such as Spring Boot, Spring Data and Spring Security!

All of these lines of code cannot be easily read by a single developer or even a dedicated team of developers, meaning it is __nearly impossible__ to be quite sure about what Spring does. This is just not acceptable for ESD, since all of our releases need to be signed off as Safe, and that requires understanding of what the release does. Other frameworks may not be easy to follow up either, but at least the task of reading their code to understand behavior (if necessary) is _humanly possible_.

### Framework Magic

Magic is a definition that is liberally used by critics of frameworks, and can often be overused to mean any type of [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) or user-friendly design. This type of “magic” (just being using friendly) is not necessarily harmful. Every magic is a sort of abstraction, and [abstractions are leaky](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/) — but they are a necessary for managing highly complex software. The bad type of “magic” is really just abstractions that are _hard to follow_.

The simplest example of a good abstraction is probably a function: by extracting common code into a function, I can avoid repeating the same code over and over again, while style being able to understand what the function does when I Cmd+Click (Ctrl+Click for Windows users) on the code. This kind of abstraction actually makes the code even more readable, since once I understood what the abstraction does, I can easily follow up the places it is repeated without having to read the same bulky code again. There are more complex good abstraction that requires more mental effort to understand, but are still simple to follow just by linearly digging in deeper into the code. Here are some examples for such abstractions in increasing order of complexity (actual ease of understanding might change from person to person): classes, generic classes, [functional streams](https://www.baeldung.com/java-8-streams), [Reactive Programming](http://reactivex.io/intro.html) and [Monads](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html).

![Black and white image of a human skull, invoking an uneasy atmosphere.](./skull.jpg)

Bad abstractions (or more appropriately: “evil magic”) are different. When a framework is using bad magic, it's not really utilizing abstraction to simplify your code on the surface level, but instead it just let you write code that seems simple because it is *easy*. However when your program starts up, it tries to analyze your code and opaquely add functionality to your code at runtime that will complete what the framework figured out is missing - which is a complex black box, the opposite of simple. This is generally done by using naming conventions (this is the approach that [Ruby on Rails](https://rubyonrails.org/) takes) or through annotations (this is what Spring does). For example, if Rails encounters a class whose name ends in the word Controller it will treat it as Controller and scan it for methods called `get`, `update` etc. and use them as HTTP endpoints. Spring does the same thing if it encounters a classed annotated with `@Controller` and methods annotated with `@RestMapping`.

The main problem with this approach, is that we cannot really find the code that deals with the annotation just by Cmd+Clicking on the annotation. If we do this, will just see a simple class describing what the annotation does. If we want to actually understand how Spring processes the annotation, we have to scan through the entire Spring codebase and search for all pieces of code that deal with the annotation through reflection. In the worst cases, the annotation name might be even constructed at runtime, meaning that even string search or grep won't help us. Spring does that with thousands of different annotations for many different purposes of course. It is not just controllers, but dependency injection, retry policies, async behavior, logging, tracing, thread-safety, security an many other aspects which are determined by annotations.

But this is far from the only problem with evil magic. Since evil magic is executed at runtime, compile-time type safety goes out the window, leading to more painful development and even bugs in production. For instance, might use the wrong annotation on a Spring Controller or return the wrong type from a controller method and only discover your error at runtime. Another safety concern with evil magic is its opaqueness: your framework might do a lot more than you expected by default (e.g. expose some endpoints that shouldn't be there, or automatically accept both JSON and XML request bodies while you were only planning to support JSON). This type of behavior can lead to confusing bugs and hard-to-detect security issues.

This is not our original opinion, it is a recognized fact by other practitioners, we recommend this 45 minute talk on [What have the annotations done to us?](https://www.youtube.com/watch?v=nlzgJBuZSaA) and this article on [Complexity and Security Implications of Framework Magic](https://www.jtmelton.com/2014/12/30/framework-magic/)

## Differences between Spring and Lightweight Frameworks

### Functional Routes vs. Controllers

Both Spring MVC and Spring WebFlux apps follow the pattern of creating classes annotated with `@Controller` or `@RestController` that contain methods annotated with some sort of request mapping annotations to indicate the HTTP Verb and route. This pattern relies heavily on reflection and evil magic to build the actual HTTP router from controller classes scattered around your code. It's a pretty dangerous pattern since depending on how your configured Spring Boot Auto-configuration, any class in any JAR file that ends up in your runtime classpath could suddenly add an HTTP endpoint to your production code. Please stop a moment tot think about it: with Spring, every library you include can easily add an HTTP endpoint your app. This is truly amazing magic, but its a magic that will more often end up used for evil than for good. While it can be used for making it possible to add a cool dashboard with stats to your app by just including a JAR file, it also means that you often end up with endpoints that you didn't plan on having, if you're not a Spring Expert it's quite hard to track where they're coming from!

Most lightweight Java frameworks (and all popular frameworks made for newer languages after 2010 like Kotlin, Node.js, and Go) are functional in nature. Even Spring 5 has its own [Functional Style](https://spring.io/blog/2016/09/22/new-in-spring-5-functional-web-framework). This modern style defines routes linearly and hierarchically from a central place: your `main()` method. You can start tracing down code from your main method and find the place where each route is defined quite easily. This approach gives you a lot more leeway in how to design your "Controller" code. You can choose different approaches depending on what's most fitting for your app:

1. __All routes in one file__: if you write a very simple microservice with a single-digit number of routes, it's usually best to just define them all in one place. This makes it very easy to review your code.
2. __Creating routes with functions:__ if you find that you have too many routes and want to split them between multiple files, you can define functions that take the Router builder object ([`Router`](https://vertx.io/docs/apidocs/io/vertx/ext/web/Router.html) in Vert.x, or [`Route`](https://api.ktor.io/1.3.1/io.ktor.routing/-route/index.html) in Ktor) and just append a logical group of routes to it. With Kotlin, you can even make these functions extension methods of the router builder, and simply call them like:

```kotlin
// You can pass dependencies in function parameters (manual dependency injection)
router
  .addItemRoutes(itemService)
  .addOrderRoutes(authService, itemService, shopService, orderService)
  .addShopRoutes(shopService, itemService)
  .addUserRoutes(userService)
```

3. __Using a classic controller pattern__: We use this approach in the [clear example app](https://ghe.rakuten-it.com/esd/clear/blob/master/examples/vertx/src/main/kotlin/app/controllers/Controller.kt)[^1]. You can also just create an interface called `Controller` that has just one method called `installRoutes()` that installs the routes on a router builder. It's very useful when you want to use dependency injection heavily, since you can just use any pattern of dependency injection and any type of dependency injection framework by virtue of using a class.

[^1]: clear is a web framework based on Vert.X, built by ESD

### Sharing common functionality across different routes

Spring provides multiple way to implement common functionality across routes. Some of these methods are:

* Shared methods on a controller base class
* Standard Java Servlet Filters
* Spring Interceptors

(This is probably an incomplete list, since Spring is quite complex...)

Likewise, Spring offers multiple methods to configure common functionality globally or scope it certain routes. This can be done by:

* Annotating the route method (or the controller) with a certain annotation and applying an interceptor or filter based on annotation existence and value
* Applying filters based on a URL pattern pattern defined in web.xml
* Applying interceptors and filters globally with Spring MVC auto-configuration
* Applying interceptors and filters globally or on a regex pattern in Spring XML configuration

This list is far from comprehensive, and Spring seems to offer great flexibility here and many possible combinations and permutations of approaches.

Lightweight frameworks, on the other hand, generally provide only one mechanism for implementing common functionality, but let you use this mechanism as a building block for more complex abstraction if necessary. In most cases, the mechanism is called a Middleware, Filter, Interceptor or Handler. They are usually a simplified version of the Filters and Interceptor in Spring - in other words, they are essentially a class implementing interface with one function (or a even function that returns a function!).

The middleware handler function receives a request, possibly modifies and can either forward it by calling to the next middleware handler in the chain (with the final one being the actual route handler) or halts the chain and replies directly to the client. If the handler called the next middleware handler in the chain, it can also modify the response returned by that handler.

Methods for attaching middleware to routes depend on the framework, but one method which can always be used in any framework is just applying the middleware handler function _directly_ to the route code by calling it from there. In fact, you can even implement your own middleware concept on frameworks which do not provide any middleware support, by wrapping the router builder methods with functions that wrap the final route handlers with middleware. Remember: the middleware usually really either:

* Just function that returns another function (that handles the HTTP request and possibly calls the next middleware in chain) _or_
* Just a class that implements an interface with a single function (that does the same)

To get a better understanding of how different frameworks implement this approach refer to the respective documentation:

* [Handlers in Vert.x](https://vertx.io/docs/vertx-web/java/#_handling_requests_and_calling_the_next_handler)
* [Handlers in Jooby](https://jooby.io/#router-handler-decorator)
* [HttpHandlers](https://www.http4k.org/guide/modules/core/#httphandlers) and [Filters](https://www.http4k.org/guide/modules/core/#filters) in Http4k[^2]
* [Middleware in Go](https://www.alexedwards.net/blog/making-and-using-middleware)
* [Middleware in Node.js wit Express](https://expressjs.com/en/guide/using-middleware.html)

[^2]: This is actually the cleanest method: `HttpHandlers` are just functions that take a `Request` and return a `Response`. `Filters` are just functions that take an `HttpHandler` (next handler in chain) and return a new `HttpHandler` (which might inspect/modify the request and response and call the next handler in chain).

For deeper theoretical coverage of the ideas behind functional routes and handlers, you can read the paper [Your Server as a Function](https://monkey.org/~marius/funsrv.pdf) which came out of Twitter (examples in the paper are in Scala). Two frameworks closely following the ideas described in this paper are Twitter's [Finagle](https://twitter.github.io/finagle/) and [Http4k](https://www.http4k.org/).

### Async Processing

Spring combines both blocking and non-blocking routes in the same app in various complex ways which can be quite confusing (and makes it very hard to reason about performance and control flow). Lightweight frameworks, on the other hand, are a million times simpler. Almost all lightweight frameworks are either all-blocking (http4k, Spark) or all-asynchronous (Vert.x, Jooby, Ktor).

Blocking frameworks grab a thread from the thread pool for each request they receive and then keeping running the request on the same thread until completion. This approach is simpler, since you can more easily reason about the control flow or use Thread Local Storage for contextual data (Warning: since this usage makes unit testing much harder it's not recommended to use this for anything besides logging and tracing!). It's also easier to integrate with many traditional Java libraries (most prominently JDBC!) which are blocking by nature. The downside of blocking I/O is that the thread pool itself is a limited resource (you can have allocate more threads on the pool, but then your service will require more memory) and therefore the number of concurrent requests you can handle is bounded by your memory size and your app often ends up requiring a lot more memory to accommodate the thread. Blocking frameworks especially perform bad when you have requests that take long time to complete, since these requests will use up your limited thread pool and stop other request from coming in.

Non-blocking frameworks allow you to achieve better maximum throughput because they only use a small number of threads and run requests through an event loop. This means that request handlers cannot block — instead, they need to perform blocking operations using an asynchronous API. Java and Kotlin frameworks and libraries usually use one of three approaches for asynchronous processing:

* __Callbacks:__ This is the simplest and most traditional method, but also the hardest one to use correctly. It is based around the concept of calling a callback function every time an operation is complete or a new event in a stream (e.g. a new chunk of the HTTP request or response body) comes in. Handling exception with callbacks require special care, because you must remember to explicitly catch them and check for them, and also since the method for conveying exceptions varies greatly between different frameworks and libraries.
* __CompletableFutures:__ [CompletableFutures](https://www.baeldung.com/java-completablefuture) are objects that standardize the way of handling callbacks and errors in a unified way, and let you combine asynchronous operations more easily and naturally. Since CompletableFutures are actual objects that are returned when calling an asynchronous functions, you can further process them and pass them on to other pieces of your code which might want to handle the callback. They still require some care when dealing with exception and branches, and do not provide for a natural flow like Coroutines, but fortunately if you've got an API using callbacks, it's extremely easy to convert them to use with Kotlin coroutines using the `.await()` extension method. Please note that the standard Java [Future](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Future.html) (unlike CompletableFuture which was added only in Java 8), is blocking, and does not support asynchronous processing.
* __Kotlin Coroutines:__ This is the easiest method of asynchronous processing, but it is only available on Kotlin (Java is working on adding support for Coroutines with [Project Loom](https://openjdk.java.net/projects/loom/), but it will probably take many years until it is delivered in a production JDK). Coroutines allow you to special mark an asynchronous function with the `suspend` keyword, and then call it from within any [coroutine context](https://kotlinlang.org/docs/reference/coroutines/coroutine-context-and-dispatchers.html) as if it was just a normal synchronous function. This means, that in Kotlin asynchronous functions can call any other asynchronous function with with code that looks and feels like a synchronous code (and thus is clearer to read), but behaves behind the scenes in a non-blocking manner! Kotlin coroutines also make error handling match simpler, since any exception thrown in an asynchronous coroutine gets passed on to the coroutine that calls it, _as a normal exception_ (instead of a special callback).

Please note that classic Reactive programming libraries (such as RxJava), are not asynchronous by nature, and in most cases are actually require dedicated threads. [Kotlin Flow](https://kotlinlang.org/docs/reference/coroutines/flow.html) provides a high-performance all-async Reactive Programming model, and it's recommended to try it if you want to be absolutely sure your code is running without blocking while using Reactive programming.

Libraries and frameworks you depend on might be using all three different methods, but it is highly recommended to stick to Kotlin Coroutines, since they are the easiest and safest to use. If the library you're using is using a CompletableFuture, it's very easy to integrate, but for callback some careful glue code should be written to wrap them with coroutines. If you have blocking library calls you can't avoid (most commonly this would be JDBC) you should take care to execute those calls outside of the main event handler in a blocking thread, managed by a blocking pool. Most asynchronous frameworks provide mechanisms for executing the rest of request in a blocking thread, but even if they don't, you can use Java [ExecutorService](https://www.baeldung.com/java-executor-service-tutorial) (e.g. by calling `Executors.newFixedTheadPool(size)`) to create and manage a thread pool for you, and then just dispatch blocking handlers on that pool.qs

### Logging

Just as with Spring, Logging in the Java backend world, generally means depending on the [SLF4J](http://www.slf4j.org/) facade and probably [Apache Log4j 2](https://logging.apache.org/log4j/2.x/) as the backend (Logback is also still popular but it's less well maintained). SLF4J is quite old, and carries a few bad design decisions that don't work well with modern practices (it's textual instead of structured, can only pass parameters in MDC and makes some use of untyped Objects), but there is currently no other alternative for either Java or Kotlin that can compete with it.

If you need to log some data globally (i.e. for every request), you can do that with a simple middleware.

See also:

1. [Idiomatic usage of SLF4J loggers in Kotlin](https://www.baeldung.com/kotlin-logging)
2. [Kotlin-logging](https://github.com/MicroUtils/kotlin-logging): a Library that implements idiomatic Kotlin logging patterns (the code is simple enough to copy paste into your app if you only need part of it and don't want to introduce a dependency)
3. The [ESD Book chapter on Logging](https://book.esddocs.net/goto/logging) is almost production ready.

### Retry Support

Spring provide support for retry with annotation. Due to the _evil magic_ of annotations, it's quite hard to review this retry mechanism and prove it does what we want it to do, so using Spring Retry is not recommended and is not perceived as providing provable safety benefits during release review. We already had to reject one release due to the inscrutability of Spring Retry. If you want to add retry functionality in your app, there are much better alternatives.

#### Service mesh retry policies

If you're using a service mesh like Istio, the best approach is to configure all retries on the service mesh level. With Istio you can set up [retry policies](https://istio.io/docs/concepts/traffic-management/#retries) like this:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: item-api
spec:
  hosts:
  - api.item.rakuten.co.jp
  http:
  - route:
    - destination:
        host: api.item.rakuten.co.jp
    retries:
      attempts: 3
      perTryTimeout: 2s
```

Istio can also configure other policies beyond retries like circuit breakres, load balancing, canary traffic routing, connection pooling and fault injection. The advantage of setting retry policies on the service mesh level, is that all network behavior (which retries are part of) is concentrated in the same place.

#### Procedural retries

Procedural retries are retries that take a block of code (usually a function or a functional interface) and re-execute it when it fails with a specified set of exceptions. Spring Retry is similar to procedural retries, but instead of being called explicitly, it is determined and injected in runtime using annotations and reflection magic. Procedural retries work otherwise.

__Procedural retry in Java with Resilience4j__

```java
// Simulates a Backend Service
public interface BackendService {
    Response doSomething();
}

BackendService backendService = BackendServiceFactory.getBackendService();

RetryConfig config = RetryConfig.custom()
  .maxAttempts(3)
  .intervalFunction(
    IntervalFunction.ofExponentialBackoff(IntervalFunction.DEFAULT_INITIAL_INTERVAL, 2d)
  )
  .retryOnResult(response -> response.getStatus() == 500)
  .retryOnException(e -> e instanceof WebServiceException)
  .retryExceptions(IOException.class, TimeoutException.class)
  .ignoreExceptions(BunsinessException.class, OtherBunsinessException.class)
  .build();

// Create a RetryRegistry with a custom global configuration
RetryRegistry registry = RetryRegistry.of(config);

// Get or create a Retry from the registry -
// Retry will be backed by the default config
Retry retry = registry.retry("retry1");

// Decorate your call to BackendService.doSomething() with a CircuitBreaker
Supplier<Response> doSomethingWithRetry = Retry
  .decorateSupplier(retry, backendService::doSomething);

Response response = doSomethingWithRetry()
```

__Procedural retry with kotlin-retry__

```kotlin
// Simulates a Backend Service
public interface BackendService {
    Response doSomething();
}

BackendService backendService = BackendServiceFactory.getBackendService();

val response = retry(limitAttempts(3) + fullJitterBackoff(base = 10L, max = 5000L)) {
  backendService.doSomething()
}
```

#### Reactive Retries

Reactive retries are similar to procedural retries, but are using Reactive Programming. Since reactive programming building blocks (such as [Singles](http://reactivex.io/documentation/single.html), [Observables](http://reactivex.io/documentation/observable.html) and [Flowables](http://reactivex.io/RxJava/3.x/javadoc/io/reactivex/rxjava3/core/Flowable.html) in RxJava or [Flows](https://kotlinlang.org/docs/reference/coroutines/flow.html) in Kotlin) are composable, it's very easy to add support for circuit breakers, multiple fallbacks, recovery methods and other patterns on top of any retry.

__Retry with Kotlin Flow__

```kotlin
interface BackendService {
  suspend fun doSomething(): Response
}
 
val backendService: Backendservice by inject() // using dependency injection
 
val response = backendService::doSomething
  .asFlow() // Convert coroutine call to reactive flow
  .retryExponentially(
        maxRetries = 5,
        initialDelay = 50 // 50ms
        maxDelay = 30_000 // 30 seconds
  )
  .single() // Take only a single element from the flow
```

Please see the implementation of [retry](https://git.rakuten-it.com/projects/ESAUTH/repos/rtoken-java/browse/src/main/com/rakuten/esauth/rtoken/util/rx/ExponentialRetry.kt?at=refs%2Fheads%2Fflow-based-version) for Kotlin Flows. You can use it as a base to implement your own retry policy. Kotlin Flow is part of the Kotlin Extended Standard Library (kotlinx), so they offer high maturity and support and do not require extra dependencies (kotlinx is already included in most Kotlin projects).

#### Retrying using the client library

Many HTTP clients, RPC clients and JDBC drivers and connection pools provide retry support at the client library level. Client-level retries policies generally come with the following trade-offs compared to procedural and reactive retries:

##### Pros

* Client libraries sometimes provide more granular control for retries and timeout policies for different part of the request and session lifetime, e.g. separate retry policies for initial connection, session establishment and individual requests.
* The client library might have better domain knowledge about when it is safe to retry (e.g. distinguishing idempotent requests from destructive requests in HTTP).
* Since the client library is already used, we can possibly reduce the amount of libraries we depend on.

##### Cons

* Client libraries are usually less flexible in supporting advanced retry algorithms, especially retry with exponential backoff.
* Client libraries usually do not support other safety mechanism such as circuit breakers
* If we need to retry a complex operation (a ___transaction___) that spans multiple requests or even multiple external systems, a client library cannot help us

## Wrap Up: Farewell Spring 👋

> -- by Nemo

So what does all that mean?

Spring does everything. Even some things that it maybe shouldn't do (e.g. retries). In Spring you can do most things in multiple ways. Spring uses evil magic excessively. As a result it is easy to write, hard to read, impossible to understand. Everything you do in Spring you can achieve by using a lightweight framework, arguable in a way that [communicates intent more explicitly](https://pages.ghe.rakuten-it.com/ssed/tech-blog/posts/make-it-explicit/).

**All indicators point to an inevitable conclusion: it's time to say goodbye to Spring.**

![Banner of "Brave New World" based on the dystopian novel by Aldous Huxley](./brave-new-world.jpg)

This will be unpopular among the seasoned spring developers, _I know_. After years reverse engineering what spring does with all the annotations and learning about Springs pitfalls by falling into the pit of snakes time and time again - I understand that it feels like selling a bad investment, incurring a painful loss. But let's not throw good money after the bad! It's time to cut our losses. Let's not sacrifice more developer life energy at temple of evil Spring magic.

Let's start anew, in a brave new world of Vert.X, or Ktor or Node express... 🤩
