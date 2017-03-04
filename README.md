# Marknote

## Building

Make sure `pwd` equals this repository. Then execute:


```bash
npm install
```

There are two external packages that need to be downloaded manually. Create the following directory 

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
