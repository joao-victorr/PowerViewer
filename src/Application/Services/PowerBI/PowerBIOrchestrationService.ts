
import { repo } from '@Databases/PrismaClient';
import type { PowerBIApiClient } from '@Infrastructure/APIs/Azure/PowerBI/PowerBIApiClient';
import { AppError, NotFoundError } from 'Domain/Errors/AppErrors';
import type { Prisma } from '@prisma/client';
import type { AzureADAuthService } from '../../../Infrastructure/APIs/Azure/Auth/AzureADAuthService';

// Interfaces de retorno (podem ser movidas para um arquivo DTO se forem usadas em controladores)
interface PowerBIWorkspaceDTO {
  id: string;
  name: string;
}

interface PowerBIReportDTO {
  id: string;
  name: string;
  embedUrl: string;
}

export class PowerBIIntegrationService {
  private azureADAuthService: AzureADAuthService;
  private powerBIApiClient: PowerBIApiClient;

  constructor(
    azureADAuthService: AzureADAuthService,
    powerBIApiClient: PowerBIApiClient
  ) {
    this.azureADAuthService = azureADAuthService;
    this.powerBIApiClient = powerBIApiClient;
  }


  /**
   * Garante que o Azure AD Access Token para a Enterprise está válido e atualizado no banco.
   * Se o token estiver expirado ou ausente, gera um novo.
   * @param enterprise A entidade Enterprise com as credenciais Power BI.
   * @returns O token de acesso válido do Azure AD.
   * @throws {AppError} Se as credenciais estiverem incompletas ou a geração do token falhar.
   */
  private async ensureAzureADAccessToken(
    enterprise: Prisma.EnterpriseGetPayload<{}> // Use o tipo gerado pelo Prisma
  ): Promise<string> {
    const now = new Date();

    if (!enterprise.pbMasterEmail || !enterprise.pbMasterPasswordEncrypted || !enterprise.pbClientId || !enterprise.pbClientSecretEncrypted || !enterprise.pbTenantId) {
      throw new AppError('Credenciais Power BI Master incompletas para a empresa. Por favor, configure-as.', 400);
    }

    let currentAzureADAccessToken = enterprise.pbAccessToken;
    let currentAzureADAccessTokenExpiresAt = enterprise.pbAccessTokenExpiresAt;

    if (!currentAzureADAccessToken || !currentAzureADAccessTokenExpiresAt || currentAzureADAccessTokenExpiresAt <= now) {
      console.log(`[Enterprise: ${enterprise.id}] Renovando Azure AD Access Token...`);
      const { token, expiresAt } = await this.azureADAuthService.generateAccessToken(
        enterprise.pbMasterEmail,
        enterprise.pbMasterPasswordEncrypted,
        enterprise.pbClientId,
        enterprise.pbClientSecretEncrypted,
        enterprise.pbTenantId
      );

      currentAzureADAccessToken = token;
      currentAzureADAccessTokenExpiresAt = expiresAt;

      await repo.enterprise.update({
        where: { id: enterprise.id },
        data: {
          pbAccessToken: currentAzureADAccessToken,
          pbAccessTokenExpiresAt: currentAzureADAccessTokenExpiresAt,
        },
      });
      console.log(`[Enterprise: ${enterprise.id}] Azure AD Access Token renovado.`);
    }

    return currentAzureADAccessToken; // '!' para garantir que não é null aqui
  }

