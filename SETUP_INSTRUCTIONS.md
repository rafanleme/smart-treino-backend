# Configuração Rápida do MySQL para SmartTreino

## Opção 1: Via MySQL Workbench (Recomendado)

1. Abra o **MySQL Workbench**
2. Conecte-se como `root` (use a senha que você definiu na instalação)
3. Execute os comandos abaixo em uma nova Query:

```sql
-- Criar database
CREATE DATABASE IF NOT EXISTS smarttreino_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Criar usuário
CREATE USER IF NOT EXISTS 'smarttreino'@'localhost' IDENTIFIED BY 'smarttreino123';

-- Dar permissões
GRANT ALL PRIVILEGES ON smarttreino_dev.* TO 'smarttreino'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SELECT 'Database criado com sucesso!' AS status;
```

## Opção 2: Via Command Line

Abra o terminal (CMD ou PowerShell) e execute:

```bash
# Encontre o mysql.exe (geralmente em C:\Program Files\MySQL\MySQL Server 8.0\bin\)
# Adicione ao PATH ou use o caminho completo

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p

# Depois digite a senha do root
# Então execute os comandos SQL acima
```

## Opção 3: Usar Root no .env (temporário)

Se preferir, posso configurar o .env para usar o usuário `root` temporariamente.
Você teria que me informar a senha do root.

---

## Após executar o SQL acima, volte aqui e eu continuo o setup!
