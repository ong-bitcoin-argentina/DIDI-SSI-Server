const {
  sendDIDandDNI, shareData, validateDni,
  generateValidation, updateValidationState, deleteValidationByDid, getValidation,
} = require('../../services/SemillasService');
const {
  missingData, missingDid, missingDni, missingState,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
 *  Dados dni y did, solicita las credenciales a semillas
 */
  test('Expect sendDIDandDNI to throw on missing dni', async () => {
    try {
      await sendDIDandDNI({ dni: undefined, did: 'did' });
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect sendDIDandDNI to throw on missing did', async () => {
    try {
      await sendDIDandDNI({ dni: 'dni', did: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
 *  Usuario comparte sus credenciales al prestador para solicitar su servicio
 */
  test('Expect shareData to throw on missing data', async () => {
    try {
      await shareData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  /**
 *  Validación de dni
 */
  test('Expect validateDni to throw on missing data', async () => {
    try {
      await validateDni(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  /**
 *  Genera nueva validación
 */
  test('Expect generateValidation to throw on missing did', async () => {
    try {
      await generateValidation(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
 *  Actualización del estado de la solicitud de validación de identidad
 */
  test('Expect updateValidationState to throw on missing did', async () => {
    try {
      await updateValidationState(undefined, 'state');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect updateValidationState to throw on missing state', async () => {
    try {
      await updateValidationState('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingState.code);
    }
  });
  /**
 *  Elimina una solicitud de validación de identidad desde semillas
 */
  test('Expect deleteValidationByDid to throw on missing did', async () => {
    try {
      await deleteValidationByDid(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
  /**
 *  Obtiene el estado de validación de identidad desde semillas
 */
  test('Expect getValidation to throw on missing did', async () => {
    try {
      await getValidation(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