  /**
   * Obtém a configuração de incorporação (embed URL e token) para um relatório Power BI específico.
   * Gerencia o cache do Azure AD Access Token e do Power BI Embed Token.
   * @param enterpriseId ID da empresa.
   * @param powerBIReportConfigId ID da configuração do relatório Power BI.
   * @returns Objeto com embedUrl, accessToken e reportId.
   * @throws {NotFoundError} Se a empresa ou a configuração do relatório não forem encontradas.
   * @throws {AppError} Se houver falha na autenticação ou geração de token.
   */
  public async getEmbedConfig(
    enterpriseId: string,
    powerBIReportConfigId: string
  ): Promise<{ embedUrl: string; accessToken: string; reportId: string }> {
    const enterprise = await repo.enterprise.findUnique({
      where: { id: enterpriseId },
      include: {
        powerBIReportConfigs: {
          where: { id: powerBIReportConfigId }
        }
      }
    });

    if (!enterprise) {
      throw new NotFoundError('Empresa não encontrada.');
    }
    if (!enterprise.powerBIReportConfigs || enterprise.powerBIReportConfigs.length === 0) {
      throw new NotFoundError('Configuração de relatório Power BI não encontrada para esta empresa.');
    }

    const reportConfig = enterprise.powerBIReportConfigs[0];
    const now = new Date();

    // Garante um Azure AD Access Token válido
    const azureADAccessToken = await this.ensureAzureADAccessToken(enterprise);

    // 2. Verifica e renova o Power BI Embed Token se expirado ou ausente
    let currentEmbedToken = reportConfig.pbEmbedToken;
    let currentEmbedTokenExpiresAt = reportConfig.pbEmbedTokenExpiresAt;

    if (!currentEmbedToken || !currentEmbedTokenExpiresAt || currentEmbedTokenExpiresAt <= now) {
      console.log(`[Enterprise: ${enterprise.id}, Report: ${reportConfig.powerBIReportId}] Renovando Power BI Embed Token...`);
      
      const { token, expiresAt } = await this.powerBIApiClient.generateEmbedToken(
        reportConfig.powerBIGroupId,
        reportConfig.powerBIReportId,
        azureADAccessToken // Usa o access token (renovado ou existente)
      );

      currentEmbedToken = token;
      currentEmbedTokenExpiresAt = expiresAt;

      await repo.powerBIReportConfig.update({
        where: { id: reportConfig.id },
        data: {
          pbEmbedToken: currentEmbedToken,
          pbEmbedTokenExpiresAt: currentEmbedTokenExpiresAt,
        },
      });
      console.log(`[Enterprise: ${enterprise.id}, Report: ${reportConfig.powerBIReportId}] Power BI Embed Token renovado.`);
    }

    return {
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportConfig.powerBIReportId}&groupId=${reportConfig.powerBIGroupId}`,
      accessToken: currentEmbedToken,
      reportId: reportConfig.powerBIReportId,
    };
  }

  /**
   * Lista os workspaces (grupos) do Power BI para uma Enterprise.
   * Gerencia o cache do Azure AD Access Token.
   * @param enterpriseId ID da empresa.
   * @returns Uma lista de workspaces do Power BI.
   * @throws {NotFoundError} Se a empresa não for encontrada.
   * @throws {AppError} Se houver falha na autenticação ou listagem.
   */
  public async listWorkspaces(enterpriseId: string): Promise<PowerBIWorkspaceDTO[]> {
    const enterprise = await repo.enterprise.findUnique({
      where: { id: enterpriseId },
    });

    if (!enterprise) {
      throw new NotFoundError('Empresa não encontrada.');
    }

    const azureADAccessToken = await this.ensureAzureADAccessToken(enterprise);

    const workspaces = await this.powerBIApiClient.listWorkspaces(azureADAccessToken);
    
    // Mapeia para um DTO de retorno mais simples, se necessário
    return workspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      // Inclua outras propriedades se precisar
    }));
  }

  /**
   * Lista os relatórios em um workspace específico do Power BI para uma Enterprise.
   * Gerencia o cache do Azure AD Access Token.
   * @param enterpriseId ID da empresa.
   * @param groupId ID do Workspace (Grupo) do Power BI.
   * @returns Uma lista de relatórios do Power BI.
   * @throws {NotFoundError} Se a empresa não for encontrada.
   * @throws {AppError} Se houver falha na autenticação ou listagem.
   */
  public async listReportsInWorkspace(enterpriseId: string, groupId: string): Promise<PowerBIReportDTO[]> {
    const enterprise = await repo.enterprise.findUnique({
      where: { id: enterpriseId },
    });

    if (!enterprise) {
      throw new NotFoundError('Empresa não encontrada.');
    }

    const azureADAccessToken = await this.ensureAzureADAccessToken(enterprise);

    const reports = await this.powerBIApiClient.listReportsInWorkspace(groupId, azureADAccessToken);

    // Mapeia para um DTO de retorno mais simples, se necessário
    return reports.map(r => ({
      id: r.id,
      name: r.name,
      embedUrl: r.embedUrl,
      // Inclua outras propriedades se precisar
    }));
  }
}
