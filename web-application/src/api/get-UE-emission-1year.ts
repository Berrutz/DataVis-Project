import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Specify the path to your CSV file
        const filePath = path.join(process.cwd(), "/DataVis-Project/datasets/co-emissions-per-capita.csv");
        console.log(process.env.DATASETS);

        // Read the CSV file content
        const fileContents = await fs.readFile(filePath, 'utf-8');

        // Parse the CSV content into a JSON format
        const records = parse(fileContents, {
            columns: true, // Use the first row as column headers
            skip_empty_lines: true,
        });

        // Return the parsed data as JSON
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read and parse CSV file' });
    }
}