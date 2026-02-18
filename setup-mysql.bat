@echo off
echo ========================================
echo SmartTreino - MySQL Setup
echo ========================================
echo.
echo Este script vai:
echo 1. Criar o database smarttreino_dev
echo 2. Criar usuario smarttreino com senha smarttreino123
echo 3. Conceder permissoes
echo.
echo Voce precisara informar a senha do root do MySQL
echo.
pause

echo.
echo Executando script SQL...
mysql -u root -p < setup-database.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Nao foi possivel conectar ao MySQL
    echo.
    echo Verifique se:
    echo - O MySQL esta instalado e rodando
    echo - Voce informou a senha correta do root
    echo - O servico MySQL esta ativo (services.msc)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database configurado com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo 1. npx prisma db push (aplicar schema)
echo 2. npm run seed (popular dados)
echo 3. npm run dev (iniciar servidor)
echo.
pause
