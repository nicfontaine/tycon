# Typing Test + Console
Node.js console typing test. Easy, Med, & Hard Difficulties, Speed graph, Shortcuts   
[npmjs.com/package/tycon](https://www.npmjs.com/package/tycon)    

![tycon recording](https://nicfontaine.com/dev/tycon-rec-04.gif)   

# Platforms
Written in and runs great on Linux. Haven't tried yet on MacOS, but should be similar.   

Windows is in alpha. Performance may vary, and there are probably some ANSI code issues, particulary with key combinations (ctrl + `key` for menu, ctrl + backspace) between different terminals. Feel free to give feedback.   

# Run

```bash
$ sudo npm i tycon -g   # Install

$ tycon                 # Default: 60 seconds on Medium
$ tycon easy            # Weak sauce
$ tycon med             # Groove time
$ tycon hard            # Wtf are these words..?
$ tycon 10            	# 10 seconds
$ tycon skip            # Skip to next word when typed incorrectly
$ tycon cb              # Colour-blind mode
$ tycon caps            # Randomly (scales with difficulty) capitalize first letter
$ tycon easy 300        # Test has max of 5 minutes
```  

## Shortcuts

```bash
$ ^R        # Start / Restart
$ ^C        # Quit
```  

### To-Do
- Menu for length, difficulty, and run states with Inquirer
- Re-do intervaled avg to average in segments, instead of over the whole test (so chart is relevant)
- Use custom word list from file (validate format)
- Lifetime stats

### More
website: [nicfontaine.com](https://nicfontaine.com)  
twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Buy it, use it, break it, fix it, trash it, change it, mail, upgrade it. ;v