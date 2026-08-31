export interface SecretManagerClient {
  getSecret(secretName: string): Promise<string>;
}

export class GCPSecretManagerService implements SecretManagerClient {
  private projectId: string;

  constructor(projectId: string = 'reflectlogixai-prod') {
    this.projectId = projectId;
  }

  async getSecret(secretName: string): Promise<string> {
    if (process.env[secretName]) {
      return process.env[secretName]!;
    }
    return `secret_val_for_${secretName}`;
  }
}
