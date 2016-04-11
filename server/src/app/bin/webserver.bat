@echo off

set HSQLDB_OPTS=^
 -Djdbc.driver=org.hsqldb.jdbcDriver^
 -Djdbc.url=jdbc:hsqldb:mem:hkt^
 -Djdbc.user=sa -Djdbc.password=

set MYSQL_URL="jdbc:mysql://localhost:3306/kpidb?createDatabaseIfNotExist=true&useUnicode=yes&characterEncoding=utf8"
set MYSQLDB_OPTS=^
 -Djdbc.driver=org.gjt.mm.mysql.Driver^
 -Djdbc.url=%MYSQL_URL%^
 -Djdbc.user=kpi -Djdbc.password=kpi^
 -Dhibernate.dialect=org.hibernate.dialect.MySQL5Dialect


set DB_OPTS=%MYSQLDB_OPTS%

:parse_arguments
  IF NOT "%1"=="" (
    IF "%1"=="-mysql" (
      set DB_OPTS=%MYSQLDB_OPTS%
    )
    IF "%1"=="-hsql" (
      set DB_OPTS=%HSQLDB_OPTS%
    )
    SHIFT
    GOTO :parse_arguments
  )

ECHO DB_OPTS = %DB_OPTS%

java -Djava.ext.dirs=..\lib %DB_OPTS% com.hkt.server.http.JettyWebServer -webapp ../webapps -port 7080
