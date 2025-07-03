# MJcdi - Bijoy ANSI ⇄ Unicode PDF Converter [β]

**MJcdi** is a barebones node.js CLI tool that converts Bangla text inside PDFs between **Bijoy ANSI encoding** and **Unicode** using greedy substitution and PDF text extraction.

> ⚠️ **Status**: Beta. Still in active development.  
> Currently designed as a bare minimal CLI requiring manual node.js installation.

---

## Features

- Convert digital Bijoy (ANSI) text in PDFs to Unicode
- Supports reverse*: Unicode → Bijoy (*_festered with bugs and won't be worked on, cause **MJcdi**._)
- Greedy substitution with post-processing reordering
- ⚠️ Known issue: **Repha (`র্`)** in tri-, tetra- and penta-consonantal conjuncts. e.g.,
  - tri: `বজ্র্য` instead of `বর্জ্য`
  - tetra: `আক্ষ্র্য` instead of `আর্ক্ষ্য`
  - penta: `কাৎর্স্ন্য`/`কাত্স্ন্র্য` instead of `কার্ৎস্ন্য`/`কার্ত্স্ন্য`
- PDF input → `.txt` output

---

## Requirements

- [node.js](https://nodejs.org/) (v14+ recommended)
- `npm` (comes bundled with node.js)

---

## Installation

1. Clone or download this repository:

   ```powershell
   git clone https://github.com/syzarn/mjcdi_beta
   cd mjcdi_beta
    ```

2. **Install dependencies**:

    ```powershell
    npm install
    ```

---

## Usage

```powershell
node mjcdi.js ansi2uni "input.pdf" "output.txt"
node mjcdi.js uni2ansi "input.pdf" "output.txt"
```

### Notes
- The output file name is optional.
- If not provided, it will automatically save as:
```
input.pdf → input.txt
```

---

## Roadmap
- Fix repha (র্) related errors
- Add .txt and .docx input support
- .exe build
- GUI wrapper

---

## License
This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
You are free to use, modify, and distribute this tool under the terms of that license.
_[Note that this is not affiliated with, endorsed by (!), or sponsored by (!!) MJ.]_
