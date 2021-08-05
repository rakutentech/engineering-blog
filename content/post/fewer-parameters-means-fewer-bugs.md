---
title: "Fewer parameters means fewer bugs"
date: 2021-07-13T22:57:39+09:00
hero: /images/hero-5.jpg
excerpt: "Tips for coding efficiently and reducing bugs"
timeToRead: 10
authors:
  - Bater
draft: true
---
When I review code, I sometimes notice that there is an opportunity to squash method parameters --- yet many developers are unaware of this when they write code. From my coding experience, we can write code more efficiently and reduce the amount of bugs by making an effort to reduce the number of parameters in our methods. Unless your manager still evaluates output by lines of code, you should definitely try these tips in your daily coding life.

So today, I want to show how to do it with OOP (object-oriented programming) design, and explain where this magic power comes from.

Let's start with a small example. The following demo code was written in Ruby, but don't worry: Ruby code is so beginner-friendly that once you have some OOP background, it's easy to grasp.

In this example, we have some books and want to pass the author name as a parameter, and get the book title, author name, and year published as a summary.
```ruby
class Book
  attr_reader :title, :year_published
 
  def initialize(title, year_published)
    @title = title
    @year_published = year_published
  end
 
  def summary(first_name, last_name)
    "#{title} - #{last_name}, #{first_name} (#{year_published})"
  end
end
 
book = Book.new("Ruby is the best", "2020")
book.summary("Bater", "Chen")
=> "Ruby is the best - Chen, Bater (2020)"
```
We have a book class. It has two attributes: `title`, and `year_published`. The `initialize` method is called when we `new` a book object. Book class only has one instance method called `summary`. It needs two parameters: `first_name` and `last_name`. In Ruby, when we define the `attr_reader` as the attribute of the object, it will create the read method automatically. So we can call the instance variable directly by `title` to get `@title` return, same as `year_published`.

This simple method works fine but is not good enough. Let's refactor it.

## Good code should be small and simple
What is good code? This question might be hard to answer, but I would say **good code should be small and simple.** In this article, let's focus on reducing the number of parameters.

Generally speaking, _**one** parameter is better than **two**_ and _**no** parameter is better than **one**._ The problem with parameters is that it takes time to read and understand them, and time is always expensive.

> We spent around 70% of time reading the existing code, but only 30% is spent actually writing. 

If we can save some time from reading the code, not only from literally reading but also from understanding the spec and logic, we can write code more efficiently.

Secondly, **when code is short, bugs have nowhere to hide.** Parameters are bug-prone because it demands extra care and concern. Reducing parameters can not only make the method more clear, it also shows our intention explicitly. It can help us to maintain the code easily. When we reduce our parameters, we are actually reducing the number of potential bugs at the same time.

Now we know the benefits of reducing the parameters, the question is: how can we do it? Let's check the parameters again.

## Data Clump
One observation that we can make is that parameters are **a group of data that always comes together**. This data would make no sense when one piece of data is missing. We call it a set of **Data Clump**. For example, a start date and end date pair we would call a data clump or, as in this example, a data clump would be the first name and last name.

In the "OOP" world, **objects contain data** and **classes contain behavior** (i.e. methods operating on data). It's cheap to create many small objects[^1] to manage and operate on the serial data. Additionally, we can define methods on the object and reuse them when necessary.
[^1]: Many small objects could end up causing GC pressure. But high performance languages often have tricks up their sleeve like doing [escape analysis](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement/) to convert heap allocation to stack allocations or [expanding argument objects as primitive arguments](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement/). These languages also generally have separate GC pathways for small objects and short-lived objects. In most cases, if you're just using an argument object locally in a high performance language, your runtime will manage to optimize most of the cost away.

Let's try to create a new object to contain first name and last name.

```rb
class Author
  attr_reader :first_name, :last_name
 
  def initialize(first_name, last_name)
    @first_name = first_name
    @last_name = last_name
  end
 
  def full_name
    "#{last_name}, #{first_name}"
  end
end
```
The Author class also has two attributes, and the author object has one instance method call `full_name`. Now we can use the author object to replace the first name and last name.

