#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const pdf = require('pdf-parse');
const { bijoyToUnicode } = require('./converter');

const SPLIT_CHARACTER_LIMIT = 271095;

function splitTextSmartly(text, limit) {
    if (text.length <= limit) {
        return [text];
    }
    const chunks = [];
    let currentIndex = 0;
    while (currentIndex < text.length) {
        if (text.length - currentIndex <= limit) {
            chunks.push(text.substring(currentIndex));
            break;
        }
        let splitIndex = currentIndex + limit;
        let breakPoint = text.lastIndexOf('\n', splitIndex);
        if (breakPoint <= currentIndex) {
            breakPoint = text.lastIndexOf(' ', splitIndex);
        }
        if (breakPoint <= currentIndex) {
            breakPoint = splitIndex;
        }
        chunks.push(text.substring(currentIndex, breakPoint).trim());
        currentIndex = breakPoint + 1;
    }
    return chunks;
}

function cleanPdfText(text) {
    return text.replace(/<[^>]*>/g, '');
}

yargs(hideBin(process.argv))
  .command(
    'ansi2uni <inputFile> [outputFile]',
    'Convert Bijoy (ANSI) text from a PDF to Unicode text.',
    () => {},
    async (argv) => {
      try {
        const baseOutputFile =
          argv.outputFile ||
          path.join(
            path.dirname(argv.inputFile),
            `${path.basename(argv.inputFile, path.extname(argv.inputFile))}.txt`
          );

        console.log(`Reading PDF: ${argv.inputFile}`);
        const dataBuffer = await fs.readFile(argv.inputFile);
        const data = await pdf(dataBuffer);

        console.log('Cleaning up extracted text...');
        const cleanedText = cleanPdfText(data.text);

        console.log('Converting text to Unicode...');
        const unicodeText = bijoyToUnicode(cleanedText);
        
        const textChunks = splitTextSmartly(unicodeText, SPLIT_CHARACTER_LIMIT);

        if (textChunks.length === 1) {
            await fs.writeFile(baseOutputFile, textChunks[0], 'utf8');
            console.log(`\nSuccessfully converted to Unicode and saved to: ${baseOutputFile}`);
        } else {
            console.log(`\nText is large. Splitting into ${textChunks.length} parts...`);
            const outputInfo = path.parse(baseOutputFile);
            for (let i = 0; i < textChunks.length; i++) {
                const partPath = path.join(
                    outputInfo.dir,
                    `${outputInfo.name}_${i + 1}${outputInfo.ext}`
                );
                await fs.writeFile(partPath, textChunks[i], 'utf8');
                console.log(`Saved: ${partPath}`);
            }
            console.log("\nConversion and splitting complete!");
        }
      } catch (error) {
        console.error(`\nError: Could not process the file. ${error.message}`);
      }
    }
  )
  .demandCommand(1, 'You must provide a command. Use "ansi2uni" for conversion.')
  .alias('h', 'help')
  .help().argv;