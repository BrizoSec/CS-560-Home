// built some fns to pull data out of csv and parse it into headres, actual data

async function loadReferenceData() {
    try {
        // REF:
        //     - using Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
        // ---> async/await:
        const res = await fetch('data/merged_malware_data.csv');
        const resTextContent = await res.text();

        // parse
        return parse(resTextContent);

        // return ;

    } catch (error) {
        //
        console.error('Error:', error);
        return [];
    }
}







function parse(base) {
    const lines = base.trim().split('\n'); // split by newline

    // split header and data - trim to remove \r and whitespace
    const hdrs = lines[0].split(',').map(h => h.trim()); // trim to get rid of \r in files
    const rv = []; // retunr value

    // split each line by , as it is csv input
    for (let i = 1; i < lines.length; i++) {
        const lineVals = lines[i].split(',');
        const _rw = {};

        // parse row
        hdrs.forEach((header, idx) => {
            const rwVal = lineVals[idx] ? lineVals[idx].trim() : '';


            // convert decimals if number
            _rw[header] = isNaN(rwVal) ? rwVal : parseFloat(rwVal);
        });

        rv.push(_rw);
    }

    return rv;
}







// need to split malware data to calculate average network bytes
// REF: Grouping with reduce() ->
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

function splitDataByMalwareType(inputData) {

    return inputData.reduce((rv_buckets, item) => {
        // console.log(item)
        const _cat = item.Category; // get malware category column (fileInfector, Ransomware)

        // initialize category if it doesnt yet xist in return value
        if (!rv_buckets[_cat]) {
            rv_buckets[_cat] = [];
        }

        // else split into the according bucket
        rv_buckets[_cat].push(item);

        return rv_buckets;

    }, {});
}





