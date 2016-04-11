@echo off


set  CURRENT_DIR=%CD%
set  LIB_DIR=%CURRENT_DIR%\..\lib

set PRUNSRV=%CURRENT_DIR%\win64\prunsrv.exe


%PRUNSRV% //IS//HKTService --DisplayName="HKTService"^
          --Install=%PRUNSRV% --Jvm=auto --StartMode=jvm --StopMode=jvm ^
          --StartClass=com.hkt.server.DeamonServer --StartMethod=main --StartParams=start ^
          --StopClass=com.hkt.server.DeamonServer --StopMethod=main --StopParams=stop ^
          ++JvmOptions -Djava.ext.dirs=%LIB_DIR% ^
          --LogPath=%CURRENT_DIR%\logs --LogLevel=Info --LogPrefix=HKTService ^
          --StdOutput=%CURRENT_DIR%\logs\stdout.txt --StdError=%CURRENT_DIR%\logs\stderr.txt
