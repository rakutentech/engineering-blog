---
title: "Smaller the Parameter, Smaller the Bugs"
date: 2021-07-13T22:57:39+09:00
hero: /images/hero-5.jpg
excerpt: "Some hints for coding efficiently and reducing the bugs"
timeToRead: 10
authors:
  - Bater
draft: true
---
When I review the code, I sometimes notice that there is some room to squash from the parameter of the method, but not many developers are aware of it when they design the code. According to my coding experience, we can write the code efficiently and reduce the bug rate by the effort of reducing the parameter from the method. Unless your manager still evaluate your output by line of code every day, you should definitely try these tips in your daily coding life.

So today, I will share how to do it with OOP (object-oriented programming) design, and explain where the magic power comes from.

Let's start with a small example, the demo code was written in Ruby, but don't worry. The ruby code is so friendly that once you have some OOP background, I believe you can understand the code right away. 

The example story is, we have some books and want to pass the author name as a parameter, and get the book title, author name and publish date as a summary.
```ruby
class Book
  attr_reader :title, :publish_year
 
  def initialize(title, publish_year)
    @title = title
    @publish_year = publish_year
  end
 
  def summary(first_name, last_name)
    "#{title} - #{last_name}, #{first_name} (#{publish_year})"
  end
end
 
book = Book.new("Ruby is the best", "2020")
book.summary("Bater", "Chen")
=> "Ruby is the best - Chen, Bater (2020)"
```
We have a book class, it has two attributes, title and publish_year. The `initialize` method would be called when we new a book object. Book class only has one instance method called `summary`, it needs two parameters, first_name and last_name. In Ruby, when we define the `attr_reader` as the attribute of the object, it will create the read method automatically. So we can call the instance variable directly by `title` to get `@title` return, same as publish_year.

This simple method works fine, but not good enough. Now we want to do some refactoring on it.

## The good code should be small and simple
What is the good code? This question might be hard to answer, but I would say **the good code should be small and simple.** In this article, let's focus on making the parameter smaller.

Generally speaking, **one parameter is better than two, and no parameter is better than one.** The fact of the parameter is, it cost time to read and understand the business logic, and time is always expensive in all projects. We spent around 70% of time to read the existing code, but only 30% is actually writing. If we can save some time from reading the code, not only from literally reading, but also from understanding the spec and logic, which means we can develop efficiently.

Secondly, when **the code is short, the bugs are no where to hide.** Parameter causes bugs easily, because it needs extra concern. Reducing parameter can make the method more clear, and show the intention explicitly. It can help us to maintain the code easily. When we try to reduce the parameter, we are actually try to reduce the potential bugs at the same time.

Now we know it's better to reduce the parameter, but how to do it? Let's check the parameter again.

## Data clump
When we find out the parameters are **a group of data that always come together**, and it would make no sense when missing one of them, we can call it a set of **Data Clump**. For example, a pair of start date and end date, or in this example, first name and last name.

In OOP world, **object is the container of data, and class is the container of method** (behavior of object). It's cheap to create many small objects to manage and operate the serial data. Additionally, we can define the method on the object and reuse it when necessary.

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
The Author class also has two attributes, and author object has one instance method call `full_name`. Now we can use author object to replace first name and last name.

#### Before
```rb
def summary(first_name, last_name)
  "#{title} - #{last_name}, #{first_name} (#{publish_year})"
end
 
book = Book.new("Ruby is the best", "2020")
book.summary("Bater", "Chen")
=> "Ruby is the best - Chen, Bater (2020)"
```
#### After
```rb
def summary(author)
  "#{title} - #{author.full_name} (#{publish_year})"
end
 
book = Book.new("Ruby is the best", "2020")
book.summary(Author.new("Bater", "Chen"))
=> "Ruby is the best - Chen, Bater (2020)"
```
The output of `summary` is the same, but the parameter reduce from two strings to one object. Well, you may doubt that it doesn't really matter, but image that you can follow the same pattern to reduce the parameter from 10 data into 1 object. That would be a huge impact.

## Law of Demeter
You may also notice that I relocate the logic of full name from book class to author class, because full name can perform independently without interaction with book object. **Object should know less about each other**, it is known as [Law of Demeter][2] or "Least Knowledge Principle".

In this case, book class shouldn't know the logic of `full_name`. The business logic of `full_name` should only be defined in author class, not spread to somewhere else.  From now on, book class has no dependence on first name and last name directly. In fact, any object can be the parameter of summary method once it has `full_name` method. For example, if we have a user object also can return `full_name`, it also works fine with the `summary` method.

This practice also known as [Duck Typing][1], if it walks like a duck and it quacks like a duck, then it must be a duck. In duck typing, an object's suitability is determined by the presence of certain methods and properties, rather than the type of the object itself. In Java case, you can use interface.

