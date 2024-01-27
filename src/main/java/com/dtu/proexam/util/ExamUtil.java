package com.dtu.proexam.util;

import java.util.Random;

public final class ExamUtil {
    
    private ExamUtil() {
    }

    public static int getKeyCode() {
        Random random = new Random();
        int randomNumber = random.nextInt(900000) + 100000;
        return randomNumber;
    }
}
