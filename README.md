# Tech Blog Demo

## Quick Start

### Running locally

1. [Install Hugo](https://gohugo.io/overview/installing/).

   Please make sure you install the extended version of Hugo.
   The Homebrew installer for Mac should install the extended version, and the
   same is probably true for other package manager.
   If you want to verify which version you are using, run:
   ```
   > hugo version
   ```
   You should see output like:
   ```
   Hugo Static Site Generator v0.78.2/extended darwin/amd64 BuildDate: unknown
   ```

2. Clone this repository
3. Run the local server with:
   ```
   > hugo server
   ```
4. Browse to the local server URL with your favourite browser.

### Creating a new blog post

1. Open a new git branch for your post:
   ```
   > git checkout -b post/docking-with-docker
   ```
2. Generate new post markdown file:
   ```
   > hugo new post/docking-with-docker.md
   ```
3. Edit the post with your favourite text editor.
4. Run `hugo server -D` to test how the draft post looks locally.
5. When you think the post is ready, submit a pull request with post. Please
   keep the draft flag in the Front Matter (YAML header on top of your file) as
   `true` - the administrator will remove the draft flag when your post
   pull-request is merged and published.

### Generating site HTML and deploying to GitHub Pages

Run the shell script `./deploy` to re-render the blog and deploy everything to
GitHub pages.

