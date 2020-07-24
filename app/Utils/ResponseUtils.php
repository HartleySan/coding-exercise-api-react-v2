<?php

    namespace App\Utils;

    class ResponseUtils {
        // To-do: Figure out the best 400-level errors to return for various situations.
        public static function error($msg, $code = 400) {
            return response()->json([
                'error' => true,
                'msg' => $msg
            ], $code);
        }
    }