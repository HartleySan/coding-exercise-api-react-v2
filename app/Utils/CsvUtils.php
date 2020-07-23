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
    }