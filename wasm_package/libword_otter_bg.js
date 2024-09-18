let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
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
export function preprocess_word_list(words, options) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayJsValueToWasm0(words, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(options, PreprocessOptions);
        wasm.preprocess_word_list(retptr, ptr0, len0, options.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

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
export function generate_words(rng, input_words, word_count, max_length) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(rng, RngWrapper);
        const ptr0 = passArrayJsValueToWasm0(input_words, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.generate_words(retptr, rng.__wbg_ptr, ptr0, len0, word_count, max_length);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return GenerationResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

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
export function generate_words_naive(rng, input_words, word_count) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(rng, RngWrapper);
        const ptr0 = passArrayJsValueToWasm0(input_words, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.generate_words_naive(retptr, rng.__wbg_ptr, ptr0, len0, word_count);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return GenerationResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const GenerationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_generationresult_free(ptr >>> 0, 1));
/**
* The result returned on successful generation of words.
*
* It contains the generated words and a number indicating how many variations were possible
* with the given input parameters.
*
* This struct is returned by the [`generate_words`] and [`generate_words_naive`] functions.
*/
export class GenerationResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GenerationResult.prototype);
        obj.__wbg_ptr = ptr;
        GenerationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GenerationResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_generationresult_free(ptr, 0);
    }
    /**
    * The generated words in correct order.
    * @returns {(RichWord)[]}
    */
    get words() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_generationresult_words(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The generated words in correct order.
    * @param {(RichWord)[]} arg0
    */
    set words(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_generationresult_words(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * The number of different possible word vectors that could have been returned
    * with the given input parameters.
    * @returns {bigint}
    */
    get variations() {
        const ret = wasm.__wbg_get_generationresult_variations(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * The number of different possible word vectors that could have been returned
    * with the given input parameters.
    * @param {bigint} arg0
    */
    set variations(arg0) {
        wasm.__wbg_set_generationresult_variations(this.__wbg_ptr, addHeapObject(arg0));
    }
}

const PreprocessOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_preprocessoptions_free(ptr >>> 0, 1));
/**
* A struct representing options for preprocessing words.
*
* It contains options for case sensitivity, inclusion of words with umlauts,
* minimum word length, and regex patterns to exclude.
*/
export class PreprocessOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PreprocessOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_preprocessoptions_free(ptr, 0);
    }
    /**
    * @returns {boolean}
    */
    get keep_case() {
        const ret = wasm.__wbg_get_preprocessoptions_keep_case(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set keep_case(arg0) {
        wasm.__wbg_set_preprocessoptions_keep_case(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get use_umlauts() {
        const ret = wasm.__wbg_get_preprocessoptions_use_umlauts(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set use_umlauts(arg0) {
        wasm.__wbg_set_preprocessoptions_use_umlauts(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get min_word_length() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_preprocessoptions_min_word_length(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} [arg0]
    */
    set min_word_length(arg0) {
        wasm.__wbg_set_preprocessoptions_min_word_length(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
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
    constructor(keep_case, use_umlauts, min_word_length) {
        const ret = wasm.preprocessoptions_new(keep_case, use_umlauts, !isLikeNone(min_word_length), isLikeNone(min_word_length) ? 0 : min_word_length);
        this.__wbg_ptr = ret >>> 0;
        PreprocessOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * Adds a regex to the list of regexes that will be used to exclude words.
    *
    * Matching words will be removed in preprocessing.
    *
    * # Returns
    * An error string describing what went wrong if the regex is invalid.
    * @param {string} regex
    */
    add_exclude_regex(regex) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(regex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.preprocessoptions_add_exclude_regex(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const RichEntropyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_richentropy_free(ptr >>> 0, 1));
/**
*/
export class RichEntropy {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RichEntropyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_richentropy_free(ptr, 0);
    }
    /**
    * The number of bits of entropy in the number of variations
    *
    * Don't quote me on the soundness of this calculation
    * @returns {number}
    */
    get entropy_bits() {
        const ret = wasm.__wbg_get_richentropy_entropy_bits(this.__wbg_ptr);
        return ret;
    }
    /**
    * The number of bits of entropy in the number of variations
    *
    * Don't quote me on the soundness of this calculation
    * @param {number} arg0
    */
    set entropy_bits(arg0) {
        wasm.__wbg_set_richentropy_entropy_bits(this.__wbg_ptr, arg0);
    }
    /**
    * The exponent of the log10 of the number of variations
    *
    * This is useful for displaying the number of variations in scientific notation
    * Example: 1234500 = 1.2345e6 => 6
    * @returns {number}
    */
    get variations_exponent() {
        const ret = wasm.__wbg_get_richentropy_variations_exponent(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The exponent of the log10 of the number of variations
    *
    * This is useful for displaying the number of variations in scientific notation
    * Example: 1234500 = 1.2345e6 => 6
    * @param {number} arg0
    */
    set variations_exponent(arg0) {
        wasm.__wbg_set_richentropy_variations_exponent(this.__wbg_ptr, arg0);
    }
    /**
    * The mantissa of the log10 of the number of variations
    *
    * This is useful for displaying the number of variations in scientific notation
    * Example: 1234500 = 1.2345e6 => 1.2345
    * @returns {number}
    */
    get variations_mantissa() {
        const ret = wasm.__wbg_get_richentropy_variations_mantissa(this.__wbg_ptr);
        return ret;
    }
    /**
    * The mantissa of the log10 of the number of variations
    *
    * This is useful for displaying the number of variations in scientific notation
    * Example: 1234500 = 1.2345e6 => 1.2345
    * @param {number} arg0
    */
    set variations_mantissa(arg0) {
        wasm.__wbg_set_richentropy_variations_mantissa(this.__wbg_ptr, arg0);
    }
    /**
    * @param {bigint} variations
    */
    constructor(variations) {
        const ret = wasm.richentropy_calculate(addHeapObject(variations));
        this.__wbg_ptr = ret >>> 0;
        RichEntropyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const RichWordFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_richword_free(ptr >>> 0, 1));
/**
* A struct representing a word with its meanings.
*
* It contains a word and a vector of meanings associated with that word.
*/
export class RichWord {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RichWord.prototype);
        obj.__wbg_ptr = ptr;
        RichWordFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof RichWord)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RichWordFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_richword_free(ptr, 0);
    }
    /**
    * @returns {string}
    */
    get word() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_richword_word(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} arg0
    */
    set word(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_richword_word(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {(string)[]}
    */
    get meanings() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_richword_meanings(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {(string)[]} arg0
    */
    set meanings(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_richword_meanings(this.__wbg_ptr, ptr0, len0);
    }
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
    constructor(word, meanings) {
        const ptr0 = passStringToWasm0(word, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(meanings, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.richword_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        RichWordFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const RngWrapperFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rngwrapper_free(ptr >>> 0, 1));
/**
* A wrapper around the random number generator.
*
* This wrapper is necessary to construct the RNG from JavaScript.
*
* Uses a cryptographically secure random number generator.
*/
export class RngWrapper {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RngWrapperFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rngwrapper_free(ptr, 0);
    }
    /**
    * Creates a new instance of the random number generator.
    */
    constructor() {
        const ret = wasm.rngwrapper_new();
        this.__wbg_ptr = ret >>> 0;
        RngWrapperFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
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
    generate_digits(digits) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rngwrapper_generate_digits(retptr, this.__wbg_ptr, digits);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_richword_unwrap(arg0) {
    const ret = RichWord.__unwrap(takeObject(arg0));
    return ret;
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_richword_new(arg0) {
    const ret = RichWord.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_crypto_1d1f22824a6a080c(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_process_4a72847cc503995b(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

export function __wbg_versions_f686565e586dd935(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

export function __wbg_node_104a2ff8d6ea03a2(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export function __wbg_require_cca90b1a94a0255b() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg_msCrypto_eb05e62b530a1508(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export function __wbg_randomFillSync_5c9c955aa56b6049() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };

export function __wbg_getRandomValues_3aa56aa6edec874c() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

export function __wbg_newnoargs_76313bd6ff35d0f2(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_call_1084a111329e68ce() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_self_3093d5d1f7bcb682() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_3bcfc4d31bc012f8() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_86b222e13bdf32ed() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_e5a3fe56f8be9485() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_BigInt_38f8da7386bbae76() { return handleError(function (arg0) {
    const ret = BigInt(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_toString_2e14737b6219a1c7() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).toString(arg1);
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_89af060b4e1523f2() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_buffer_b7b08af79b0b0974(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_8a2cb9ca96b27ec9(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_new_ea1883e1e5e86686(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_d1e79e2388520f18(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_newwithlength_ec548f448387c968(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_subarray_7c2e3576afe181d1(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

