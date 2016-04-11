@echo off

set CURRENT_DIR=%CD%
set APP_DIR=%CURRENT_DIR%\..
set LIB_DIR=%CURRENT_DIR%\..\lib

set SERVICE_NAME=HKTService
set MYSQL_URL="jdbc:mysql://localhost:3306/hktdb?createDatabaseIfNotExist=true&useUnicode=yes&characterEncoding=utf8"
set MYSQLDB_OPTS=^
 ++JvmOptions=-Djdbc.driver=org.gjt.mm.mysql.Driver^
 ++JvmOptions=-Djdbc.url=%MYSQL_URL%^
 ++JvmOptions=-Djdbc.user=hkt -Djdbc.password=hkt^
 ++JvmOptions=-Dhibernate.dialect=org.hibernate.dialect.MySQL5Dialect

set DB_OPTS=%HSQLDB_OPTS%



set PRUNSRV=%CURRENT_DIR%\win64\prunsrv.exe

set DB_OPTS=%HSQLDB_OPTS%

set COMMAND=unknown

:parse
  IF NOT "%1"=="" (
    IF "%1"=="-win64" (
      set PRUNSRV=%CURRENT_DIR%\win64\prunsrv.exe
    )
    IF "%1"=="-win32" (
      set PRUNSRV=%CURRENT_DIR%\win32\prunsrv.exe
    )
    IF "%1"=="install" (
      set COMMAND=install
    )
    IF "%1"=="remove" (
      set COMMAND=remove
    )
    IF "%1"=="start" (
      set COMMAND=start
    )
    IF "%1"=="stop" (
      set COMMAND=stop
    )
    IF "%1"=="run" (
      set COMMAND=run
    )
    SHIFT
    goto :parse
  )

IF "%COMMAND%"=="install" (
  echo Install %SERVICE_NAME%
  %PRUNSRV% //IS//%SERVICE_NAME% --DisplayName="HKTService"^
            --Description="HKT ERP Service" ^
            --Install=%PRUNSRV% --Jvm=auto --StartMode=jvm --StopMode=jvm^
            --StartClass=com.hkt.server.DeamonServer --StartMethod=main --StartParams=start^
            --StopClass=com.hkt.server.DeamonServer --StopMethod=main --StopParams=stop^
            ++JvmOptions=-Djava.ext.dirs=%LIB_DIR% ++JvmOptions=-Dapp.dir=%APP_DIR% ^
            --StartPath=%CURRENT_DIR% ^
            --LogPath=%CURRENT_DIR%\logs --LogLevel=Info --LogPrefix=HKTService^
            --StdOutput=auto --StdError=auto ^
            --Startup=manual
  goto :status
)

IF "%COMMAND%"=="remove" (
  echo Remove %SERVICE_NAME%
  %PRUNSRV% delete %SERVICE_NAME%
  goto :end
)

IF "%COMMAND%"=="run" (
  echo Run %SERVICE_NAME%
  %PRUNSRV% run %SERVICE_NAME%
  goto :status
)

IF "%COMMAND%"=="start" (
  echo Start %SERVICE_NAME%
  %PRUNSRV% start %SERVICE_NAME%
  goto :status
)

IF "%COMMAND%"=="stop" (
  echo Stop %SERVICE_NAME%
  %PRUNSRV% stop %SERVICE_NAME%
  goto :status
)

:status
  sc query HKTService

:end

