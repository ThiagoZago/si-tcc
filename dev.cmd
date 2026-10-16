@echo off
setlocal
pushd "%~dp0" || (echo [FALHA] Nao foi possivel acessar a pasta do projeto: %~dp0 & pause & exit /b 1)
setlocal enabledelayedexpansion
title BarbApp - inicializacao

set "PAUSE_AT_END=0"
set "LAUNCHER=!cmdcmdline!"
if /i not "!LAUNCHER:%~nx0=!"=="!LAUNCHER!" set "PAUSE_AT_END=1"
for /f %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
set "OK=%ESC%[32m[OK]%ESC%[0m"
set "FAIL=%ESC%[31m[FALHA]%ESC%[0m"
set "WARN=%ESC%[33m[AVISO]%ESC%[0m"
set "PORT=3000"
set "URL=http://localhost:%PORT%"

echo.
echo === BarbApp: verificando o ambiente ===
where node >nul 2>&1 || (echo %FAIL% Node.js nao encontrado. Instale o Node.js 24 ou superior: https://nodejs.org & goto fail)
where npm >nul 2>&1 || (echo %FAIL% npm nao encontrado. Reinstale o Node.js 24 ou superior. & goto fail)
where curl >nul 2>&1 || (echo %FAIL% curl nao encontrado. Ele acompanha o Windows 10 1803 ou superior. & goto fail)
for /f "tokens=1 delims=." %%v in ('node -v') do set "NODE_MAJOR=%%v"
set "NODE_MAJOR=!NODE_MAJOR:v=!"
if !NODE_MAJOR! LSS 24 (
  echo %FAIL% Node.js !NODE_MAJOR! encontrado. O BarbApp precisa do Node.js 24 ou superior.
  goto fail
)
echo %OK% Node.js !NODE_MAJOR!, npm e curl disponiveis

echo.
echo === Configuracao ===
if not exist ".env.local" (
  copy /y ".env.example" ".env.local" >nul || (echo %FAIL% Nao foi possivel criar .env.local a partir de .env.example. & goto fail)
  echo %OK% .env.local criado a partir de .env.example
) else (
  echo %OK% .env.local encontrado
)
node -e "const v=require('fs').readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l.startsWith('APP_URL=')).map(l=>l.slice(8).trim().replace(/^['\x22]|['\x22]$/g,'')).filter(Boolean).map(s=>{try{return new URL(s).origin}catch{return s}});process.exit(v.length===0||v.includes(new URL('%URL%').origin)?0:1)" || (
  echo %WARN% APP_URL em .env.local aponta para outro endereco. Alteracoes de dados exigem que o navegador use o endereco de APP_URL.
)

echo.
echo === Dependencias ===
set "INSTALL=0"
if not exist "node_modules\.package-lock.json" set "INSTALL=1"
if "!INSTALL!"=="0" (
  node -e "const f=require('fs');process.exit(f.statSync('package-lock.json').mtimeMs>f.statSync('node_modules/.package-lock.json').mtimeMs?1:0)" || set "INSTALL=1"
)
set "RUNNING=0"
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  set "CODE="
  for /f %%c in ('curl -s -o nul -w "%%{http_code}" --max-time 10 %URL%/api/auth/me') do set "CODE=%%c"
  if not "!CODE!"=="200" (
    echo %FAIL% A porta %PORT% esta ocupada por outro programa. Encerre-o e execute dev.cmd novamente.
    goto fail
  )
  set "RUNNING=1"
)
if "!INSTALL!"=="0" (
  echo %OK% Dependencias atualizadas
) else if "!RUNNING!"=="1" (
  echo %WARN% Dependencias desatualizadas, mas o BarbApp ja esta rodando. Feche a janela do servidor e execute dev.cmd de novo para atualiza-las.
) else (
  echo Instalando dependencias com npm ci...
  call npm ci || (echo %FAIL% npm ci falhou. Veja as mensagens acima. & goto fail)
  echo %OK% Dependencias instaladas
)

echo.
echo === Servidor ===
if "!RUNNING!"=="1" (
  echo %OK% O BarbApp ja esta rodando em %URL%
  goto validate
)
start "BarbApp - servidor" cmd /k "npm run dev"
echo Aguardando o servidor responder em %URL% ...
set /a TRIES=0
:wait_server
set /a TRIES+=1
if !TRIES! GTR 120 (
  echo %FAIL% O servidor nao respondeu em 2 minutos. Veja a janela do servidor aberta pelo dev.cmd.
  goto fail
)
ping -n 2 127.0.0.1 >nul
set "CODE="
for /f %%c in ('curl -s -o nul -w "%%{http_code}" --max-time 60 %URL%/api/auth/me 2^>nul') do set "CODE=%%c"
if not "!CODE!"=="200" goto wait_server
echo %OK% Servidor respondendo

:validate
echo.
echo === Validando rotas ===
set "FAILED=0"
for %%r in (/ /agendar /acesso /ajuda /api/auth/me /api/businesses) do (
  set "CODE="
  for /f %%c in ('curl -s -o nul -w "%%{http_code}" --max-time 120 %URL%%%r') do set "CODE=%%c"
  if "!CODE!"=="200" (
    echo %OK% %%r
  ) else (
    echo %FAIL% %%r respondeu !CODE!
    set "FAILED=1"
  )
)
if "!FAILED!"=="1" (
  echo %FAIL% Algumas rotas falharam. Veja a janela do servidor aberta pelo dev.cmd.
  goto fail
)

echo.
echo === Abrindo o Chrome ===
set "CHROME=0"
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1 && set "CHROME=1"
reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1 && set "CHROME=1"
if "!CHROME!"=="1" (
  start "" chrome "%URL%"
  echo %OK% Chrome aberto em %URL%
) else (
  echo %WARN% Chrome nao encontrado. Abra %URL% manualmente.
)

echo.
echo %ESC%[32mBarbApp rodando em %URL%%ESC%[0m
node -e "const f=require('fs');const t=f.existsSync('.env.local')?f.readFileSync('.env.local','utf8'):'';const v={};for(const l of t.split(/\r?\n/)){const m=l.match(/^([A-Z_]+)=(.*)$/);if(m)v[m[1]]=m[2].trim().replace(/^['\x22]|['\x22]$/g,'')}const get=(k)=>process.env[k]||v[k]||'';const demo=get('ENABLE_DEMO')==='false'?'desativada':'ativada (Entrar, Conhecer o painel de demonstracao)';console.log('  Banco de dados: '+(get('DATABASE_PATH')||'./data/barbapp.sqlite'));console.log('  Demonstracao: '+demo)"
if "!RUNNING!"=="1" (
  echo   Para parar: encerre o servidor que ja estava rodando nesta porta.
) else (
  echo   Para parar: feche a janela do servidor aberta pelo dev.cmd ou pressione Ctrl+C nela.
)
echo.
if "!PAUSE_AT_END!"=="1" pause
popd
exit /b 0

:fail
echo.
if "!PAUSE_AT_END!"=="1" pause
popd
exit /b 1
