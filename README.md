# Typing Test + Console
Node.js console typing test. Easy, Med, & Hard Difficulties, Speed graph, Shortcuts   
[npmjs.com/package/tycon](https://www.npmjs.com/package/tycon)    

![tycon recording](https://nicfontaine.com/dev/tycon-rec-04.gif)   

# Setup

1. ![Install NodeJS](https://nodejs.org/en/download/)   

2. Install Tycon   
```bash
$ sudo npm i tycon -g
```

3. Run   
```bash
$ tycon
```  

## Menu Options

- Test Mode: `basic`, `sentence`
- Test Length (seconds): `10`, `30`, `60`, `120`, `180` 

**Additional Test Settings..** `y/N`
- Difficulty _(basic mode only)_: `easy`, `med`, `hard`    
- Require Correct Word Entry: `y/N`
- Colourblind Mode (blue/green): `y/N`
- Randomly Capitalize First Letter (scales with difficulty): `y/N`
- Display Time During Test: `Y/n`
- Display Average During Test: `Y/n`   

## Features
- **Basic Mode**: Randomly selected words from 3 difficulties.
- **Sentence Mode**: Paragraphs from popular books, including capitalization and punctuation.
- **Restarting Test**: `^R` Is used to start/re-start a test. Can be used while test is running (will re-random sentence selection)
- **Word Deletion**: `Ctrl + Backspace` is used to delete a typed word. `Shift + Home` is not supported, nor is `Ctrl + W` (for Unixers), though I'm considering it.
- **Speed Graph**: Every 2 seconds, your average WPM (up to that point) is calculated

### To-Do
- Support custom word lists from file (validate format)
- Re-do intervaled avg to average in segments, instead of over progress of the test (so chart is more relevant)
- Record local lifetime stats
- Launch parameters to define settings
- User config (settings) file support
- Record time between all keypresses for consistency data, & display in graph

### More
website: [nicfontaine.com](https://nicfontaine.com)  
twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Buy it, use it, break it, fix it, trash it, change it, mail, upgrade it. ;v