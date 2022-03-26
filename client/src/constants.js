// product IDs
export const controlSysId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI2OTY4ODA=';
export const controlSysId5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzM0ODg4MTY=';
export const controlSysId10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzM4MTY0OTY='
export const testBoardId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI2MzEzNDQ=';
export const testBoardId5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzQ1MDQ2MjQ=';
export const testBoardId10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzQ1NzAxNjA=';
export const univEwodChipId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI1OTg1NzY=';
export const univEwodChipId5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzU0NTQ4OTY=';
export const univEwodChipId10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzU1ODU5Njg=';

// product variant IDs
export const univEwodChipWithCoverPlate = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjgwNDc4NA==';
export const univEwodChipWithoutCoverPlate = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjgzNzU1Mg==';
export const univEwodChipWithCoverPlate5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUwOTY4Mjg2NA==';
export const univEwodChipWithoutCoverPlate5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUwOTcxNTYzMg==';
export const univEwodChipWithCoverPlate10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUxMDA3NjA4MA==';
export const univEwodChipWithoutCoverPlate10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUxMDEwODg0OA==';


export const productIds = [controlSysId, controlSysId5, controlSysId10, testBoardId, testBoardId5, testBoardId10, univEwodChipId, univEwodChipId5, univEwodChipId10];
export const productIdsJson = {
    'CONTROLSYSID': {
        '1': controlSysId,
        '5': controlSysId5,
        '10': controlSysId10,
    },
    'TESTBOARDID': {
        '1': testBoardId,
        '5': testBoardId5,
        '10': testBoardId10,
    },
    'UNIVEWODCHIPID': {
        '1': univEwodChipId,
        '5': univEwodChipId5,
        '10': univEwodChipId10,
    },
    'UNIVEWODCHIPWITHCOVERPLATE': {
        '1': univEwodChipWithCoverPlate,
        '5': univEwodChipWithCoverPlate5,
        '10': univEwodChipWithCoverPlate10,
    },
    'UNIVEWODCHIPWITHOUTCOVERPLATE': {
        '1': univEwodChipWithoutCoverPlate,
        '5': univEwodChipWithoutCoverPlate5,
        '10': univEwodChipWithoutCoverPlate10,
    }
}

export function getProductType(id) {
    switch (id) {
        case controlSysId:
        case controlSysId5:
        case controlSysId10:
            return 'CONTROLSYSID';
        case testBoardId:
        case testBoardId5:
        case testBoardId10:
            return 'TESTBOARDID';
        case univEwodChipId:
        case univEwodChipId5:
        case univEwodChipId10:
            return 'UNIVEWODCHIPID';
        default:
            return '';
    }
}

// chip IDs
export const ewodFabServiceId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI1NjU4MDg=';

// chip variant IDs
export const ewodFabServiceVariantId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjczOTI0OA==';
