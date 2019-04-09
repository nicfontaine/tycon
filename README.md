# Typing Test + Console
Node.js console typing test. Easy, Med, & Hard Difficulties, Speed graph, Shortcuts   
[npmjs.com/package/tycon](https://www.npmjs.com/package/tycon)    

![tycon recording](https://nicfontaine.com/dev/tycon-rec-04.gif)   

# Run

```bash
$ sudo npm i tycon -g   # Install
$ tycon
```  

## Menu Options

- Test Length (seconds): `10`, `30`, `60`, `120`, `180`
- Difficulty: `easy`, `med`, `hard`   

**Additional Test Settings..** `y/N`
- Require Correct Word Entry: `y/N`
- Colourblind Mode (blue/green): `y/N`
- Randomly Capitalize First Letter (scales with difficulty): `y/N`
- Display Time During Test: `Y/n`
- Display Average During Test: `Y/n`   

# Platforms
Written in and runs great on Linux. Haven't tried yet on MacOS, but should be similar.   

Windows is in alpha. Performance may vary, and there are probably some ANSI code issues, particulary with key combinations (ctrl + `key` for menu, ctrl + backspace) between different terminals. Feel free to give feedback.   

## Features
- **Restarting Test**: `^R` Is used to start/re-start a test, and can also be used while a test is running.
- **Word Deletion**: `Ctrl + Backspace` is used to delete a typed word. `Shift + Home` is not supported, nor is `Ctrl + W` (for Unixers), though I'm considering it.

### To-Do
- Re-do intervaled avg to average in segments, instead of over progress of the test (so chart is more relevant)
- Support custom word lists from file (validate format)
- Record local lifetime stats

### More
website: [nicfontaine.com](https://nicfontaine.com)  
twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Buy it, use it, break it, fix it, trash it, change it, mail, upgrade it. ;v