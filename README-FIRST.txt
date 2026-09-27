AICHIK — ONE-CLICK ARTWORK ADMIN UPDATE

Upload these files/folders to the ROOT of your existing GitHub repository, preserving folders:
  admin/index.html
  admin/config.yml
  admin.html
  _layouts/artwork.html

This replaces the old admin form with Decap CMS. After the one-time GitHub OAuth setup in Netlify, /admin/ can log in with GitHub and Publish directly to the repository. Netlify then rebuilds aichik.com automatically.

The artwork template also fixes the missing punctuation so metadata displays as "Year: 2026", "Medium: ...", etc.

IMPORTANT: Do not put a GitHub client secret or personal access token in these repository files.
