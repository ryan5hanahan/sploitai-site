# sploit.ai

This repository contains the **sploit.ai** landing page.

Live site (after enabling GitHub Pages):

- https://ryan5hanahan.github.io/sploitai/

## Local development

Serve the site locally (recommended so assets load correctly):

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Configure the waitlist form (Formspree)

The waitlist form is wired to a placeholder endpoint:

```text
https://formspree.io/f/xeellwgk
```

Update the Formspree `action` URL in `index.html` if you ever change your Formspree form.

## Deploy to GitHub Pages

1. Push to `main`
2. In GitHub: **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` and folder: `/ (root)`

GitHub Pages will serve `index.html` from the repository root.

### Optional: Custom domain

If you plan to use a custom domain (e.g. `sploit.ai`), add a `CNAME` file at the repository root
containing your domain name, then configure DNS per GitHub Pages docs.

