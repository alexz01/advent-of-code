/**
 * Advent of Code[About][Events][Shop][Settings][Log Out]alexz01 3*
      /^2024$/[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
Unison - A friendly programming language from the future
--- Day 2: Red-Nosed Reports ---
Fortunately, the first location The Historians want to search isn't a long walk from the Chief Historian's office.

While the Red-Nosed Reindeer nuclear fusion/fission plant appears to contain no sign of the Chief Historian, the engineers there run up to you as soon as they see you. Apparently, they still talk about the time Rudolph was saved through molecular synthesis from a single electron.

They're quick to add that - since you're already here - they'd really appreciate your help analyzing some unusual data from the Red-Nosed reactor. You turn to check if The Historians are waiting for you, but they seem to have already divided into groups that are currently searching every corner of the facility. You offer to help with the unusual data.

The unusual data (your puzzle input) consists of many reports, one report per line. Each report is a list of numbers called levels that are separated by spaces. For example:

7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
This example data contains six reports each containing five levels.

The engineers are trying to figure out which reports are safe. The Red-Nosed reactor safety systems can only tolerate levels that are either gradually increasing or gradually decreasing. So, a report only counts as safe if both of the following are true:

The levels are either all increasing or all decreasing.
Any two adjacent levels differ by at least one and at most three.
In the example above, the reports can be found safe or unsafe by checking those rules:

7 6 4 2 1: Safe because the levels are all decreasing by 1 or 2.
1 2 7 8 9: Unsafe because 2 7 is an increase of 5.
9 7 6 2 1: Unsafe because 6 2 is a decrease of 4.
1 3 2 4 5: Unsafe because 1 3 is increasing but 3 2 is decreasing.
8 6 4 4 1: Unsafe because 4 4 is neither an increase or a decrease.
1 3 6 7 9: Safe because the levels are all increasing by 1, 2, or 3.
So, in this example, 2 reports are safe.

Analyze the unusual data from the engineers. How many reports are safe?

Your puzzle answer was 564.

The first half of this puzzle is complete! It provides one gold star: *
 */
const fs = require('fs');

/**
 * @returns {number[][]} List of reports, where each report is a list of levels.
 */
function getReportList(trySample = false) {
    let inputPath = trySample ? './inputs/day2-sample.txt' : './inputs/day2.txt';
    const inputText = fs.readFileSync(inputPath, 'utf-8');
    const reportLines = inputText.split('\n');
    const reportList = [];
    for (const reportLine of reportLines) {
        const reportLevels = reportLine.trim().split(' ').map(v => parseInt(v));
        reportList.push(reportLevels);
    }
    return reportList;
}



/**
 * The engineers are trying to figure out which reports are safe.
 * The Red-Nosed reactor safety systems can only tolerate levels that are either gradually increasing or gradually decreasing.
 * So, a report only counts as safe if both of the following are true:
 *  - The levels are either all increasing or all decreasing.
 *  - Any two adjacent levels differ by at least one and at most three.
 * @return {number} number of safe reports;
 */
function puzzle1(useSample = false) {
    const reports = getReportList(useSample);
    let safeCount = 0;
    for (const report of reports) {
        let increasing = report[0] < report[report.length - 1];
        let isSafe = 1;
        for (let i = 0; i < report.length - 1; i++) {
            const diff = Math.abs(report[i] - report[i + 1]);

            if (increasing && report[i] > report[i + 1]
                || !increasing && report[i] < report[i + 1]
                || diff < 1
                || diff > 3
            ) {
                isSafe = 0;
                break;
            }
        }
        safeCount += isSafe;
    }
    return safeCount;
}

console.log(puzzle1());



/**
--- Part Two ---
The engineers are surprised by the low number of safe reports until they realize they forgot to tell you about the Problem Dampener.

The Problem Dampener is a reactor-mounted module that lets the reactor safety systems tolerate a single bad level in what would otherwise be a safe report. It's like the bad level never happened!

Now, the same rules apply as before, except if removing a single level from an unsafe report would make it safe, the report instead counts as safe.

More of the above example's reports are now safe:

7 6 4 2 1: Safe without removing any level.
1 2 7 8 9: Unsafe regardless of which level is removed.
9 7 6 2 1: Unsafe regardless of which level is removed.
1 3 2 4 5: Safe by removing the second level, 3.
8 6 4 4 1: Safe by removing the third level, 4.
1 3 6 7 9: Safe without removing any level.
Thanks to the Problem Dampener, 4 reports are actually safe!

Update your analysis by handling situations where the Problem Dampener can remove a single level from unsafe reports. How many reports are now safe?

Answer:


Although it hasn't changed, you can still get your puzzle input.

You can also [Share] this puzzle.
 * @return {number} number of safe reports;
 */
function puzzle2(useSample = false) {
    const reports = getReportList(useSample);
    let safeCount = 0;
    let output = [];

    function increasingUnsafeCount(report) {
        if (report.length <= 1)
            return 0;

        const diff = report[1] - report[0];
        if (diff >= 1 && diff <= 3) {
            return increasingUnsafeCount(report.slice(1));
        }
        return 1 + increasingUnsafeCount([report[0], ...report.slice(2)])
    }

    function decreasingUnsafeCount(report) {
        if (report.length <= 1)
            return 0;

        const diff = report[0] - report[1];
        if (diff >= 1 && diff <= 3) {
            return decreasingUnsafeCount(report.slice(1));
        }
        return 1 + decreasingUnsafeCount([report[0], ...report.slice(2)])
    }
    for (const report of reports) {
        let i1 = increasingUnsafeCount(report)
        let i2 = increasingUnsafeCount(report.slice(1)) + 1
        let d1 = decreasingUnsafeCount(report)
        let d2 = decreasingUnsafeCount(report.slice(1)) + 1
        output.push(`[${i1} ${i2} ${d1} ${d2}] ${report.join(' ')}`)
        if (i1 <= 1 || i2 <= 1 || d1 <= 1 || d2 <= 1) {
            safeCount++;
        }


    }
    fs.writeFileSync('./dist/day2.txt', output.join('\n'), 'utf-8')
    return safeCount;
}

console.log(puzzle2(false));