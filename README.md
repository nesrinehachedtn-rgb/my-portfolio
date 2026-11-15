# Personal Portfolio

A simple, responsive one-page portfolio built with plain **HTML, CSS and JavaScript**. It uses no frameworks and no build step.

## Sections
- **Header**: name, job title and call-to-action buttons
- **About**: short bio with animated stats
- **Skills**: skill cards grouped by category
- **Contact**: email and social links, plus a validated contact form

## Run it
Open `index.html` in any modern browser. To serve it locally instead:

```bash
npx serve .
# or
python -m http.server 8000
```

## Customize
1. **Name and title**: in `index.html`, replace `Your Name`, `Your Job Title` and the `YN` initials.
2. **About and skills**: edit the text and the `<li>` tags in the About and Skills sections.
3. **Contact**: replace `you@example.com` and the LinkedIn/GitHub URLs in `index.html`, and set `CONTACT_EMAIL` at the top of `script.js`.
4. **Colors**: change `--accent-1` and `--accent-2` at the top of `style.css`.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure and content |
| `style.css` | Layout, theme, animations and responsive breakpoints |
| `script.js` | Mobile menu, scroll reveals, counters and form validation |

## Notes
- The contact form opens the visitor's email app (`mailto:`). It needs no backend.
- Animations are turned off for visitors who have "reduce motion" enabled.
