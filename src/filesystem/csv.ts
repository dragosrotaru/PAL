interface CSVRow {
  [key: string]: string | number | boolean;
}

export function parseCSV(csvText: string): CSVRow[] {
  const rows: CSVRow[] = [];
  const lines = csvText.split("\n");

  if (lines.length < 2) {
    console.error("CSV data must have at least a header and one row.");
    return rows;
  }

  const header = parseCSVLine(lines[0]);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue; // Skip empty lines

    const columns = parseCSVLine(line);

    if (columns.length !== header.length) {
      console.error(
        `Line ${i + 1} has a different number of columns than the header.`
      );
      continue;
    }

    const row: CSVRow = {};

    for (let j = 0; j < header.length; j++) {
      const value = columns[j];
      const key = header[j];
      row[key] = parseCSVValue(value);
    }

    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const columns: string[] = [];
  let current = "";
  let withinQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      withinQuotes = !withinQuotes;
    } else if (char === "," && !withinQuotes) {
      columns.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  columns.push(current.trim());
  return columns;
}

function parseCSVValue(value: string): string | number | boolean {
  if (!isNaN(Number(value))) {
    return parseFloat(value);
  } else if (value.toLowerCase() === "true") {
    return true;
  } else if (value.toLowerCase() === "false") {
    return false;
  } else {
    return value;
  }
}
