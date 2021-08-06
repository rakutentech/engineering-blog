---
title: "Introducing AltSwiftUI in Rakuten Travel"
date: 2021-07-06T18:18:13+09:00
excerpt: "What is AltSwiftUI and how we introduced it in Rakuten Travel"
timeToRead: 4
authors:
   - Kevin Wong
hero: /post/altswiftui-travel/hero.png
draft: true
license: cc-by
---

_Background image by [Dan Roizer](https://unsplash.com/@danroizer) under the [Unsplash license](https://unsplash.com/license)_

SwiftUI is a framework introduced by Apple in 2019 for development in a multitude of Apple platforms, including iOS. It allows developers to create apps with declarative UI programming and state management. Because of this, it's possible to improve development speed and quality. Yet, the framework requires iOS 13 and onwards versions. On top of that, new additions to the framework will require an even higher minimum iOS version.

When creating iOS apps, an important choice to make is which minimum iOS version this app will support. If you want to target an audience as big as possible, or if you are updating an older app which has users on older iOS versions, your development will be restricted to frameworks supporting these iOS versions.

AltSwiftUI is an open source UI framework for iOS that mimics SwiftUI’s interface. It introduces a single OS baseline at iOS 11 and greater source flexibility.

Starting to use AltSwiftUI is pretty straightforward, just import it through Cocoa pods or Swift Package Manager. If you are familiar with SwiftUI syntax, then you are good to go.

For more info see: https://github.com/rakutentech/AltSwiftUI

## A peak into code

Other than some small differences, the code structure is highly similar to that of regular SwiftUI code. The code below displays a scrollable view with an icon header and a list of ramens to order.

![AltSwiftUI code sample](altswiftui-code-sample.png)

We can create AltSwiftUI views by having structs conform to the `View` protocol. Property wrappers such as @StateOject, @State, @Binding, etc. allow the view to automatically refresh when the value of these properties change. The content of the `body` computed property (as required by the `View` protocol) will define the actual UI code. Finally, the UI code is defined in a declarative way by using Swift's function builders. If you are not familiar with SwiftUI code, you should head to ![Apple's SwiftUI tutorial](https://developer.apple.com/tutorials/swiftui) for a fast start.

One of the main differences between SwiftUI and AltSwiftUI is that AltSwiftUI doesn't use associated types in views. This means that it is not necessary to use opaque return types (`some View`). 

## Extended features

AltSwiftUI interface is inspired by SwiftUI, but we needed more features and capabilities than originally offered, so we introduced extra functionalities in AltSwiftUI.

For example, we needed deeper integrations with List and ScrollView interactions, so there are methods like `ScrollView.scrollOffset` and `List.onDragStarted`. There are also multiple small additions to some of the views and modifiers, and this list will keep growing in the future. To identify these features, you can read the source documentation during development or at the ![AltSwiftUI homepage](https://altswiftui.com).

## AltSwiftUI in Rakuten Travel

AltSwiftUI’s development started at the end of 2019. Our main purpose was taking on new projects while renewing the way we design software. It also allowed us to improve the speed and quality of our development, and be more future proof.

We compared what SwiftUI offered with what our app needed while improving AltSwiftUI. The open source nature of this framework allowed us to meet our app expectations by adding new features.

By using only AltSwiftUI to code our UI, we recently developed and published a new app titled _Rakuten Travel Premium Club_. This app is an invitation only app that provides luxurious travel destinations for booking to our costumers.

### Simplified Architecture

The ability to simplify our app’s architecture is a main pillar for improving our design and development. When using patterns such as MVVM or VIPER, the number of things a developer needs to worry about tend to increase. In contrast, we could transition to a MV (model view) design with AltSwiftUI at its core. 

The core principle of this MV design is that developers should focus more on what they want to build, rather than how. We can delimit what is part of the UI (view layer) and what is part of our business logic/data (model layer). Because of this, we can better visualize our tasks and improve development efficiency.

![MV architecture](mv-architecture.png)

The view layer consists of components that interact with the user. This includes the actual view structure, its local state, navigation, gestures, animations, and so on. We define all of this in a single layer by the use of declarative programming.

The model layer consists of operations that retrieve, process and store data that are part of our business domain. At the same time, it exposes this data to the view layer as transparently as possible for a simple and smooth integration.

The framework’s ability to integrate view state with data, including automatic updates, is what allows us to remove intermediate layers of complexity that often cause bugs. Instead, the framework handles these intermediate layers without any extra code.

---

These are the pros and cons of using this approach that we observed in our development team:

__Pros__

- Our development speed is much faster.
- We can improve our app visuals and interactions with more ease.
- We don't need to worry about OS deployment versions when adding features.
- We can increase UI improvement requests to other developers during peer review, thanks to reduced cost.
- We can improve the speed of prototyping and adding original features.

__Cons__

- We need to maintain AltSwiftUI on top of our regular tasks, which demands more effort from our part.
- Our developers need to learn the combined features of SwiftUI and AltSwiftUI.

It’s hard to tell what will happen in some years from now. By using SwiftUI's design philosophy and code structure, we improve our chances for a future transition to be less costly and smoother.

## AltSwiftUI’s future

Following the project’s roadmap, we aim to add new components as they release in SwiftUI. We are also planning to include new extra features for better quality of life. And finally, we intend that this framework will serve as a bridge for projects transitioning to SwiftUI in the future.