# Typing Test + Console
Node.js console typing test. Easy, Med, & Hard Difficulties, Speed graph, Shortcuts   
[npmjs.com/package/tycon](https://www.npmjs.com/package/tycon)    

![tycon recording](https://nicfontaine.com/dev/tycon-rec-09.gif)   

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
- Require Correct Word _(don't skip on incorrect)_: `y/N`
- Colourblind Mode _(blue/green)_: `y/N`
- Randomly Capitalize First Letter _(scales with difficulty)_: `y/N`   

## Features
- **Basic Mode**: Randomly selected words from 3 difficulties.
- **Sentence Mode**: Paragraphs from popular books, including capitalization and punctuation.
- **Restarting Test**: `^R` Is used to start/re-start a test. Can be used while test is running (will re-random sentence selection)
- **Word Deletion**: `Ctrl + Backspace` is used to delete a typed word. `Shift + Home` is not supported, nor is `Ctrl + W` (for Unixers), though I'm considering it.
- **Speed Graph**: Every 2 seconds, your average WPM (up to that point) is calculated

### To-Do
- Support custom word lists from file (validate format, and navigate directories to locate. launch flag `-f` and file path)
- Support numbers (keypress just gives undefined for data)
- % incorrect by each character, not just incorrect words, and backspaces
- Display random typing tips
- Add random punctuation mode (insert punctuation, and reformat text, like hyphens w/o space, caps after period, etc.)
- Re-do intervaled avg to average in segments, instead of over progress of the test (so chart is more relevant)
- Record local lifetime stats
- Launch parameters to define settings
- User config (settings) file support
- Record time between all keypresses for consistency data, & display in graph

### Text Excerpts
- _The Fellowship of the Ring_, J.R.R Tolkein
- _Harry Potter and the Chamber of Secrets_, J.K. Rowling
- _Anna Karenina_, Leo Tolstoy
- _The Eye of the World_, Robert Jordan
- _Animal Farm_, George Orwell
- _The Hitchhiker's Guide to the Galaxy_, Douglas Adams
- _The Name of the Wind_, Patrick Rothfuss

### Issues?
1. **Tycon not recognized command** (Windows), when trying to launch   
Probably a path var issue with node. Add npm path to your environment variables & restart terminal. [Link](https://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8-and-10)

### More
website: [nicfontaine.com](https://nicfontaine.com)  
twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Buy it, use it, break it, fix it, trash it, change it, mail, upgrade it. ;v