/**
 * --- Day 4: Ceres Search ---
"Looks like the Chief's not here.
Next!" One of The Historians pulls out a device and pushes the only button on it.
After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt;
she'd like to know if you could help her with her word search (your puzzle input).
She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards,
or even overlapping other words.
It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them.
Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:

..X...
.SAMX.
.A..A.
XMAS.S
.X....
The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX
Take a look at the little Elf's word search. How many times does XMAS appear?
 */
const { readFileSync } = require('fs');

function puzzle1Brute(useSample) {
    let file = '';
    const fileName = useSample ? 'day4-sample.txt' : 'day4.txt'
    file = readFileSync('./inputs/' + fileName, 'utf8');

    /**
     *
     * @param {string[]} mat
     * @param {number} row
     * @param {number} col
     * @param {number} maxRows
     * @param {number} maxCols
     */
    function countXMAS(mat, row, col, maxRows, maxCols) {
        const XMAS = 'XMAS';
        let topLeft = topTop = topRight = leftLeft = rightRight = bottomLeft = bottomBottom = bottomRight = true;

        // search horizontal
        // search vertical
        // search diagonally
        for (let offset = 1; offset < 4; offset++) {
            topLeft &= row - offset >= 0 && col - offset >= 0 && mat[row - offset][col - offset] == XMAS[offset];
            topTop &= row - offset >= 0 && mat[row - offset][col] == XMAS[offset];
            topRight &= row - offset >= 0 && col + offset < maxCols && mat[row - offset][col + offset] == XMAS[offset];
            leftLeft &= col - offset >= 0 && mat[row][col - offset] == XMAS[offset];
            rightRight &= col + offset < maxCols && mat[row][col + offset] == XMAS[offset];
            bottomLeft &= row + offset < maxRows && col - offset >= 0 && mat[row + offset][col - offset] == XMAS[offset];
            bottomBottom &= row + offset < maxRows && mat[row + offset][col] == XMAS[offset];
            bottomRight &= row + offset < maxRows && col + offset < maxCols && mat[row + offset][col + offset] == XMAS[offset];
        }

        if (process.env.debug === 'True') {
            let debug = ''
            debug += topLeft && `tl(${row}, ${col}) -> (${row - 3}, ${col - 3})\n` || '';
            debug += topTop && `tt(${row}, ${col}) -> (${row - 3}, ${col})\n` || '';
            debug += topRight && `tr(${row}, ${col}) -> (${row - 3}, ${col + 3})\n` || '';
            debug += leftLeft && `ll(${row}, ${col}) -> (${row}, ${col - 3})\n` || '';
            debug += rightRight && `lr(${row}, ${col}) -> (${row}, ${col + 3})\n` || '';
            debug += bottomLeft && `bl(${row}, ${col}) -> (${row + 3}, ${col - 3})\n` || '';
            debug += bottomBottom && `bb(${row}, ${col}) -> (${row + 3}, ${col})\n` || '';
            debug += bottomRight && `br(${row}, ${col}) -> (${row + 3}, ${col + 3})\n` || '';

            debug[debug.length - 1] == '\n';
            debug = debug.slice(0, debug.length - 1);
            debug != '' && console.log(debug);
        }

        return topLeft + topTop + topRight + leftLeft + rightRight + bottomLeft + bottomBottom + bottomRight;
    }

    const mat = file.split('\n');
    let xmasCount = 0;
    for (row = 0; row < mat.length; row++) {
        for (col = 0; col < mat[0].length; col++) {
            if (mat[row][col] == 'X') {
                xmasCount += countXMAS(mat, row, col, mat.length, mat[0].length)
            }
        }
    }

    return xmasCount;
}

console.log(puzzle1Brute(true));
console.log(puzzle1Brute());

/**
 * --- Part Two ---
The Elf looks quizzically at you. Did you misunderstand the assignment?

Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle;
it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

M.S
.A.
M.S
Irrelevant characters have again been replaced with . in the above diagram.
Within the X, each MAS can be written forwards or backwards.

Here's the same example from before, but this time all of the X-MASes have been kept instead:

.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
In this example, an X-MAS appears 9 times.

Flip the word search from the instructions back over to the word search side and try again.
How many times does an X-MAS appear?
 */

function puzzle2(useSample) {
    let file = '';
    const fileName = useSample ? 'day4-sample.txt' : 'day4.txt'
    file = readFileSync('./inputs/' + fileName, 'utf8');

    const mat = file.split('\n');
    let xmasCount = 0;

    function isXMAS(mat, row, col) {
        const R = mat.length,
            C = mat[0].length;
        const pos = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

        if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < R && col + 1 < C) {
            for (let [ri, ci] of pos) {
                if (mat[row + ri][col + ci] === 'M'
                    && mat[row - ri][col - ci] === 'S'
                    && (
                        mat[row - ri][col + ci] === 'M'
                        && mat[row + ri][col - ci] === 'S'
                        || mat[row + ri][col - ci] === 'M'
                        && mat[row - ri][col + ci] === 'S'
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    for (row = 0; row < mat.length; row++) {
        for (col = 0; col < mat[0].length; col++) {
            if (mat[row][col] == 'A') {
                xmasCount += isXMAS(mat, row, col, mat.length, mat[0].length);
            }
        }
    }
    return xmasCount;
}

console.log(puzzle2(true));
console.log(puzzle2());
