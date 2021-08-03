# Pull Request Template

## Type

_Select whichever describes this pull request best:_

- [ ] **Editorial:** This adds or updates an article, or assets associated with an article.
- [ ] **Technical:** This changes the code that generates or deploys the blog.

## Description

_**Give the pull request a meaningful title,** e.g. `New Post: Microservices in Rust`, then **replace this section with a summary of the change,** including relevant motivation and context. For a new post, this might for instance include your sources, the discussions that led to writing an article, etc._

_**If the pull request fixes some existing issues,** add as many `Fixes #ISSUE_NUMBER>` clauses as necessary so that the relevant issues automatically get closes when the pull request is merged. Do not list multiple issues in the same clause, i.e. `Fixes #ISSUE1, #ISSUE2`, as this does not work._

## Editorial Checklist

_Delete this section if the pull request isn't an editorial one._

- [ ] This fixes an existing article.
  - [ ] If I introduce new assets I didn't create myself, e.g. visuals, I confirmed that I have the right to use them.
     > Better be safe than sorry: linking to the relevant source and license in a caption below every visual is a good habit!
- [ ] This introduces a new article.
  - [ ] My article is original content: I did not copy or plagiarize another source.
  - [ ] I am fine with publishing this content under the [Creative Commons — Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) license.
     > If you'd like the article to use a different license, please explain why below. Depending on the circumstances, it's possible to use a different license.
  - [ ] If my content includes assets I didn't create myself, e.g. visuals, I confirmed that I have the right to use them.
     > Better be safe than sorry: linking to the relevant source and license in a caption below every visual is a good habit!
  - [ ] I have checked my article for spelling and grammatical mistakes.
     > We recommend using tools such as [Grammarly](https://grammarly.com/) or [Ginger](https://gingersoftware.com/), which are available for free.
  - [ ] I have checked my article for technical mistakes and I believe it's technically sound.
  - [ ] I have submitted my article for a [Dev PR Review](https://confluence.rakuten-it.com/confluence/x/NJXtlQ). The ticket is at _…insert link to JIRA…_.
     > **Haven't yet? It's OK, and it won't block the review of your PR. Just make sure to check this box once you do —we can't merge your article until it has passed the Dev PR review.
     >
     > The ticket must include links to two files on Box:
     >
     > - A PDF of your article. See [Preparing PDF for PR review](https://github.com/rakutentech/engineering-blog#prepare-pdf-for-pr-review).
     > - A filled copy of [this form](https://rak.app.box.com/s/wktqug35lxm0t1emx11bcjnqojw3peg8).
     >
     > See [here](https://confluence.rakuten-it.com/confluence/x/NJXtlQ) for general directions on how to fill the JIRA application.

## Technical Checklist

_Delete this section if the pull request isn't a technical one._

- [ ] My code adheres to the existing style and conventions of this project.
- [ ] I haven't copied any code from other source with an incompatible license.
- [ ] I have performed a self-review of my own code, and corrected any misspellings.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings when I build the blog.
