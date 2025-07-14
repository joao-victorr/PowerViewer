

import { AppError } from 'Domain/Errors/AppErrors';
// src/Infrastructure/PowerBI/PowerBIApiClient.ts
import axios from 'axios';

interface PowerBIEmbedTokenResponse {
  token: string;
  tokenId: string;
  expiration: string; // ISO 8601 string
}

interface PowerBIWorkspace {
  id: string;
  name: string;
  isReadOnly: boolean;
  isOnDedicatedCapacity: boolean;
  type: string;
}

interface PowerBIReport {
  id: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  datasetId: string;
}

export class PowerBIApiClient {
  private readonly baseUrl = 'https://api.powerbi.com/v1.0/myorg';

  /**
   * Gera um Power BI Embed Token para um relatório específico.
   * @param groupId ID do Workspace (Grupo) do Power BI.
   * @param reportId ID do Relatório do Power BI.
   * @param azureADAccessToken O token de acesso do Azure AD.
   * @returns O Embed Token e sua data de expiração.
   * @throws {AppError} Se a geração do Embed Token falhar.
   */
  public async generateEmbedToken(
    groupId: string,
    reportId: string,
    azureADAccessToken: string
  ): Promise<{ token: string; expiresAt: Date }> {
    try {
      const response = await axios.post<PowerBIEmbedTokenResponse>(
        `${this.baseUrl}/groups/${groupId}/reports/${reportId}/GenerateToken`,
        {
          accessLevel: 'View', // Pode ser configurável se precisar de Edit/Create
        },
        {
          headers: {
            'Authorization': `Bearer ${azureADAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const expirationDate = new Date(response.data.expiration);
      return { token: response.data.token, expiresAt: expirationDate };
    } catch (error: any) {
      console.error('Erro ao gerar Power BI Embed Token:', error.response?.data || error.message);
      throw new AppError(`Falha ao gerar Embed Token do Power BI: ${error.response?.data?.error?.message || error.message}`, error.response?.status || 500);
    }
  }

  /**
   * Lista todos os relatórios em um workspace (grupo) específico do Power BI.
   * @param groupId ID do Workspace (Grupo) do Power BI.
   * @param azureADAccessToken O token de acesso do Azure AD.
   * @returns Uma lista de relatórios do Power BI.
   * @throws {AppError} Se a listagem de relatórios falhar.
   */
  public async listReportsInWorkspace(groupId: string, azureADAccessToken: string): Promise<PowerBIReport[]> {
    try {
      const response = await axios.get<{ value: PowerBIReport[] }>(
        `${this.baseUrl}/groups/${groupId}/reports`,
        {
          headers: {
            'Authorization': `Bearer ${azureADAccessToken}`,
          },
        }
      );
      return response.data.value;
    } catch (error: any) {
      console.error(`Erro ao listar relatórios no workspace ${groupId} do Power BI:`, error.response?.data || error.message);
      throw new AppError(`Falha ao listar relatórios do Power BI no workspace ${groupId}: ${error.response?.data?.error?.message || error.message}`, error.response?.status || 500);
    }
  }
}
