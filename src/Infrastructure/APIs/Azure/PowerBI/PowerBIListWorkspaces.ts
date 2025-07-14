import { axiosInstance } from "@Infrastructure/Axios/AxiosInstance";


export class PowerBIListWorkspaces {
  private readonly baseUrl = 'https://api.powerbi.com/v1.0/myorg';

    /**
     * Lista todos os workspaces (grupos) do Power BI acessíveis com o token fornecido.
     * @param azureADAccessToken O token de acesso do Azure AD.
     * @returns Uma lista de workspaces do Power BI.
     * @throws {AppError} Se a listagem de workspaces falhar.
     */
  async execute(azureADAccessToken: string) {
    const response = await axiosInstance.get(
      `${this.baseUrl}/groups`,
      {
        headers: {
          "Authorization": `Bearer ${azureADAccessToken}`
        }
      }
    )

    return response.data.value
  }
}

