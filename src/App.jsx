const showTimers = true;

import {useState} from 'react';
import './App.css'

import {
    Alert,
    Button, Collapse, IconButton,
    InputAdornment, Link,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip, Typography,
} from "@mui/material";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import GradeIcon from '@mui/icons-material/Grade';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AbcIcon from '@mui/icons-material/Abc';
import Filter9Icon from '@mui/icons-material/Filter9';
import GitHubIcon from '@mui/icons-material/GitHub';

import PasswordCard from "./components/PasswordCard/PasswordCard.jsx";


let wordOtter = import('word_otter');
let origRichWordArr = fetchWordList();
let standardOptions = ['case', 'special'];
let separator = "string";
let separatorString = "-";
let wordCount = 2;
let maxLetterCount = 15;

async function fetchWordList() {
    try {
        const wordListStartTime = window.performance.now();
        const wordlist = (await import('../wortliste.json')).default;
        if (showTimers)
            console.log("%c[TIMER]:%c Wordlist loaded in %c" + (window.performance.now() - wordListStartTime).toPrecision(6) + "%cms", 'color: blue', 'color: inherit', 'color: red', 'color: inherit');

        let richwordArr = [];
        wordOtter = await wordOtter;
        // console.log("%cwasm successfully loaded", 'color: green');

        const parsingStartTime = window.performance.now();
        await wordlist.forEach((wordObj) => {
            richwordArr.push(new wordOtter.RichWord(wordObj.word, wordObj.meanings));
        });
        if (showTimers)
            console.log("%c[TIMER]:%c Wordlist parsed in %c" + (window.performance.now() - parsingStartTime).toPrecision(6) + "%cms", 'color: blue', 'color: inherit', 'color: red', 'color: inherit');
        // console.log("%cword list successfully loaded", 'color: green');

        return richwordArr;
    }catch (e) {
        console.error(e);
        window.location.reload(true);
    }
}

async function deepcopyRichwordArr(richwordArr) {
    let returnArr = [];
    richwordArr.forEach((richWord) => {
        returnArr.push(new wordOtter.RichWord(richWord.word, richWord.meanings));
    })
    return returnArr;
}

