import {useState} from 'react';
import parse from 'html-react-parser';

import {
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function PasswordCard ({result}) {
    const [open, setOpen] = useState(false);

    let passwordString = "";
    for (let i = 0; i < result.words.length; i++) {
        passwordString += result.words[i].word;

        if (i < result.separators.length)
            passwordString += result.separators[i];
    }

    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex flex-row items-center justify-center">
              <IconButton
                  size="small"
                  onClick={() => setOpen(!open)}
              >
                  {open ?
                      <KeyboardArrowUpIcon /> :
                      <KeyboardArrowDownIcon />
                  }
              </IconButton>
              <span className="text-xl font-bold">{passwordString}</span>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <TableContainer>
                  <Table>
                      <TableHead>
                          <TableRow>
                              <TableCell>Word</TableCell>
                              <TableCell>Meanings</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                      {result.words.map((richWord, index) =>(
                          <TableRow key={index} sx={{ verticalAlign: 'top' }}>
                              <TableCell>{richWord.word}</TableCell>
                              <TableCell>
                                  {parse(richWord.meanings.map((meaning) => (meaning)).join('<br/>'))}
                              </TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                  </Table>
              </TableContainer>
            </Collapse>
        </div>
    );
}

export default PasswordCard;
