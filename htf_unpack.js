const htf_fs = require('fs');
const htf_path = require('path');
const htf_sharp = require('sharp');
const htf_zlib = require('zlib');
const { promisify } = require('util');

const htf_readdir = promisify(htf_fs.readdir);
const htf_stat = promisify(htf_fs.stat);
const htf_readFile = promisify(htf_fs.readFile);
const htf_writeFile = promisify(htf_fs.writeFile);
const htf_mkdir = promisify(htf_fs.mkdir);

async function htf_RTTEXUnpack(inputDir, outputDir) {
    try {
        const htf_files = await htf_getFiles(inputDir);
        for (const htf_file of htf_files) {
            const fullPath = htf_path.join(inputDir, htf_file);
            const stats = await htf_stat(fullPath);
            if (stats.isDirectory()) {
              
                const relativePath = htf_path.relative(inputDir, fullPath);
                await htf_mkdir(htf_path.join(outputDir, relativePath), { recursive: true });
                await htf_RTTEXUnpack(fullPath, outputDir); 
            } else {
                const relativePath = htf_path.relative(inputDir, fullPath);
                const outputFilePath = htf_path.join(outputDir, relativePath);
                const outputDirPath = htf_path.dirname(outputFilePath);
                await htf_mkdir(outputDirPath, { recursive: true });

                const unpackedData = await htf_processFile(fullPath);
                if (unpackedData) {
                    const outputFileName = htf_path.basename(htf_file, htf_path.extname(htf_file)) + '.png';
                    const outputFile = htf_path.join(outputDirPath, outputFileName);
                    await htf_writeFile(outputFile, unpackedData);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function htf_getFiles(dir) {
    const htf_files = await htf_readdir(dir);
    return htf_files.filter(htf_file => !htf_file.startsWith('.'));
}

async function htf_processFile(filePath) {
    try {
        let data = await htf_readFile(filePath);
        if (data.slice(0, 6).toString() === "RTPACK") {
            data = htf_zlib.inflateSync(data.slice(32));
        }
        if (data.slice(0, 6).toString() === "RTTXTR") {
            const imageData = await htf_sharp(data.slice(0x7c), {
                raw: {
                    width: data.readInt32LE(12),
                    height: data.readInt32LE(8),
                    channels: 3 + data[0x1c]
                }
            }).flip(true).toFormat("png").toBuffer();
            return imageData;
        } else {
            console.log("This is not a RTTEX file:", filePath);
            return null;
        }
    } catch (error) {
        console.error('Error processing file:', filePath, error);
        return null;
    }
}

async function htf_main() {
    const htf_inputDirectory = './cache'; // Input directory
    const htf_outputDirectory = './cache2'; // Output directory
    try {
        await htf_mkdir(htf_outputDirectory, { recursive: true });
        await htf_RTTEXUnpack(htf_inputDirectory, htf_outputDirectory);
        console.log('Processing complete.');
    } catch (error) {
        console.error('Error:', error);
    }
}

htf_main();
