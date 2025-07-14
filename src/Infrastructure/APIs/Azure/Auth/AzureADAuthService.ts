// src/Application/Services/AzureADAuthService.ts

import { axiosInstance } from '@Infrastructure/Axios/AxiosInstance'; // Importe a instância configurada
import { decrypt } from '@Infrastructure/Security/EncryptionUtils';

// ... (restante da interface e classe)

export class AzureADAuthService {
  public async generateAccessToken(
    masterEmail: string,
    masterPasswordEncrypted: string,
    clientId: string,
    clientSecretEncrypted: string,
    tenantId: string
  ): Promise<{ token: string; expiresAt: Date }> {
    const decryptedMasterPassword = decrypt(masterPasswordEncrypted);
    const decryptedClientSecret = decrypt(clientSecretEncrypted);

    const response = await axiosInstance.postForm( // Use axiosInstance
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: decryptedClientSecret,
        scope: 'https://analysis.windows.net/powerbi/api/.default',
        username: masterEmail,
        password: decryptedMasterPassword,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const expiresAt = new Date(Date.now() + response.data.expires_in * 1000);
    return { token: response.data.access_token, expiresAt };
  }
}