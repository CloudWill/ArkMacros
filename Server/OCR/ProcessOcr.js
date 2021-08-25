const path = require('path')
const { spawn } = require('child_process')

/**
 * Run python script, pass in `-u` to not buffer console output 
 * @return {ChildProcess}
 */
function runScript() {
    return spawn('python', [
        "-u",
        path.join(__dirname, 'TribeLogsOcr.py'),
        "--foo", "D:/OneDrive/Sorted/Programming/Python/Ark Farming/Backend/Mongo/OCR",
    ]);
}

const subprocess = runScript()

// print output of script
subprocess.stdout.on('data', (data) => {
    console.log(`data:${data}`);
});
subprocess.stderr.on('data', (data) => {
    console.log(`error:${data}`);
});
subprocess.on('close', () => {
    console.log("Closed");
});