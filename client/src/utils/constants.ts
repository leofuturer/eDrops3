// import { request } from './api/api';
// import { getApiToken } from './api/serverConfig';

let mode = true; // true for production, false for development

// product IDs (first is production store, second is test store)
export const controlSysId = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI2OTY4ODA=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1OTU3Njc0NDM0OTA=';
export const controlSysId5 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzM0ODg4MTY=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ2NzEwMTA=';
export const controlSysId10 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzM4MTY0OTY=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ2MzgyNDI=';
export const testBoardId = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI2MzEzNDQ=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1OTU3NjgwOTg4NTA=';
export const testBoardId5 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzQ1MDQ2MjQ=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ2MDU0NzQ=';
export const testBoardId10 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzQ1NzAxNjA=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ1NzI3MDY=';
export const univEwodChipId = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI1OTg1NzY=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1OTk0ODUwMzg2MjY=';
export const univEwodChipId5 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzU0NTQ4OTY=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ3MzY1NDY=';
export const univEwodChipId10 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzU1ODU5Njg=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ3MDM3Nzg=';
export const pcbChipId = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcxODgyMjMzNjEyMDA=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1OTk0ODUwMzg2MjY=';
export const pcbChipId5 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcxODgyMjQzNzcwMDg=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ3MzY1NDY=';
export const pcbChipId10 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcxODgyMjQ0MDk3NzY=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY5ODA1MjQ3MDM3Nzg=';
/* Note PCB chip ID same as universal EWOD chip ID for test store only as product is only on production store  */

// product variant IDs (first is production store, second is test store)
export const univEwodChipWithCoverPlate = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjgwNDc4NA==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjIzMDM1NzQ5OTkzOA==';
export const univEwodChipWithoutCoverPlate = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjgzNzU1Mg==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjI0NDg1Njg4MTE4Ng==';
export const univEwodChipWithCoverPlate5 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUwOTY4Mjg2NA==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDMyNzk1MTM4NDYxMA====';
export const univEwodChipWithoutCoverPlate5 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUwOTcxNTYzMg==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDMyNzk1MTQxNzM3OA==';
export const univEwodChipWithCoverPlate10 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUxMDA3NjA4MA==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDMyNzk1MTMxOTA3NA==';
export const univEwodChipWithoutCoverPlate10 = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTM2NjUxMDEwODg0OA==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDMyNzk1MTM1MTg0Mg==';

// chip IDs
export const ewodFabServiceId = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI1NjU4MDg=' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ2MjI1Nzc4Mjc4NzQ=';

// chip variant IDs
export const ewodFabServiceVariantId = mode ? 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjczOTI0OA==' : 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjMwMjU0ODA1ODE0Ng==';

export const productIds = [controlSysId, controlSysId5, controlSysId10, testBoardId, testBoardId5, testBoardId10, univEwodChipId, univEwodChipId5, univEwodChipId10];
export const productIdsJson = {
  CONTROLSYSID: {
    1: controlSysId,
    5: controlSysId5,
    10: controlSysId10,
  },
  TESTBOARDID: {
    1: testBoardId,
    5: testBoardId5,
    10: testBoardId10,
  },
  UNIVEWODCHIPID: {
    1: univEwodChipId,
    5: univEwodChipId5,
    10: univEwodChipId10,
  },
  UNIVEWODCHIPWITHCOVERPLATE: {
    1: univEwodChipWithCoverPlate,
    5: univEwodChipWithCoverPlate5,
    10: univEwodChipWithCoverPlate10,
  },
  UNIVEWODCHIPWITHOUTCOVERPLATE: {
    1: univEwodChipWithoutCoverPlate,
    5: univEwodChipWithoutCoverPlate5,
    10: univEwodChipWithoutCoverPlate10,
  },
  PCBCHIPID: {
    1: pcbChipId,
    5: pcbChipId5,
    10: pcbChipId10,
  },
};

export function getProductType(id: string) {
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
    case pcbChipId:
    case pcbChipId5:
    case pcbChipId10:
      return 'PCBCHIPID';
    default:
      return '';
  }
}
