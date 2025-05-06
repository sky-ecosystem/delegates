import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

// Define interfaces (adjust fields if delegate metadata differs)
interface DelegateMetadata {
  name?: string; // Example: Delegate name
  address?: string; // Example: Delegate address
  // Add other expected fields for delegates here
  [key: string]: any;
}

interface DelegateMetrics {
  combined_participation: string;
  poll_participation: string;
  exec_participation: string;
  communication: string;
  start_date: string;
}

interface IndexEntry {
  path: string;
  metadata: DelegateMetadata;
  metrics?: DelegateMetrics;
}

// Define the directory containing the delegate markdown files
const delegateDirectory = path.join(__dirname, '..');
// Define the output path for the index file
const indexFilePath = path.join(__dirname, '..', 'index.json');

async function generateDelegateIndex() {
  try {
    // Check if the directory exists
    if (!fs.existsSync(delegateDirectory)) {
      console.log(
        `Delegates directory not found: ${delegateDirectory}. Skipping generation.`,
      );
      return;
    }

    console.log(`Searching for markdown files in: ${delegateDirectory}`);
    // Find all .md files recursively
    const files = await glob('**/*.md', {
      cwd: delegateDirectory,
      ignore: ['**/README.md', 'meta/**', 'templates/**'],
    });

    if (files.length === 0) {
      console.log('No markdown files found in the delegates directory.');
      fs.writeFileSync(indexFilePath, JSON.stringify([], null, 2));
      return;
    }

    console.log(`Found ${files.length} files. Processing...`);

    const indexData: IndexEntry[] = [];

    for (const file of files) {
      const filePath = path.join(delegateDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(fileContent);
      const metadata = parsed.data as DelegateMetadata;

      const delegateFolderPath = path.dirname(filePath);
      const directoryContents = fs.readdirSync(delegateFolderPath, 'utf-8');
      const metricsFileName = 'metrics.json';

      let delegateMetrics: DelegateMetrics | undefined;

      // Construct the relative path from the repo root
      const relativePath = path.join(file);

      // If we find metrics, attach them to the index entry
      if (directoryContents.includes(metricsFileName)) {
        const metricsFilePath = path.join(delegateFolderPath, metricsFileName);
        const metricsFileContent = fs.readFileSync(metricsFilePath, 'utf-8');
        try {
          const metrics = JSON.parse(metricsFileContent);
          delegateMetrics = metrics;
        } catch (error) {
          if (error instanceof Error) {
            console.error(
              `Error parsing metrics file for ${relativePath}: ${error.message}`,
            );
          } else {
            console.error(
              `Error parsing metrics file for ${relativePath}: An unknown error occurred`,
            );
          }
        }
      }

      // Extract the directory name (potential address) from the relative path
      const dirName = path.basename(path.dirname(relativePath));

      // Check if the directory name looks like an address and add it to metadata
      if (dirName.startsWith('0x')) {
        metadata.address = dirName;
      }

      indexData.push({
        path: relativePath,
        metadata: metadata, // Metadata now includes the address if found
        ...{ metrics: delegateMetrics },
      });
    }

    // Sort the index data by path for consistency
    indexData.sort((a, b) => a.path.localeCompare(b.path));

    // Write the aggregated data to index.json
    fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2));

    console.log(
      `Successfully generated delegates index file at: ${indexFilePath}`,
    );
  } catch (error) {
    console.error('Error generating delegates index:', error);
    process.exit(1); // Exit with error code
  }
}

generateDelegateIndex();
