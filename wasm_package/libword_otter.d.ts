/* tslint:disable */
/* eslint-disable */
/**
* Preprocesses a list of words based on the provided options.
*
* # Arguments
*
* * `words` - A vector of [`RichWord`]s to be preprocessed.
* * `options` - A reference to [`PreprocessOptions`] that contains the options for preprocessing.
*
* # Returns
*
* A vector of [`RichWord`]s that has been preprocessed according to the options.
* @param {(RichWord)[]} words
* @param {PreprocessOptions} options
* @returns {(RichWord)[]}
*/
export function preprocess_word_list(words: (RichWord)[], options: PreprocessOptions): (RichWord)[];
/**
* Generates a sequence of words based on the provided input while respecting a maximum total length.
*
* The function uses a random number generator (`rng`) to create a sequence
* of a number of `word_count` words from the `input_words` list.
*
* The generated words will not exceed the specified `max_length`.
* 
* Use the [`generate_words_naive`] function if no length constraints are needed.
*
* # Arguments
*
* * `rng` - A mutable reference to the random number generator.
* * `input_words` - A vector of [`RichWord`]s to choose from.
* * `word_count` - The number of words to generate.
* * `max_length` - The maximum combined length of the generated words in bytes.
*
* # Returns
*
* A result containing either the generated words and the number of variations,
* or an error message if the generation fails.
* 
* See [`GenerationResult`] for more information about the returned values.
*
* # Errors
*
* Returns an error if no input words are given (empty list or empty strings) or
* if the length constraints cannot be fulfilled.
* @param {RngWrapper} rng
* @param {(RichWord)[]} input_words
* @param {number} word_count
* @param {number} max_length
* @returns {GenerationResult}
*/
export function generate_words(rng: RngWrapper, input_words: (RichWord)[], word_count: number, max_length: number): GenerationResult;
/**
* Generates a sequence of words based on the provided input without a length constraint.
* 
* Refer to [`generate_words`] for more information about the arguments and return values.
* 
* # Errors
* 
* Returns an error if no input words are given (empty list or empty strings).
* @param {RngWrapper} rng
* @param {(RichWord)[]} input_words
* @param {number} word_count
* @returns {GenerationResult}
*/
export function generate_words_naive(rng: RngWrapper, input_words: (RichWord)[], word_count: number): GenerationResult;
/**
* The result returned on successful generation of words.
*
* It contains the generated words and a number indicating how many variations were possible
* with the given input parameters.
*
* This struct is returned by the [`generate_words`] and [`generate_words_naive`] functions.
*/
export class GenerationResult {
  free(): void;
/**
* The number of different possible word vectors that could have been returned
* with the given input parameters.
*/
  variations: bigint;
/**
* The generated words in correct order.
*/
  words: (RichWord)[];
}
/**
* A struct representing options for preprocessing words.
*
* It contains options for case sensitivity, inclusion of words with umlauts,
* minimum word length, and regex patterns to exclude.
*/
export class PreprocessOptions {
  free(): void;
/**
* Creates a new [`PreprocessOptions`] object with the given options.
*
* # Arguments
*
* * `keep_case` - Controls whether words should be lower-cased.
* * `use_umlauts` - Controls whether words with umlauts are filtered out.
* * `min_word_length` - Controls whether words with insufficient length are removed.
* @param {boolean} keep_case
* @param {boolean} use_umlauts
* @param {number | undefined} [min_word_length]
*/
  constructor(keep_case: boolean, use_umlauts: boolean, min_word_length?: number);
/**
* Adds a regex to the list of regexes that will be used to exclude words.
*
* Matching words will be removed in preprocessing.
*
* # Returns
* An error string describing what went wrong if the regex is invalid.
* @param {string} regex
*/
  add_exclude_regex(regex: string): void;
/**
*/
  keep_case: boolean;
/**
*/
  min_word_length?: number;
/**
*/
  use_umlauts: boolean;
}
/**
*/
export class RichEntropy {
  free(): void;
/**
* @param {bigint} variations
*/
  constructor(variations: bigint);
/**
* The number of bits of entropy in the number of variations
*
* Don't quote me on the soundness of this calculation
*/
  entropy_bits: number;
/**
* The exponent of the log10 of the number of variations
*
* This is useful for displaying the number of variations in scientific notation
* Example: 1234500 = 1.2345e6 => 6
*/
  variations_exponent: number;
/**
* The mantissa of the log10 of the number of variations
*
* This is useful for displaying the number of variations in scientific notation
* Example: 1234500 = 1.2345e6 => 1.2345
*/
  variations_mantissa: number;
}
/**
* A struct representing a word with its meanings.
*
* It contains a word and a vector of meanings associated with that word.
*/
export class RichWord {
  free(): void;
/**
* Creates a new [`RichWord`] with the given word and meanings.
*
* # Arguments
*
* * `word` - The word to create.
* * `meanings` - The meanings of the word.
*
* # Returns
*
* A new instance of [`RichWord`].
* @param {string} word
* @param {(string)[]} meanings
*/
  constructor(word: string, meanings: (string)[]);
/**
*/
  meanings: (string)[];
/**
*/
  word: string;
}
/**
* A wrapper around the random number generator.
*
* This wrapper is necessary to construct the RNG from JavaScript.
*
* Uses a cryptographically secure random number generator.
*/
export class RngWrapper {
  free(): void;
/**
* Creates a new instance of the random number generator.
*/
  constructor();
/**
* Generates a vector of random digits.
*
* # Arguments
*
* * `digits` - The number of random digits to generate.
*
* # Returns
*
* A vector of random digits ranging from 0 to 9.
* @param {number} digits
* @returns {Uint8Array}
*/
  generate_digits(digits: number): Uint8Array;
}
