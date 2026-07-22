---
title: 'How I Met QMK: My Journey to Custom Ergonomic Keyboards'
date: '2026-06-01'
author: Volodymyr Shcherbyna
category: Hardware
excerpt: >-
  From a sluggish typist struggling with wrist pain to mastering QMK firmware on
  a custom split keyboard, discover my transformative journey into ergonomic
  typing.
coverImage: >-
  https://images.unsplash.com/photo-1653786146466-9ac4d30a47f1?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxfHxzcGxpdCUyMGVyZ29ub21pYyUyMGtleWJvYXJkfGVufDB8MHx8fDE3NzA3MTYxMzV8MA&ixlib=rb-4.1.0&w=800&h=400&fit=crop
tags:
  - QMK
  - ergonomics
  - split keyboard
  - Vial
  - mechanical keyboards
comments: true
---

## How It All Started: The Motivation

For years, I relied on a compact portable Bluetooth keyboard equipped with a touchpad. While the touchpad left much to be desired in terms of precision, the setup was functional enough for my needs.

Before 2025, my typing speed was comically slow—like the sloth from *Zootopia*, methodically plodding through code snippets such as `if`, `for`, or `class`. But 2025 marked a pivotal shift.

My typing transformed dramatically, resembling the frantic energy of the iconic scene from *Bruce Almighty* where Jim Carrey unleashes a torrent of words.

