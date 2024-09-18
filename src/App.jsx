import {useState} from 'react';
import './App.css'

import {
    Button,
    InputAdornment,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from "@mui/material";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import GradeIcon from '@mui/icons-material/Grade';

import PasswordCard from "./components/PasswordCard/PasswordCard.jsx";

let wordOtter = import('word_otter');
let origRichWordArr = fetchWordList();
let standardOptions = ['case', 'special'];
let wordCount = 2;
let maxLetterCount = 15;

async function fetchWordList() {
    const wordlist = (await import('../wortliste.json')).default;

    let richwordArr = [];
    wordOtter = await wordOtter;
    console.log("wasm successfully loaded");

    await wordlist.forEach((wordObj) => {
        richwordArr.push(new wordOtter.RichWord(wordObj.word, wordObj.meanings));
    });
    console.log("word list successfully loaded");
    return richwordArr;
}

//TODO add features: sepdigit, sepchar, exclude regex

function App() {
    const [wordCountDisplay, setWordCountDisplay] = useState(wordCount);
    const [maxLetterCountDisplay, setMaxLetterCountDisplay] = useState(maxLetterCount.toString());
    const [standardOptionsDisplay, setStandardOptionsDisplay] = useState(standardOptions);
    const [results, setResults] = useState([]);

    async function computePassword(){
        wordOtter = await wordOtter;

        let preprocessOptions = await new wordOtter.PreprocessOptions(standardOptions.includes('case'), standardOptions.includes('special'));
        // console.log(preprocessOptions);

        let richWordArr = [];
        // richWordArr = origRichWordArr;
        try {
            richWordArr = (wordOtter.preprocess_word_list(await origRichWordArr, preprocessOptions));
        }catch (e) {
            console.warn(e);
        }

        console.log(richWordArr);

        let result;
        try {
            result = wordOtter.generate_words(new wordOtter.RngWrapper, richWordArr, wordCount, maxLetterCount);
        }catch (e) {
            console.warn(e);
        }

        console.log(result);

        setResults(prev => (prepend(result, prev)));
    }

    return (
        <>
            <div className="flex flex-col w-3/4 h-full items-center justify-start mx-auto py-4">
                {/*<div className="w-24 mb-8">*/}
                {/*</div>*/}
                <div className="flex flex-row mb-4 gap-x-3">
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
                            label=" "
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
                <Button
                    variant="contained"
                    onClick={(event) => {
                        computePassword();
                    }}
                >Generate</Button>

                <div className="flex flex-col gap-y-4 w-fit h-full overflow-y-auto overflow-x-hidden">
                    {results.map((result, index) => (<PasswordCard key={index} result={result}/>))}
                </div>
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
