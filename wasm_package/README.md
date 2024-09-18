# WordOtter

WordOtter is a secure and user-friendly password generator that creates strong passphrases using a list of words. The project aims to provide an easy-to-use tool for generating memorable yet secure passwords.

## Why "WordOtter"?

The name "WordOtter" was chosen because otters are playful and intelligent animals, which reflects the nature of this password generator. Otters are known for their dexterity and problem-solving skills, symbolizing the efficiency and effectiveness of WordOtter in creating secure passphrases. Additionally, the playful aspect of otters makes the tool seem approachable and fun to use.

## Features

- Generates strong passphrases using a list of words
- User-friendly and approachable interface
- Secure and robust password generation
- Customizable options for passphrase length and complexity

## Installation

To install WordOtter, you need to have Rust and Cargo installed on your system. You can install Rust and Cargo by following the instructions at [rust-lang.org](https://www.rust-lang.org/).

Clone the repository and navigate to the project directory:

```sh
git clone https://github.com/Schuwi/word_otter.git
cd word_otter
```

Build the project using Cargo:

```sh
cargo build --release
```

## Obtaining a word list

WordOtter requires a list of words to generate passphrases. Currently no word list is provided with the project. You can use your own word list or download one from the internet. There are many word lists available online, such as the [EFF wordlists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

A python script is provided to generate a word list from a Wiktrionary dump. You can find the script in the `scripts` directory. For more information on how to use the script, refer to the [`README.md`](scripts/README.md) file in the `scripts` directory.

## Usage

After building the project, you can show the help message with the following command:

```sh
cargo run --release -- -h
```

You need to provide a word list as a file. By default the program will look for `wordliste.txt` in the current directory.\
The format is quite simple. It's just a list of words separated by line breaks.

You can customize the passphrase generation by providing additional options. For example, to generate a passphrase with a specific number of words:

```sh
cargo run --release -- 5
```

## Dependencies

WordOtter uses the following dependencies:

- `clap` for command-line argument parsing
- `color-eyre` for enhanced error reporting
- `rand` for random number generation
- `regex` for regular expression support
- `rug` or `dashu` for arbitrary precision arithmetic
- `unicode-normalization` for Unicode normalization

## TODO

- [x] Make script to generate word list from Wiktionary dump user-friendly
  - [ ] Add support for more languages in the word list generation script (help wanted)
  - [ ] Improve parsing and rendering of Wiktionary markup (help wanted)
- [x] Print meaning of words if .json file is provided
- [x] Support compilation to WebAssembly for use in the browser
  - [x] Replace `rug` with `dashu` for WebAssembly compatibility
  - [x] Refactor code to provide a programmatic API
- [x] Fix some bugs in the Wiktionary word list generation script
- [ ] Add CI build pipeline

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or improvements.

---

Enjoy using WordOtter and stay secure!