Now a new requirement is coming, we need to add a new method called `cover`, and it also have author first name and last name inside. We can follow the pattern we just made. Let's compare before and after the refactoring of book class.
#### Old pattern without refactoring
```rb
def summary(first_name, last_name)
  "#{title} - #{last_name}, #{first_name} (#{publish_year})"
end
 
def cover(first_name, last_name)
  "#{title}\n\n\n#{last_name}, #{first_name}"
end
```
#### After refactor
```rb
def summary(author)
  "#{title} - #{author.full_name} (#{publish_year})"
end
 
def cover(author)
  "#{title}\n\n\n#{author.full_name}"
end
```
The cover method generate a string which has book title and author full name inside. After the refactoring, we can reuse the author full name method again. Once we build a good pattern, the new code can follow it easily and keep the project clean. But if you didn't pay attention, the code getting rust rapidly and becomes the developer's nightmare. 

You may also notice that both `summary` and `cover` need the same parameter, author, it's the smell of refactoring. The author information should be one of the attribute of the book object, instead of passing as parameter when we call the book method. So we can refactor book class again.

```rb
class Book
  attr_reader :title, :publish_year, :author
  
  def initialize(title, publish_year, author)
    @title = title
    @publish_year = publish_year
    @author = author
  end
 
  def summary
    "#{title} - #{author.full_name} (#{publish_year})"
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
Both `summary` and `cover` method's output remain the same, but now we can call it freely without any parameter once book object is prepared. In ruby, we can skip parentheses if there are no parameter.

This example doesn't encourage you to move all the parameter into object attribute, it depends on the domain know-how. We can do it because it make sense for a book object has author as attribute in this case. It may getting worse if we try to put wrong data as the object attribute.

## Open-closed principle
Reducing the parameter from two to zero is not the the only benefit we got from this refactoring, this new design is open for extension but closed for modification. It follows the [open-closed principle][3].

Now we have a new requirement coming again, some authors have the middle name. In the new version it would be very easy to adapt the change, we don't need to touch the book class anymore. The new author class would refactor like this:

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
In this design, the existing behavior doesn't change. The default value of middle name is `nil` (Null) because in most of cases we can skip it, and we won't break anything when the existing code try to new author with only two parameters. The author class is open for extension and book class is closed for modification in this case. Without this refactoring, we need to touch both `summary` and `cover` method, and the parameters increase from two to three. Let's compare the code before and after the refactoring again:
#### Old pattern without refactoring
```rb
def summary(first_name, last_name, middle_name = nil)
  if middle_name.nil?
    "#{title} - #{last_name}, #{first_name} (#{publish_year})"
  else
    "#{title} - #{last_name}, #{middle_name}, #{first_name} (#{publish_year})"
  end
end
```
#### After refactoring
```rb
def summary
  "#{title} - #{author.full_name} (#{publish_year})"
end
```
Obviously, the code quality has huge improvement after refactoring. 
## Loose coupling
Before we finish this refactoring and send the PR to someone, let's check the code again, does it clean enough?

The code seems short and simple, but this method still depends on author class. In other words, `summary` need to know the author object has a `full_name` method, we could say the book class still couple with author class. In this case maybe it's hard to notice the cost of coupling, let's image after few years later, the `summary` method might become more complicated:

#### Few years later
```rb
def summary
  # 10 lines of code you don't want to read.
  middle_result = "#{some_author_title_helper(author)} - #{author.full_name}"
  # another 10 lines of code
  return final_result
end
```
Disadvantage of coupling is that when one class need to change, you need to change others as well. For example, one day we need to rename the full name method or adding more parameter on it, we need to modify the book class at the same time, which we don't like.

The bad news is, in the real world it's almost impossible to remove all the coupling between each object, but we can at least reduce the impact by segregate and highlight the dependence. 

```rb
def summary
  "#{title} - #{author_name} (#{publish_year})"
end

def author_name
  author.full_name
end
```
After this refactoring, the `summary` method 100% calling from book object itself. The book class still have the coupling with author class, but it's obvious and easy to maintain. If we only consider the example case, you might wondering is that a little bit over design? Well, I would say that a good pattern is never too early. Now we can push the PR confidently and enjoy the holiday.

## Conclusion
The good code should be small and simple, of course parameter is not the only place we can do our effort to reduce the size. During the refactoring, don't forget to confirm the result by unit test to make sure the final behavior would be the same. People around you may think that it would be time-wasting work because the final behavior remains the same even though developers spent a lot of time on it. But there's the value of code quality. I believe it would perform in development speed and product stability in the long term.

I hope this small example can convince you this refactoring skill can benefit your coding life. If not, please waiting for my next blog and give me another chance, see you next time.

[1]: https://en.wikipedia.org/wiki/Duck_typing
[2]: https://en.wikipedia.org/wiki/Law_of_Demeter
[3]: https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle
