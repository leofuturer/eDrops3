// product IDs (first is production store, second is test store)
export const controlSysId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI2OTY4ODA=';
export const controlSysId5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzM0ODg4MTY=';
export const controlSysId10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzM4MTY0OTY=';
export const testBoardId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI2MzEzNDQ=';
export const testBoardId5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzQ1MDQ2MjQ=';
export const testBoardId10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNDA3NzQ1NzAxNjA=';
export const pcbChipId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcxODgyMjMzNjEyMDA=';
export const pcbChipId5 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcxODgyMjQzNzcwMDg=';
export const pcbChipId10 = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcxODgyMjQ0MDk3NzY=';
/* Note PCB chip ID same as universal EWOD chip ID for test store only as product is only on production store  */

// chip IDs
export const ewodFabServiceId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTE4ODI1NjU4MDg=';

// chip variant IDs
export const ewodFabServiceVariantId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTIzMzA5MjczOTI0OA==';

export const productIds = [controlSysId, controlSysId5, controlSysId10, testBoardId, testBoardId5, testBoardId10]
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
    case pcbChipId:
    case pcbChipId5:
    case pcbChipId10:
      return 'PCBCHIPID';
    default:
      return '';
  }
}
