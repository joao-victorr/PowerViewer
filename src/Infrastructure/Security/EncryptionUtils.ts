

/*
Para criptografar a senha do usuário master do Power BI e o Client Secret do Azure AD (que precisam ser descriptografados para uso), usaremos o módulo `crypto` do Node.js com AES-256. Para a senha do seu `User` (a senha de login do seu SaaS), continuaremos com `bcryptjs`.

Crie o arquivo: `src/Infrastructure/Security/EncryptionUtils.ts`

typescript

*/

import * as crypto from 'node:crypto';
// src/Infrastructure/Security/EncryptionUtils.ts
import * as bcrypt from 'bcrypt';

// --- Bcrypt para Hashing de Senhas (para senhas de usuários do seu SaaS) ---
const SALT_ROUNDS = 10; // Valor recomendado para bcrypt

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- AES-256 para Criptografia Simétrica (para Senha Master Power BI e Client Secret) ---
// IMPORTANTE: Esta chave DEVE ser uma string de 32 bytes (256 bits) para AES-256.
// Armazene-a de forma SEGURA nas suas variáveis de ambiente.
// Exemplo de geração de uma chave aleatória de 32 bytes (64 caracteres hexadecimais):
// crypto.randomBytes(32).toString('hex');
// Certifique-se de que a variável de ambiente ENCRYPTION_KEY está definida.
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || 'a_very_strong_32_byte_key_for_aes256!', 'utf8');
const IV_LENGTH = 16; // Para AES, o IV (Initialization Vector) é sempre 16 bytes

// Verificação simples para garantir o tamanho correto da chave
if (ENCRYPTION_KEY.length !== 32) {
  console.warn('AVISO: ENCRYPTION_KEY não tem 32 bytes. Por favor, gere uma chave forte de 32 bytes e defina-a nas suas variáveis de ambiente para produção.');
  // Em um ambiente de produção, isso deveria ser um erro fatal ou uma validação mais robusta.
  // Para desenvolvimento, podemos prosseguir com o aviso.
}

/**
 * Criptografa um texto usando AES-256-CBC.
 * O IV (Initialization Vector) é gerado aleatoriamente e prefixado ao texto criptografado.
 * @param text O texto a ser criptografado.
 * @returns Uma string no formato 'ivHex:encryptedTextHex'.
**/
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Armazena o IV com o texto criptografado
}

/**
 * Descriptografa um texto que foi criptografado com a função `encrypt`.
 * @param text A string criptografada no formato 'ivHex:encryptedTextHex'.
 * @returns O texto descriptografado.
 * @throws {Error} Se o formato da string criptografada for inválido.
**/
export function decrypt(text: string): string {
  const textParts = text.split(':');
  if (textParts.length !== 2) {
    throw new Error('Formato de texto criptografado inválido. Esperado "ivHex:encryptedTextHex".');
  }
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = textParts[1];
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/*
**Instalação de Dependências:**

Você precisará instalar as bibliotecas `axios` e `bcryptjs`:

```bash
npm install axios bcryptjs
# ou
yarn add axios bcryptjs
```

**Variáveis de Ambiente:**

Não se esqueça de adicionar `ENCRYPTION_KEY` ao seu arquivo `.env` (ou configurá-lo no seu ambiente de produção).
Exemplo no `.env`:
`ENCRYPTION_KEY=sua_chave_secreta_de_32_bytes_aqui_gerada_aleatoriamente`

*/