package com.dtu.proexam.util;

import java.util.UUID;

public final class GlobalUtil {

    private GlobalUtil() {
    }

    public static String getUUID() {
        UUID  uuid = UUID.randomUUID();
        return uuid.toString();
    }
    
}
