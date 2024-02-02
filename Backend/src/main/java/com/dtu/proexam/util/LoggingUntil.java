package com.dtu.proexam.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggingUntil {
    Logger logger = LoggerFactory.getLogger(LoggingUntil.class);

    public void info(String TAG, String message) {
        logger.info(TAG + ": " + message);
    }

    public void error(String TAG, String message) {
        logger.error(TAG + ": " + message);
    }

    public void warn(String TAG, String message) {
        logger.warn(TAG + ": " + message);
    }

    public void debug(String TAG, String message) {
        logger.debug(TAG + ": " + message);
    }

    public void trace(String TAG, String message) {
        logger.trace(TAG + ": " + message);
    }
}