![Slow typing mood (sloth vibes)](https://media1.tenor.com/m/GYYxsYIlxjcAAAAd/sloth-office.gif)

![2025 typing mode (Bruce Almighty typing)](https://media1.tenor.com/m/2SYxbEBLX_kAAAAd/typing-bruce-almighty.gif)


Suddenly, I was writing far less code and spending most of my time composing natural language prompts to instruct AI assistants. Unfortunately, I couldn't find a reliable speech-to-text solution for Ubuntu, leading to relentless strain in my fingers, wrists, and forearms.

This pain was my wake-up call: it was time for a proper keyboard upgrade.

I first dusted off my old Microsoft Ergonomic Keyboard 4000, which had been gathering dust for about 15 years. It provided temporary relief for a couple of weeks but introduced new discomforts, prompting me to seek better options.

Before going fully “enthusiast mode,” I also looked at mainstream ergonomic keyboards (Logitech Ergo K860, Microsoft Sculpt, various “Alice” layouts, etc.). They’re a solid step up from flat laptop keyboards, but for me they still didn’t solve the core issue: I wanted a split layout *and* a way to control the pointer without moving my hands away.


Next, I eyed the Kinesis Advantage series—renowned for its split, contoured design. It's like the MacBook of keyboards: sleek, premium, and ready to use out of the box, but at a steep price of $350–$450.

However, curiosity led me to explore alternatives, uncovering some true gems in the world of input devices.

## Alternative Input Devices

![Mechanical ergonomic keyboard on desk mat, representing alternative keyboards including steno and chorded models](https://images.unsplash.com/photo-1743862558369-5dcea79ccbff?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxMXx8ZXJnb25vbWljJTIwa2V5Ym9hcmQlMjBzdGVubyUyMGNob3JkZWR8ZW58MHwwfHx8MTc3MDcxNjE2OHww&ixlib=rb-4.1.0&w=800&h=400&fit=crop)

### Steno Keyboard

Stenotype machines enable chorded typing, producing entire syllables or words in a single stroke. These devices allow trained stenographers to type as fast as speech (200+ WPM), but require significant training and cost $1,000–$5,000+.

![Michela-style steno keyboard (example)](https://commons.wikimedia.org/wiki/Special:FilePath/Michela_machine.jpg)

### CharaChorder

CharaChorder is a chorded keyboard device where each key represents a set of letters. It reduces finger movement dramatically and enables extremely high typing speeds, but it has a learning curve and costs around $250–$300.

![CharaChorder Two chorded keyboard (product image)](https://www.charachorder.com/cdn/shop/files/2.1.jpg?v=1763852125)

### Svalboard

Svalboard is a modern DataHand-inspired keyboard using optical + magnetic switches. It provides deeply ergonomic finger motion and built-in pointing options. It’s premium and expensive (~$800–$1,200+) but beloved by RSI sufferers.

![Svalboard optical keyboard (product image)](https://twey.io/hci/svalboard/svalboard.jpeg)

### Open Firmware Ecosystem: QMK/ZMK/RMK

Then there's the entire domain of keyboards built on open-source firmware—and often open hardware too.

Standard keyboards work using a **matrix** under the keys. When you press a key, it connects a row to a column. The microcontroller scans rows/columns many times per second, detects which line is shorted, and identifies which key was pressed.

The firmware’s main job: detect key presses and communicate them to the computer.

Popular open-source firmware options include:

- **QMK** (Quantum Mechanical Keyboard)
- **ZMK** (Zephyr Mechanical Keyboard)
- **RMK** (Rust Mechanical Keyboard)

I started with QMK because it’s the most popular and supports hundreds (maybe thousands) of keyboards out of the box.

You can buy prebuilt boards, or go fully DIY: download source files, etch PCBs, solder everything by hand. Complete freedom.

## My First Split Keyboard (and My First Mistake)

I wanted something affordable to start with—a **split keyboard** with the ability to control the mouse pointer without moving my hands away.

So I chose the cheapest option that matched those requirements, without knowing much about the model: a ~$100 copy of the **BastardKB Dilemma**.

![BastardKB Dilemma split keyboard with Procyon-compatible trackpad](https://raw.githubusercontent.com/Bastardkb/Dilemma/main/pics/1n.JPG)

After a while, it arrived. I brought it home, plugged it in, and it worked out of the box.

But there were issues:

- Touchpad glitches
- No dynamic remapping / runtime keymap editing

As a programmer, I rolled up my sleeves: cloned QMK, set up the build environment, compiled the default firmware, and... bricked the keyboard.

That's when the real adventure began.


## Reverse Engineering Everything

My keyboard featured a non-standard pinout. With no support from the seller, I dove in with a multimeter over several weekends:

![Raspberry Pi Pico (RP2040) and probes used in a DIY multimeter setup](https://www.electromaker.io/uploads/images/Blog/pi-pico-multimeter/Electromaker%20Multimeter%20W%20.jpg)


- Mapping the key matrix
- Identifying MCU pins
- Reverse-engineering LED wiring
- Decoding touchpad connections

I then adapted QMK configs, rebuilt, and reflashed. Months of iterative weekend work later—surprisingly enjoyable—I had it running:

1. Key matrix functional
2. Touchpad via QMK drivers
3. Full LED support

## Dynamic Remapping: VIA vs. Vial

Next: live key remapping without reflashing.

- **VIA**: Popular, simple
- **Vial**: More powerful fork of QMK with advanced USB extensions

I chose Vial, requiring a QMK fork, porting my mods, and another full rebuild. Coding agents were invaluable here.

## Final Result

Behold: a Vial-enabled QMK split keyboard masterpiece.

**Key Features:**
- **Dynamic Remapping**: Reassign keys on the fly.
- **Combos**: Multi-key chords for shortcuts (e.g., J+K = Esc), minimizing stretch.
- **Tap Dance**: Contextual actions per tap style (tap = `(`, hold = `{`).
- **Macros**: Programmable keystroke sequences.


![Mechanical keyboard with rainbow RGB lighting, showcasing final custom QMK Vial split keyboard with macros and trackpad](https://images.unsplash.com/photo-1766656533864-2314b462d439?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHw0fHxzcGxpdCUyMG1lY2hhbmljYWwlMjBrZXlib2FyZCUyMFJHQiUyMGN1c3RvbXxlbnwwfDB8fHwxNzcwNzE2MTY4fDA&ixlib=rb-4.1.0&w=800&h=400&fit=crop)

## Main Takeaway

Ergonomics and typing speed are independent dimensions.

- Boost ergonomics without speed gains.
- Achieve high speeds on stock keyboards.

Yet, superior ergonomics enables *sustainable* high-volume typing—pain-free. For me, that's the ultimate win.
