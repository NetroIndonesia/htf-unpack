# htf-rttex-unpacker

## Description

htf-rttex-unpacker is a simple Node.js script designed to extract PNG images from RTTEX files within a directory. This script is particularly useful when you have RTTEX files that need to be decompressed into individual PNG images.

## Usage

1. Ensure you have Node.js installed on your computer.
2. Download or clone this repository to your local machine.
3. Open a terminal or command prompt.
4. Navigate to the project directory.
5. Ensure that your directory structure matches the expected layout for the script. For instance, the `cache` directory should contain the RTTEX files you wish to unpack, and the `cache2` directory will hold the output of the unpacking process.
6. Run the command `npm install` to install the necessary dependencies.
7. Execute the script by running `node htf_unpack.js`. This will initiate the unpacking process, with the output displayed in the terminal.
8. Once the process is complete, you'll find the resulting PNG images in the `cache2` directory.