#### Before
```rb
def summary(first_name, last_name)
  "#{title} - #{last_name}, #{first_name} (#{year_published})"
end
 
book = Book.new("Ruby is the best", "2020")
book.summary("Bater", "Chen")
=> "Ruby is the best - Chen, Bater (2020)"
```
#### After
```rb
def summary(author)
  "#{title} - #{author.full_name} (#{year_published})"
end
 
book = Book.new("Ruby is the best", "2020")
book.summary(Author.new("Bater", "Chen"))
=> "Ruby is the best - Chen, Bater (2020)"
```
The output of `summary` is the same, but the parameter reduces from two strings to one object. Well, you may doubt that it doesn't really matter, but imagine that you can follow the same pattern to reduce the parameter from 10 data into 1 object. That would be a huge impact.

## Law of Demeter
You may also have noticed that I relocated the logic of full name from book class to author class because a full name can perform independently without interaction with the book object. An **object should know less about each other** is said by the [Law of Demeter][2] or the "Least Knowledge Principle".

In this case, the book class shouldn't know the logic of `full_name`. The business logic of `full_name` should only be defined in the author class, not spread to somewhere else. From now on, the book class has no dependence on first name and last name directly. In fact, any object can be the parameter of the summary method once it has the `full_name` method. For example, if we have a user object that also can return `full_name`, it also works fine with the `summary` method.

This practice is also known as [Duck Typing][1]. If it walks like a duck and it quacks like a duck, then it must be a duck. In duck typing, an object's suitability is determined by the presence of certain methods and properties, rather than the type of the object itself. In the Java case, you can use the interface.

Now a new requirement is coming, we need to add a new method called `cover`, and it also has author first name and last name inside. We can follow the pattern we just made. Let's compare before and after the refactoring of the book class.
#### Old pattern without refactoring
```rb
def summary(first_name, last_name)
  "#{title} - #{last_name}, #{first_name} (#{year_published})"
end
 
def cover(first_name, last_name)
  "#{title}\n\n\n#{last_name}, #{first_name}"
end
```
#### After refactor
```rb
def summary(author)
  "#{title} - #{author.full_name} (#{year_published})"
end
 
def cover(author)
  "#{title}\n\n\n#{author.full_name}"
end
```
The cover method generates a string that has the book title and author's full name inside. After the refactoring, we can reuse the author's full name method again. Once we build up a good pattern, the new code can follow it easier and keep our project clean. But if you didn't pay attention, the code would quickly become harder to read, develop technical debt and become a developer's worst nightmare.

You may also notice that both `summary` and `cover` need the same parameter, author, it's the smell of refactoring. The author information should be one of the attributes of the book object, instead of passing as a parameter when we call the book method. So we can refactor the book class again.

```rb
class Book
  attr_reader :title, :year_published, :author
  
  def initialize(title, year_published, author)
    @title = title
    @year_published = year_published
    @author = author
  end
 
  def summary
    "#{title} - #{author.full_name} (#{year_published})"
  end
  
  def cover
    "#{title}\n\n\n#{author.full_name}"
  end
end
  
bater = Author.new("Bater", "Chen")
book = Book.new("Ruby is the best", "2020", bater)
book.summary
=> "Ruby is the best - Chen, Bater (2020)"
book.cover
=> "Ruby is the best\n\n\nChen, Bater"
```
Both `summary` and `cover` methods' output remain the same but now we can call it freely without any parameter once the book object is prepared. (In Ruby, we can skip parentheses when there is no parameter.)

This example doesn't encourage you to move all the parameters into the object attributes, it depends on the domain know-how. We can do it because it makes sense for a book object to having an author as an attribute in this case. It may get worse if we try to put the wrong data as the object attribute.

