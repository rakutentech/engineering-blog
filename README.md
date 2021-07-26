# Rakuten Engineering Blog Sources

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

2. [Fork](https://github.com/rakutentech/engineering-blog/fork)
3. Clone your repository and initialize its submodules
   ```
   > git clone <YOUR GIT REPO CLONE URL>
   > git submodule update --init --recursive --force
   ```
4. Run the local server with:
   ```
   > hugo server
   ```
5. Browse to the local server URL with your favourite browser.

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

## How To:

### Add a new author profile

1. Create a folder for yourself under `./content/authors/YOUR_NAME`
2. Add an avatar image
3. Add an `_index.md` file, for example
   ```yaml
   title: Your Name
   bio: |
      Your Bio
   avatar: /authors/YOUR_NAME/YOUR_AVATAR.png
   social:
   - title: github
      url: https://github.com/YOUR_GITHUB
      # other social links
   ```
   See the [author partial](https://github.com/forestryio/hugo-theme-novela/tree/master/layouts/partials/author) for details on how it will be rendered

### Add more languages to syntax highlighting

To reduce bundle download size, the syntax highlighting script is currently not
configured to support all languages. If you find that you need a new language
that is not supported, you can add it by upgrading the CSS and JS assets used
by [Prism](https://prismjs.com/) for syntax highlighting:

1. Open `assets/css/prism.css` or `assets/js/prism.js` and look at the header.
   It should contain the download link that was used to generate this file.
2. Open the download link in your browser.
3. Put in a check mark for the language (or languages) you want to add.
4. Click the download CSS button and copy the downloaded CSS file over
   `assets/css/prism.css`.
5. Click the download JS button and copy the downloaded JavaScript file over
   `assets/js/prism.js`.
6. Restart the Hugo server and reload everything in your browser (`Cmd+Shift-R`
   on Mac and `Ctrl-Shift-R` on Windows or Linux) to make sure your cache is
   refreshed.

### Prepare PDF for PR review

We use [pandoc](https://pandoc.org/), for example [via docker](https://github.com/pandoc/dockerfiles#basic-usage)

```shell
docker run --rm --volume "`pwd`:/data" --user `id -u`:`id -g` pandoc/latex path/to/source.md -o output.pdf --pdf-engine=xelatex 
```
