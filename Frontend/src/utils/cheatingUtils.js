export function getCheatingType(cheatingCode) {
    switch (cheatingCode) {
        case 1004:
            return 'Noise detected';
        case 1005:
            return 'Multi faces detected';
        case 1003:
            return 'Devtools detected';
        case 1000:
            return 'Copy detected';
        case 1001:
            return 'Screenshot detected';
        case 1002:
            return 'Tab change detected';
        default:
            return 'Unknown cheating type';
    }
}