## Open-closed principle
When we reducing our parameters from two to zero, our design is now open for extension but closed for modification. This is inline with the [open-closed principle][3].

Let's say we have a new requirement again, this time, some authors now have a middle name. In this new version, it would be very easy to adapt our code because we don't need to touch the book class anymore. The new author class would refactored like this:

```rb
class Author
  attr_reader :first_name, :last_name, :middle_name
  
  def initialize(first_name, last_name, middle_name = nil)
    @first_name = first_name
    @last_name = last_name
    @middle_name = middle_name
  end
  
  def full_name
    if middle_name.nil?
      "#{last_name}, #{first_name}"
    else
      "#{last_name}, #{middle_name}, #{first_name}"
    end
  end
end
  
bater = Author.new("Bater", "Chen")
Book.new("Ruby is the best", "2020", bater).summary
=> "Ruby is the best - Chen, Bater (2020)"
  
robert = Author.new("Robert", "Kiyosaki", "T")
Book.new("Rich Dad, Poor Dad", "1997", robert).summary
=> "Rich Dad, Poor Dad - Kiyosaki, T, Robert (1997)"
```
In this design, the existing behavior doesn't change. The default value of the middle name is `nil` (also known as Null in other languages) because in most cases we can skip it and we won't break anything when the existing code tries to create a new author with only two parameters. The author class is open for extension and the book class is closed for modification in this case. Without refactoring, we need to touch upon both the `summary` and `cover` methods, causing the parameters to increase from two to three. Let's compare the code before and after, again:
#### Old pattern without refactoring
```rb
def summary(first_name, last_name, middle_name = nil)
  if middle_name.nil?
    "#{title} - #{last_name}, #{first_name} (#{year_published})"
  else
    "#{title} - #{last_name}, #{middle_name}, #{first_name} (#{year_published})"
  end
end
```
#### After refactoring
```rb
def summary
  "#{title} - #{author.full_name} (#{year_published})"
end
```
Obviously, the code quality has a huge improvement after refactoring.

## Loose coupling
Before we finish refactoring and send off this PR to someone, let's check the code again. But is it clean enough?

The code seems short and simple, but this method still depends on the author class. In other words, the `summary` method needs to know the author object has a `full_name` method, we could say the book class still couple with author class. In this case, maybe it's hard to notice the cost of coupling, let's imagine a few years later, the `summary` method might become more complicated:

#### Few years later
```rb
def summary
  # 10 lines of code you don't want to read.
  middle_result = "#{some_author_title_helper(author)} - #{author.full_name}"
  # another 10 lines of code
  return final_result
end
```
The disadvantage of coupling is that when one class needs to change, you need to change others as well. For example, one day we need to rename the full name method or add more parameters to it, we need to modify the book class at the same time, which we don't like.

The bad news is, in the real world it's almost impossible to remove all the coupling between each object, but we can at least reduce the impact by segregating and highlighting the dependence. 

```rb
def summary
  "#{title} - #{author_name} (#{year_published})"
end

def author_name
  author.full_name
end
```
After this refactoring, the `summary` method 100% calling from the book object itself. The book class still has the coupling with the author class, but it's obvious and easy to maintain. If we only consider the example case, you might wonder is that a little bit over design? Well, I would say that a good pattern is never too early. Now we can push the PR confidently and enjoy the holiday.

## Conclusion
Good code should be small and simple. Of course, the parameter is not the only place we can place our effort in to reducing its size. During refactoring, don't forget to confirm the result by unit testing to make sure the final behavior is consistent. People around you may think that it would be time-wasting work because the final behavior remains the same even though developers spent a lot of time on it. But there's the value of code quality. I believe this line of thinking would help you perform well in development speed and product stability in the long term.

I hope this small example can convince you this refactoring skill can benefit your coding life. If not, please wait for my next blog and give me another chance. See you next time.

[1]: https://en.wikipedia.org/wiki/Duck_typing
[2]: https://en.wikipedia.org/wiki/Law_of_Demeter
[3]: https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle
