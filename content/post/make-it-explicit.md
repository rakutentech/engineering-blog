---
title:        Make It Explicit
date:         2020-09-15
hero: /boaz-yaniv/tech-blog-demo/images/hero-4.jpg
authors:
  - Nemo
draft:        false
excerpt: >
  Why is software code so damn hard to read?  I argue it's tot because it's hard
  or because programming languages are stupid - it's because developers and
  tools don't make their intent explicit. Code doesn't read like a short story
  or a poem - but it should! So just make it explicit for god sake...
---

Recently I did some pair programming and code review with a developer, we added deep links into our Android application. All in all that's a pretty simple task.

During the cycles of code review and pairing I realized that I first recommended to use one technique during pair programming, just to argue against it in a later on in code review. That made me think - Do I have some type of split brain thing going on here? Why do I flip flop like that? 🤔

Let's look at code: The first version I saw (slightly modified) was this:

```kotlin
const val DEEPLINK_PATH = "/deepLinkPath"
const val DEEPLINK_SHEMA = "deeplink-schema"

fun handleDeeplink(intent: Intent?) {
    intent?.action?.let { action ->
        intent.data?.let { data ->
            if (action == Intent.ACTION_VIEW) {
                if (DEEPLINK_SCHEMA == data.scheme) {
                    if (DEEPLINK_PATH == data.path) {
                        data.path?.let { path ->
                            println("do the thing!")
                        }
                    }
                }
            }
        }
    }
}
```


Well this is overly complicated, if I would put it into plain language it would be:

> I look at the intent[^1], if it's not null, if it has an action, if it has data, and the action is `ACTION_VIEW` and the data has the URL schema that I expect and if it has the path that I expect, if the path is not null, then I *do the thing*.

[^1]: `Intent` is an Android framework class, you can think of it as a value object that carries the intent of a message the operating system sent to your application. For example when the application launches or when the operating system sends a broadcast to your applications with updates of the battery level.

![What did you just say?!](http://nemo.oudeis.fyi/wut.png)

Wait what? Huh?

Nobody wants to hear that. If I say that to you then your ears will start bleeding.

Not to speak of the indentation, it's horribly hard to read. This piece of code goes to great efforts to *conceal* its intent!

I suggested to simplify the conditionals and remove that indentation by introducing bouncer-style if checks. Moreover there's a design issue here that we conflate 2 concerns: (1) adapter code that translates between framework and our logic and (2) our own logic, which should be independent of Android specifics (like `Fragment`s, `Activity`s and `Intent`s).

My guy split the concerns and added the bouncer code, resulting in the below:

```kotlin
const val DEEPLINK_HOST = "our.deeplink.host.fyi"
const val DEEPLINK_SHEMA = "deeplink-schema"
const val DEEPLINK_PATH = "/deepLinkPath"

fun handleDeepLink(uri: Uri) {
    val schema: String? = uri.scheme ?: return
    if (schema != DEEP_LINK_SCHEMA) {
        return
    }

    // Safety check for host
    val host: String = uri.host ?: return
    if (host != DEEP_LINK_HOST) {
        return
    }

    // Safety check for path
    val path: String = uri.path ?: return

    if (path == DEEPLINK_PATH) {
        println("do the thing!")
    }
}
```

Now that's a lot easier to read, the indentation is essentially flat (ignoring the bouncer `return` statements) and we actually do a couple of more checks. Note also that the adapter code of checking if the `Intent`'s nullability and if it has the correct action is not here (that's handled in the adapter layer as it should be).

But reading this I think: isn't that a bit verbose for the simple checks we do? Can't we reduce this to just a single conditional? Wouldn't that be more explicit?

So we arrive at:

```kotlin
fun handleDeepLink(uri: Uri) {
    if (uri.scheme == DEEP_LINK_SCHEMA &&
        uri.host == DEEP_LINK_HOST &&
        uri.path === DEEP_LINK_PATH
    ) {
        println("do the thing!")
    }
}
```

This is the final version, which is arguably **more explicit** and **less complex** than both previous iterations. In normal language:

> If the URI has our deep link schema, host and path we *do the thing*.

Now that's a sentence! You hear it -- you get it. That's what the code should be like.

But I did tell my guy to

1. Add bouncer code because it will make the code cleaner
2. Remove bouncer code because it will make the code cleaner

🤦‍♀️

The poor guy must be thinking I enjoy making him jump through hoops to appease my sense of aesthetics. And I can see why he would get that idea...

Underlying this is more than a pattern, a technique, a specific design or a trick: I want the code to be explicit. All code should be explicit. This is such a universal guideline for me that I think it's a ... *\*drumroll\**

## Software Development Principle[^2]

[^2]: I went back and forth between "principle" and "directive". Directive sounds less lofty and one definition is ["something that serves to direct, guide, and usually impel toward an action or goal"](https://www.merriam-webster.com/dictionary/directive). Which is what I am talking about, kind of. But for the time being let's stick with principle.

Style, taste and aesthetics are too subjective for my taste, so let's define a **software development principle** that I use to guide my decision making. Rather than detailed prescriptive solutions ("use bouncer code", "use strategy pattern") is a high level rules that I instill in my development teams.

> **Principle**: a basic idea or rule that explains or controls how something happens or works
>
> -- [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/principle)

Something fancy like that ☝️.

So get ready for...

## Principle #1: Make it Explicit

Now this may sound basic at first glance, but bear with me.

> Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
>
> -- [Martin Fowler, 1999](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/)

**Programming is communication with other programers. Therefore we have to strive to explicitly communicate the intent of our software.**

Code should read like a story to the (to a reasonable extent) initiated reader.

Kent Beck recognizes that in his [rules of simple design](https://martinfowler.com/bliki/BeckDesignRules.html):

> * Passes the tests
> * **Reveals intention**
> * No duplication
> * Fewest elements

So if that's all over 20 years old, surely we all do this already, right? I wish....

Let me walk you though a couple cases I encountered "in the real world"™️, examples in which the code was less than explicit about its intent.

### Example #1: Web Frameworks

Spring is a ~~decent~~ web framework, it has a lot of features and many people use it. Still I dislike Spring for the single reason that they make it damn hard to know what's going on! The significant code, the one that actually implements your business logic that -- you know, makes all the money -- is buried in a pile of annotations. This is only partially spring's fault, you don't *have* to do it way. But in reality I see code bases doing it that way. Here is an adapted example of some real java code that someone (with far more Spring experience than me) has written:

```java
@RestController
@Api
@Validated
public class AnExampleController {

  @Autowired
  public AnExampleController(AnExampleService exampleService) {
    this.exampleService = exampleService;
  }

  @ApiOperation(value = "Get Example", response = ExampleResponse.class)
  @ApiResponses(
      value = {
          @ApiResponse(code = 200, message = "Success"),
          @ApiResponse(code = 400, message = "Bad Request"),
          @ApiResponse(code = 500, message = "Internal Server Error")
      })
  @GetMapping("example")
  public ResponseEntity getExample(
      @RequestHeader("subject") String subject,
      @RequestHeader(value = "alternativeSubject", required = false)
      String alternativeSubject
  ) {
    // Do the thing
    exampleService.doTheThing(subject, alternativeSubject)
  }
}
```

That's 12 annotations and 23 lines of code **before you get to the point**. That is not explicit, that's the opposite.

Similarly the data driven test code for class (this time in Kotlin) is a mess:

```kotlin
@SpringBootTest(classes = [ExampleApplication::class])
@WebAppConfiguration
@RunWith(Parameterized::class)
@Suppress("UNUSED_PARAMETER")
class ExampleParameterizedTest(
    /* parameters */
) {

    private var mockMvc: MockMvc? = null

    @Autowired
    private val wac: WebApplicationContext? = null

    @MockBean
    private lateinit var exampleService: ExampleService

    @get:Rule
    val springMethodRule = SpringMethodRule()

    @Before
    fun setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac!!).build()
    }

    @Test
    @Throws(Exception::class)
    @MethodSource("exampleParameters")
    fun someTestMethod() {
        // Do the test
    }

    companion object {

        @ClassRule
        @JvmField
        var SPRING_CLASS_RULE = SpringClassRule()

        @JvmStatic
        @Parameterized.Parameters
        fun exampleParameters() = listOf(/* test data */)
    }
}
```

All the effort you have to put in just to write a test... and slow running complex ones at that. I don't think we have to dive into the details here.

Ok so if Spring somehow makes people write hard to read code, what are some other options?

🤔

How about Node.js + Express? Let's look at another adapted real world example (again authored by somebody who is a more experienced express programmer than me):

```javascript
// app.js
const express = require('express');
const app = express();

app.use('/example', require('./example-controller'))

module.exports = app;

// example-controller.js
const router = require('express').Router();
const service = require('./example-service');

router.get('/', async (req, res) => {
    const subject = req.header('subject')
    const alternativeSubject = req.header('alternativeSubject')
    // Do the thing
    service.doTheThing(subject, alternativeSubject)
});

module.exports = router

// tests/example-controller.test.js
const request = require('supertest');
jest.mock('../example-service')
const app = require('../app'); // the app file above

describe('The example controllor', () => {
    test.each([/* test data */], (/* parameters*/) => {
        request(app) // do the test
    })
})
```

Now this does most what the above Spring code does. In about half the amount of code. So express definitely facilitates more concise code. And I argue that just by that fact it already is more explicit that the Spring example. Nothing is buried in boilerplate here. Sure you may not know all the details of the `Router` or of the `supertest` package, but that is equally true for Spring's `WebApplicationContext` or the `@Validated` annotation. That's totally fine, explicit doesn't need to be verbose. We don't know all the things, that's why we read documentation.

What I'm getting at is that the express example explicitly communicates its intent. The spring example does not.

We could have done the same exercise with [ktor](https://ktor.io/), [sinatra](http://sinatrarb.com/), [flask](https://github.com/pallets/flask), [rails](https://rubyonrails.org/), etc. In this case the problem is not Java (although in many other cases it is) and even the spring project itself is trying to dig itself out of that hole with [spring fu](https://github.com/spring-projects-experimental/spring-fu/tree/master/kofu).

Rails advertises and delivers convention over configuration.
As a result the average rails codebase is more readable and communicates intent better than the average spring codebase.

Spring on the other hand often ends up in the "obfuscation over convention" corner.

### Example #2: ZxD Jenkins CD Pipeline

Another example is ZxD: operates k8s clusters as a service for application teams. They have different environments (development, staging, pre-production and production) and provide a Jenkins job to deploy to each of them, i.e. 4 jobs.
They decided to use a single Jenkins pipeline for all jobs and hardcode the credentials specific for each environment in the job config, for example the job deploying to staging environment has the `env = 'stg'` parameter hardwired in Jenkins web UI.

Here's the conditional logic of that pipeline, without the actual operations in each stage:

```groovy
// Jenkinsfile
pipeline {
  parameters {
    choice(name: 'action', choices: ['deploy', 'delete'])
    choice(name: 'env', choices: ['dev', 'stg', 'prod'])
  }
  stages {
    stage('init') {}
    stage('build app') {
      when {
        expression { params.env == 'dev' && params.action == 'deploy' }
      }
    }
    stage('build docker image') {
      when {
        expression { params.env == 'dev' && params.action == 'deploy' }
      }
    }
    stage('select container image') {
      when {
        expression { params.env != 'dev' && params.action == 'deploy' }
      }
    }
    stage('promote container image to next env') {
      when {
        expression { params.env != 'dev' && params.action == 'deploy' }
      }
    }
    stage('deploy to k8s') {}
    stage('monitor rollout status') {
      when {
        expression { params.action == 'deploy' }
      }
    }
    stage('release notes') {
      when {
        expression { params.action == 'deploy' && params.env == 'prod' }
      }
    }
    stage('notify slack') {
      when {
        expression { params.action == 'deploy' && params.env == 'prod' }
      }
    }
  }
}
```

...now: tell me what stages run for `action = deploy` and `env = dev`? Can you tell? I can't, not without wasting effort untangling the mess. This pipeline obfuscates intent and control flow.

So my team split up the pipeline into 3, one for each environment:

```groovy
// develop.jenkinsfile
pipeline {
  stages {
    stage('init') {}
    stage('build app') {}
    stage('build docker image') {}
    stage('deploy to k8s') {}
    stage('monitor rollout status') {}
  }
}

// staging.jenkinsfile
pipeline {
  stages {
    stage('init') {}
    stage('select container image') {}
    stage('promote container image to next env') {}
    stage('deploy to k8s') {}
    stage('monitor rollout status') {}
  }
}

// production.jenkinsfile
pipeline {
  stages {
    stage('init') {}
    stage('select container image') {}
    stage('promote container image to next env') {}
    stage('deploy to k8s') {}
    stage('monitor rollout status') {}
    stage('release notes') {}
    stage('notify slack') {}
  }
}
```

Now let me ask again: which stages run when we deploy to the development environment? Pretty obvious now, because there are no more conditionals in any of the pipelines! Isn't that much more explicit?

Ok, but that's maybe not perfect, there are some concerns you might raise

1. These pipelines are not equivalent to the previous above, the `action = 'delete'` cases are missing → We never used that - but we had no idea, because that was buried in the complexity of the previous pipeline. The code did not tell us, that was its little dirty secret.
2. There is of duplication in the pipeline we use for production & staging → Yes that is true. But we value explicit separation of these concerns is more over reusing code in this case. It is a trade off: simplicity vs no-duplication. Simplicity, I chose you!

See how something interesting happened there? Because we follow a this principle of "Make It Explicit!" we are empowered to violate the programmer common sense of "duplication is bad!".

Similarly following the principle lead us to identify a design problem: the pipeline clearly had multiple reasons to change, in other words: multiple responsibilities. By following our plan to make the code more explicit we also applied the single responsibility principle, without even thinking about it.

I have more examples of code that obfuscates intent, code that needs to be more explicit - but I think you get the point.

## What is It Good for?

In summary: a lot of code is damn hard to read. Not because of programming languages or frameworks. Because programmers follow rules of thumb (reuse everything always, use annotations instead of code, etc.) without asking themselves: **is this in line with my/our development principles**? This is the first of the principles me and my teams follow, I'll write about the other ones in following posts - here's a shortlist:

* Make it Explicit
* Business Drives IT
* Don't build Software
* Trade-Offs & Decisions
* Fast Feedback

This is a work in progress, non-exhaustive and specific to my professional environment -- but it's what I've got so for 😄. Let me know how principles affect your design & development and about your principles - maybe I'll steal some...
