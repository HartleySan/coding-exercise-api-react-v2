<?php

    namespace App\Utils;

    class CsvUtils {
        // To-do: Chunk large files into smaller pieces?
        public static function getDataFromFilePath($filePath) {
            $fp = fopen($filePath, 'r');

            $data = [];
            $i = 0;

            if ($fp !== false) {
                while (($row = fgetcsv($fp)) !== false) {
                    $row = array_map(function ($val) {
                        return trim($val);
                    }, $row);

                    $data[] = $row;
                    $i++;
                }

                fclose($fp);
            }

            return $data;
        }

        public static function isValidCsvData($headers, $fileData) {
            // Make sure each row has the same number of values as there are headers.
            $numHeaders = count($headers);

            foreach ($fileData as $row) {
                if (count($row) !== $numHeaders) {
                    return false;
                }
            }

            // Any other CSV validation goes here.

            return true;
        }

        public static function mapDataToHeaders($headers, $fileData) {
            $mappedData = [];

            foreach ($fileData as $row) {
                $mappedRow = [];

                foreach ($row as $i => $val) {
                    $mappedRow[$headers[$i]] = $val;
                }

                $mappedData[] = $mappedRow;
            }

            return $mappedData;
        }
    }