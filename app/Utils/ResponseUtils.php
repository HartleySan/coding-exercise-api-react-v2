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

        public static function success($msg = null, $code = 200) {
            return response()->json([
                'success' => true,
                'msg' => $msg
            ], $code);
        }
    }