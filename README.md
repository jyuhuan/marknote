# Marknote

Write sticker notes in Markdown with LaTeX math and code highlight support!

<img width="700px" src="http://yuhuan.me/img/screenshots/marknote-screenshot.png"></img>

## Building

Make sure `pwd` equals this repository. Then execute:


```bash
npm install
npm run rebuild
```

There are two external packages that need to be downloaded manually. Create the following directory http://yuhuan.me/img/screenshots/marknote-screenshot.png7

```bash
mkdir external
```

Download FontAwesome and MathJax and put them inside `external/` as follows:

```
marknote/
├── external/
│   ├── font-awesome-4.7.0/
│   └── MathJax-2.7.0/
│
...
```

Finally, execute

```bash
npm start
```
