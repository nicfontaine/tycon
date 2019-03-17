# Typing Test + Console
Node.js console typing test. Easy, Med, & Hard Difficulties, Speed graph, Shortcuts   
[npmjs.com/package/tycon](https://www.npmjs.com/package/tycon)    

![tycon recording](https://nicfontaine.com/dev/tycon-rec-04.gif)   

# Platforms
Written in and runs great on Linux. Haven't tried yet on MacOS, but should be similar.  Windows is never going to like the frequency of console clear / writes, so unless there's some great GPU accelerated terminal it runs well on, I wouldn't recommend it.   

# Run

```bash
$ sudo npm i tycon -g   # Install

$ tycon                 # Default: 60 seconds on Medium
$ tycon easy            # Weak sauce
$ tycon med             # Groove time
$ tycon hard            # Wtf are these words..?
$ tycon 10            	# 10 seconds
$ tycon skip            # Skip to next word when typed incorrectly
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
- General cleanup ;(

### More
website: [nicfontaine.com](https://nicfontaine.com)  
twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Buy it, use it, break it, fix it, trash it, change it, mail, upgrade it. ;v


```TestData = {
	store: {
		system: {
			wordSet: [],
			colour: {
				current: 
			},
			time: {
				begin: undefined,
				remaining: 0,
				timer: undefined
			}
		},
		user: {
			current: "",
			prevAvg: 0,
			stats: {
				correct: 0,
				correct: 0,
				correct: 0,
				avgs: []
			}
		}
	}
}

TestConfig = {
	store: {
		display: {
			maxWordsPerLine: 5,
			colourBlind: false,
			show: {
				avg: true,
				time: true
			},
			colour: {
				good: "green",
				bad: "red",
				cb: "blue"
			}
		},
		test: {
			period: 60,
			diffOptions: [],
			difficulty: 1,
			skip: false,
			caps: false,
			reject: []
		}
	}
}

InputHandler: {
	f: {
		colours: {
			good: function() {

			},
			success: function() {

			},
			bad: function() {

			},
		},
		check: function() {

		},
		avg: function() {
		
		},
		proc: function() {
		
		},
		clear: function() {
		
		},
		incorrect: function() {
		
		}
	}
}

SourceHandler: {
	next: function() {

	},
	newSet: function() {

	},
	format: function() {

	}
}```