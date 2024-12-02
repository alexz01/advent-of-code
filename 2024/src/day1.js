const fs = require('fs');

/**
 * parse pair of numbers from a file and return them as individual list
 * @returns {number[][]}
 */
function parseInput(){
    let inputStr = fs.readFileSync('./inputs/day1.txt', 'utf-8');
    const locIds1 = []
    const locIds2 = [];
    let locPairStrs = inputStr.split('\n');
    for(let locPairStr of locPairStrs){
        let [loc1, loc2] = locPairStr.split('   ').map(s => parseInt(s));
        locIds1.push(loc1);
        locIds2.push(loc2);
    }
    return [locIds1, locIds2];
}

/**
 * puzzle 1
 * find the sum of dista
 * @returns {number}
 **/
function puzzle1() {
    const [locIds1, locIds2] = parseInput();

    locIds1.sort();
    locIds2.sort();
    let dist = 0;
    for(let i = 0; i < locIds1.length; i++){
        dist+= Math.abs(locIds1[i] - locIds2[i]);
    }
    return dist;
}

console.log(puzzle1())

function puzzle2(){
    const [locIds1, locIds2] = parseInput();
    let loc2Dict = {};
    for(let loc2 of locIds2){
        if(!loc2Dict[loc2]){
            loc2Dict[loc2] = 1
        }else{
            loc2Dict[loc2]++;
        }
    }

    let sum = 0
    for(let loc1 of locIds1){
        sum += loc1 * (loc2Dict[loc1] || 0)
    }

    return sum;
}
console.log(puzzle2()); //23963899