//TODO: show variations and entropy
function App() {
    const [wordCountDisplay, setWordCountDisplay] = useState(wordCount);
    const [maxLetterCountDisplay, setMaxLetterCountDisplay] = useState(maxLetterCount.toString());
    const [standardOptionsDisplay, setStandardOptionsDisplay] = useState(standardOptions);
    const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
    const [seperatorOption, setSeperatorOption] = useState(separator);
    const [seperatorStringDisplay, setSeperatorStringDisplay] = useState(separatorString);
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    if(errorMessage)
        setTimeout(() => {setErrorMessage(null)}, 4000);

    async function computePassword(){
        const computeStartTime = window.performance.now();
        wordOtter = await wordOtter;
        let origRichWordArrCopy = await deepcopyRichwordArr(await origRichWordArr);

        let preprocessOptions = await new wordOtter.PreprocessOptions(standardOptions.includes('case'), standardOptions.includes('special'));

        // console.log(preprocessOptions);

        let richWordArr = [];
        // richWordArr = origRichWordArr;
        try {
            const preprocessStartTime = window.performance.now();
            richWordArr = (wordOtter.preprocess_word_list(origRichWordArrCopy, preprocessOptions));
            if (showTimers)
                console.log("%c[TIMER]:%c Wordlist preprocessed in %c" + (window.performance.now() - preprocessStartTime).toPrecision(6) + "%cms", 'color: blue', 'color: inherit', 'color: red', 'color: inherit');
        }catch (e) {
            setErrorMessage(e.message);
            return;
        }

        // console.log(richWordArr);

        let result;
        let rngWrapper = new wordOtter.RngWrapper;
        try {
            if (maxLetterCount !== Number.MAX_SAFE_INTEGER) {
                let letterCount = (maxLetterCount - ((wordCount-1) * separatorString.length));
                if (letterCount < 0)
                    throw new Error("Not enough letters to generate desired word count");

                const generationStartTime = window.performance.now();
                result = wordOtter.generate_words(rngWrapper, richWordArr, wordCount, letterCount);
                if (showTimers)
                    console.log("%c[TIMER]:%c Password generated in %c" + (window.performance.now() - generationStartTime).toPrecision(6) + "%cms", 'color: blue', 'color: inherit', 'color: red', 'color: inherit');
            }else {
                const generationStartTime = window.performance.now();
                result = wordOtter.generate_words_naive(rngWrapper, richWordArr, wordCount);
                if (showTimers)
                    console.log("%c[TIMER]:%c Password naively generated in %c" + (window.performance.now() - generationStartTime).toPrecision(6) + "%cms", 'color: blue', 'color: inherit', 'color: red', 'color: inherit');
            }


        }catch (e) {
            setErrorMessage(e.message);
            return;
        }

        result.separators = [];
        if (separator === "number") {
            result.separators = rngWrapper.generate_digits(result.words.length - 1);
        }else {
            for (let i = 1; i < result.words.length; i++) {
                result.separators.push(separatorString);
            }
        }

        setResults(prev => (prepend(result, prev)));
        if (showTimers)
            console.log("%c[TIMER]:%c Total computation time: %c" + (window.performance.now() - computeStartTime).toPrecision(6) + "%cms", 'color: blue', 'color: inherit', 'color: red', 'color: inherit');
    }

    return (
        <>
            <div className={"flex flex-col w-dvw h-dvh max-h-dvh items-center justify-between overflow-hidden"}>
                <Collapse in={errorMessage !== null}>
                    <Alert severity="error" onClose={() => {setErrorMessage(null)}} className={"mt-10 mb-[-1rem]"}>{errorMessage}</Alert>
                </Collapse>
                <main className="flex flex-col w-3/4 grow shrink items-center justify-start mx-auto pt-4 mt-8 overflow-hidden">
                    {/*<div className="w-24 mb-8">*/}
                    {/*</div>*/}
                    <div className="flex flex-col w-fit h-fit items-center justify-start">
                        <div className="flex flex-row mb-4 gap-x-3 justify-center items-center">
                            <Tooltip title="advanced options">
                                <IconButton
                                    onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
                                >
                                    {advancedOptionsOpen ?
                                        <KeyboardArrowUpIcon /> :
                                        <KeyboardArrowDownIcon />
                                    }
                                </IconButton>
                            </Tooltip>
                            <ToggleButtonGroup
                                value={standardOptionsDisplay}
                                onChange={(event, newOptions) => {
                                    standardOptions = newOptions;
                                    setStandardOptionsDisplay(standardOptions);
                                }}
                            >
                                <Tooltip title="case sensitive">
                                    <ToggleButton value="case">
                                        <FormatBoldIcon />
                                    </ToggleButton>
                                </Tooltip>
                                <Tooltip title="special characters">
                                    <ToggleButton value="special">
                                        <GradeIcon />
                                    </ToggleButton>
                                </Tooltip>
                            </ToggleButtonGroup>
                            <Tooltip title="maximum password length">
                                <TextField
                                    label="max length"
                                    type="number"
                                    value={maxLetterCountDisplay}
                                    className={"w-36"}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                        input: {
                                            endAdornment: <InputAdornment position="end">{(maxLetterCountDisplay != 1 ? (maxLetterCountDisplay === "" ? "infinite" : "letters") : "letter")}</InputAdornment>,
                                        },
                                    }}
                                    onChange={(event) => {
                                        let value = Number(event.target.value);
                                        if (isNaN(value) || value < 1 || value > 1000) {
                                            maxLetterCount = Number.MAX_SAFE_INTEGER;
                                            setMaxLetterCountDisplay("");
                                        }else {
                                            maxLetterCount = value;
                                            setMaxLetterCountDisplay(maxLetterCount.toString());
                                        }

                                    }}

                                />
                            </Tooltip>
                            <Tooltip title="word count">
                                <TextField
                                    variant="standard"
                                    type="number"
                                    size="medium"
                                    value={wordCountDisplay}
                                    className={"w-24"}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                        input: {
                                            endAdornment: <InputAdornment position="end">{(wordCountDisplay != 1 ? "words" : "word")}</InputAdornment>,
                                        },
                                    }}
                                    onChange={(event) => {
                                        let value = Number(event.target.value);
                                        if (isNaN(value) || value < 1)
                                            value = 1;
                                        else if (value > 100)
                                            value = 100;
                                        wordCount = value;
                                        setWordCountDisplay(wordCount);
                                    }}

                                />
                            </Tooltip>
                        </div>
                        <Collapse in={advancedOptionsOpen} timeout="auto" unmountOnExit>
                            <div className="flex flex-row mb-4 gap-x-3 justify-center items-center">
                                <ToggleButtonGroup
                                    exclusive
                                    value={seperatorOption}
                                    onChange={(event, selection) => {
                                        if (selection !== null) {
                                            separator = selection;
                                            console.log(separator);
                                            setSeperatorOption(separator);
                                        }
                                    }}
                                >
                                    <Tooltip title="use random numbers as seperators">
                                        <ToggleButton value="number">
                                            <Filter9Icon/>
                                        </ToggleButton>
                                    </Tooltip>
                                    <Tooltip title="use separator string">
                                        <ToggleButton value="string">
                                            <AbcIcon/>
                                        </ToggleButton>
                                    </Tooltip>
                                </ToggleButtonGroup>
                                <Collapse in={seperatorOption === "string"} timeout="auto" unmountOnExit orientation="horizontal">
                                    <Tooltip title="separator string">
                                            <TextField
                                                variant="filled"
                                                value={seperatorStringDisplay}
                                                label="separator"
                                                className={"w-36"}
                                                disabled={seperatorOption === "number"}
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true,
                                                    },
                                                }}
                                                onChange={(event) => {
                                                    separatorString = event.target.value;
                                                    setSeperatorStringDisplay(separatorString);
                                                }}

                                            />
                                    </Tooltip>
                                </Collapse>
                                {/*TODO: add exclude regex feature*/}
                            </div>
                        </Collapse>
                    </div>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            computePassword();
                        }}
                    >Generate</Button>

                    {/*TODO: fix long word formatting errors*/}
                    <div className="flex flex-col gap-y-4 w-fit h-full overflow-y-auto overflow-x-hidden my-8">
                        {results.map((result, index) => (<PasswordCard key={results.length-1 - index} result={result} />))}
                    </div>
                </main>
                <footer className={"h-16 w-full bg-zinc-200 dark:bg-zinc-700 flex flex-row items-center justify-center shrink-0"}>
                    <Typography fontSize={"small"}>
                        Made with 🍕 by <Link href={"https://github.com/maxboeer"} color={"textSecondary"} underline={"none"}>maxboeer</Link> and <Link href={"https://github.com/Schuwi"} color={"textSecondary"} underline={"none"}>Schuwi</Link>.
                    </Typography>
                    <Tooltip title="open this project on github">
                        <IconButton href="https://github.com/maxboeer/word-otter-webapp" target={"_blank"}>
                            <GitHubIcon />
                        </IconButton>
                    </Tooltip>
                </footer>
            </div>
        </>
    );
}

function prepend(value, array) {
    let newArray = array.slice();
    newArray.unshift(value);
    return newArray;
}

export default App
